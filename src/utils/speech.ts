/**
 * Web Speech API and Emergency Broadcast Audio synthesizer
 */

class AudioSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Play an institutional dual-tone emergency chime before broadcast
   */
  public playEmergencyChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
          resolve();
          return;
        }

        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        }

        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.18); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.36); // G5

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.7);

        osc.onended = () => resolve();
      } catch (err) {
        console.warn('Emergency audio chime not supported on current device', err);
        resolve();
      }
    });
  }

  /**
   * Speak advisory text
   */
  public async speak(
    text: string,
    langCode: string,
    onEnd?: () => void,
    onError?: (err: unknown) => void
  ): Promise<void> {
    if (!this.synth) {
      if (onError) onError(new Error('Speech synthesis not available in this browser.'));
      return;
    }

    this.stop();
    await this.playEmergencyChime();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Language code map
    const bcp47Map: Record<string, string> = {
      en: 'en-IN',
      or: 'or-IN',
      bn: 'bn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
    };

    utterance.lang = bcp47Map[langCode] || 'en-IN';
    utterance.rate = 0.95; // Slightly measured, authoritative pace
    utterance.pitch = 1.0;

    // Find preferred voice if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.startsWith(utterance.lang) || v.lang.includes(langCode)
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth?.speaking || this.currentUtterance);
  }
}

export const speechSynthesizer = new AudioSynthesizer();
