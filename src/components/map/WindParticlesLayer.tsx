import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { CycloneTrackPoint } from '../../types';

interface WindParticlesLayerProps {
  currentEye: CycloneTrackPoint;
  enabled: boolean;
}

interface Particle {
  lat: number;
  lng: number;
  age: number;
  maxAge: number;
  speedMultiplier: number;
}

export const WindParticlesLayer: React.FC<WindParticlesLayerProps> = ({
  currentEye,
  enabled,
}) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!enabled) {
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    // Create canvas if not created
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'pointer-events-none absolute inset-0 z-[400]';
      const container = map.getContainer();
      container.appendChild(canvas);
      canvasRef.current = canvas;
    }

    const resizeCanvas = () => {
      if (!canvas) return;
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
    };
    resizeCanvas();

    // Initialize particles
    const particleCount = 280;
    const particles: Particle[] = [];
    const maxRadiusDeg = 6.0; // ~650 km

    const spawnParticle = (): Particle => {
      // Spawn within radius of eye with random angle
      const angle = Math.random() * Math.PI * 2;
      // Exponential distribution towards core
      const r = Math.pow(Math.random(), 0.6) * maxRadiusDeg + 0.3;
      return {
        lat: currentEye.lat + Math.sin(angle) * r,
        lng: currentEye.lng + (Math.cos(angle) * r) / Math.cos((currentEye.lat * Math.PI) / 180),
        age: 0,
        maxAge: 40 + Math.random() * 50,
        speedMultiplier: 0.8 + Math.random() * 0.5,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      const p = spawnParticle();
      p.age = Math.random() * p.maxAge; // stagger initial ages
      particles.push(p);
    }
    particlesRef.current = particles;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Animation render loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Semi-transparent fade trail
      ctx.fillStyle = 'rgba(7, 12, 20, 0.16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const eye = currentEye;

      // Northern vs Southern Hemisphere Coriolis direction
      const isNorthernHemisphere = eye.lat >= 0;
      const rotationDir = isNorthernHemisphere ? 1 : -1; // Counter-clockwise in NH, clockwise in SH

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const prevPt = map.latLngToContainerPoint([p.lat, p.lng]);

        // Calculate vector from eye
        const dLat = p.lat - eye.lat;
        const dLng = (p.lng - eye.lng) * Math.cos((eye.lat * Math.PI) / 180);
        const distDeg = Math.sqrt(dLat * dLat + dLng * dLng);

        if (distDeg < 0.25 || distDeg > maxRadiusDeg || p.age >= p.maxAge) {
          particles[i] = spawnParticle();
          continue;
        }

        // Tangential cyclonic velocity + slight inward radial inflow (angle of inflow ~ 20 deg)
        // Tangential velocity profile
        const vTangential = (0.04 / (distDeg + 0.4)) * p.speedMultiplier;
        const vRadial = -0.012 * p.speedMultiplier; // inward draw

        const angle = Math.atan2(dLat, dLng);
        const newAngle = angle + (rotationDir * vTangential);
        const newDist = Math.max(0.2, distDeg + vRadial);

        p.lat = eye.lat + Math.sin(newAngle) * newDist;
        p.lng = eye.lng + (Math.cos(newAngle) * newDist) / Math.cos((eye.lat * Math.PI) / 180);
        p.age += 1;

        const currPt = map.latLngToContainerPoint([p.lat, p.lng]);

        // Color based on velocity/distance to core (matching Zoom Earth wind palette)
        let strokeColor = '#38bdf8'; // cyan for outer
        if (distDeg < 1.0) {
          strokeColor = '#f43f5e'; // red core (>120 km/h)
        } else if (distDeg < 1.8) {
          strokeColor = '#f59e0b'; // amber/orange (80-120 km/h)
        } else if (distDeg < 3.2) {
          strokeColor = '#10b981'; // emerald/green (40-80 km/h)
        } else {
          strokeColor = '#38bdf8'; // cyan/blue (20-40 km/h)
        }

        const alpha = Math.sin((p.age / p.maxAge) * Math.PI);

        ctx.beginPath();
        ctx.moveTo(prevPt.x, prevPt.y);
        ctx.lineTo(currPt.x, currPt.y);
        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = Math.max(0.1, alpha * 0.85);
        ctx.lineWidth = distDeg < 1.8 ? 2.0 : 1.2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const onMapMove = () => {
      resizeCanvas();
    };
    map.on('move', onMapMove);
    map.on('zoom', onMapMove);
    map.on('resize', onMapMove);

    return () => {
      map.off('move', onMapMove);
      map.off('zoom', onMapMove);
      map.off('resize', onMapMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
        canvasRef.current = null;
      }
    };
  }, [map, currentEye, enabled]);

  return null;
};
