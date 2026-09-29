import {
  CycloneTrackPoint,
  ExposureSummary,
  AdvisoryPayload,
  AdvisoryDirective,
  PriorityEvacuationFacility
} from '../types';

export interface MultilingualContent {
  headline: string;
  directives: string[];
  disclaimer: string;
  broadcastScript: string;
}

export const TRANSLATIONS: Record<string, (cycloneName: string, category: string, hours: number, peakSurge: number) => MultilingualContent> = {
  en: (cycloneName, category, hours, peakSurge) => ({
    headline: `URGENT EVACUATION DIRECTIVE: ${category.toUpperCase()} ${cycloneName} LANDFALL EXPECTED IN ${hours} HOURS`,
    directives: [
      `Complete mandatory evacuation of all coastal settlements within 5km of shoreline to Multipurpose Cyclone Shelters before T-6 hours.`,
      `De-energize all 33kV and 11kV electrical feeders located within the projected ${peakSurge}m storm surge inundation envelope to prevent grid electrocution.`,
      `Secure continuous diesel generator supply for all District Headquarters Hospitals and Primary Health Centres; relocate ground-floor medical wards to upper levels.`,
      `Suspend heavy vehicular movements on NH-16 and coastal feeder highways; position quick-response road clearance teams with heavy tree-cutters.`,
      `Activate satellite phones and wireless VHF communications at all Block Development Offices along the coastal belt.`
    ],
    disclaimer: `Official advisory issued under the authority of State Disaster Management Authority in accordance with the Disaster Management Act.`,
    broadcastScript: `Emergency Alert. This is an official advisory from the State Disaster Management Authority. ${category} ${cycloneName} is tracking toward the coast with landfall projected in ${hours} hours. Coastal residents in Bhadrak, Kendrapara, and Balasore must move to designated cyclone shelters immediately. Switch off electrical appliances and stay indoors.`
  }),
  or: (cycloneName, _category, hours, peakSurge) => ({
    headline: `ଜରୁରୀ ସ୍ଥାନାନ୍ତର ନିର୍ଦ୍ଦେଶ: ${cycloneName} ବାତ୍ୟା ଆଗାମୀ ${hours} ଘଣ୍ଟା ମଧ୍ୟରେ ଉପକୂଳ ଛୁଇଁବାର ସମ୍ଭାବନା`,
    directives: [
      `ଉପକୂଳର ୫ କିଲୋମିଟର ପରିସୀମା ମଧ୍ୟରେ ଥିବା ସମସ୍ତ ବସବାସକାରୀଙ୍କୁ ତୁରନ୍ତ ବହୁମୁଖୀ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ସ୍ଥାନାନ୍ତର କରନ୍ତୁ।`,
      `${peakSurge} ମିଟର ଉଚ୍ଚ ଜୁଆର ପ୍ଲାବିତ ଅଞ୍ଚଳରେ ଥିବା ସମସ୍ତ ୩୩ କେଭି ଏବଂ ୧୧ କେଭି ବିଦ୍ୟୁତ ଫିଡରକୁ ବିଚ୍ଛିନ୍ନ କରନ୍ତୁ।`,
      `ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ ଓ ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରଗୁଡ଼ିକରେ ଜରୁରୀକାଳୀନ ଜେନେରେଟର ଓ ଅମ୍ଳଜାନ ବ୍ୟବସ୍ଥା ସୁନିଶ୍ଚିତ କରନ୍ତୁ।`,
      `ଜାତୀୟ ରାଜପଥ-୧୬ ଏବଂ ଉପକୂଳ ସଂଯୋଗକାରୀ ରାସ୍ତାରେ ଯାନବାହନ ଚଳାଚଳ ସ୍ଥଗିତ ରଖନ୍ତୁ।`,
      `ପଞ୍ଚାୟତ ଓ ବ୍ଲକ କାର୍ଯ୍ୟାଳୟଗୁଡ଼ିକରେ ଭିଏଚଏଫ ବେତାର ଯୋଗାଯୋଗ ବ୍ୟବସ୍ଥା କାର୍ଯ୍ୟକ୍ଷମ ରଖନ୍ତୁ।`
    ],
    disclaimer: `ରାଜ୍ୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷଙ୍କ ଦ୍ୱାରା ଜାରି କରାଯାଇଥିବା ସରକାରୀ ନିର୍ଦ୍ଦେଶନାମା।`,
    broadcastScript: `ଜରୁରୀ ସତର୍କ ସୂଚନା। ରାଜ୍ୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷଙ୍କ ତରଫରୁ ବାତ୍ୟା ସତର୍କତା। ବାତ୍ୟା ${cycloneName} ଆଗାମୀ ${hours} ଘଣ୍ଟା ମଧ୍ୟରେ ଉପକୂଳ ଅତିକ୍ରମ କରିବ। ସମସ୍ତ ଉପକୂଳବାସୀ ତୁରନ୍ତ ନିକଟସ୍ଥ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ଚାଲିଯାଆନ୍ତୁ। ନିରାପଦରେ ରୁହନ୍ତୁ।`
  }),
  bn: (cycloneName, _category, hours, peakSurge) => ({
    headline: `জরুরি স্থানান্তর নির্দেশিকা: ঘূর্ণিঝড় ${cycloneName} আগামী ${hours} ঘণ্টার মধ্যে উপকূল অতিক্রম করবে`,
    directives: [
      `উপকূলবর্তী ৫ কিমি এলাকার সমস্ত বাসিন্দাদের অবিলম্বে বহুমুখী ঘূর্ণিঝড় আশ্রয়কেন্দ্রে সরিয়ে নিন।`,
      `${peakSurge} মিটার জলোচ্ছ্বাস সম্ভাব্য এলাকায় সমস্ত বৈদ্যুতিক ফিডার লাইন বিচ্ছিন্ন করুন।`,
      `হাসপাতাল ও স্বাস্থ্যকেন্দ্রে নিরবচ্ছিন্ন বিদ্যুৎ ও পর্যাপ্ত অক্সিজেন নিশ্চিত করুন।`,
      `উপকূলীয় প্রধান সড়কে ভারী যান চলাচল নিষিদ্ধ করুন এবং উদ্ধারকারী দল মোতায়েন রাখুন।`,
      `ব্লক কন্ট্রোল রুমে ওয়্যারলেস যোগাযোগ সক্রিয় রাখুন।`
    ],
    disclaimer: `রাজ্য দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ কর্তৃক জারিকৃত সরকারি নির্দেশিকা।`,
    broadcastScript: `জরুরি সতর্কতা। ঘূর্ণিঝড় ${cycloneName} আগামী ${hours} ঘণ্টার মধ্যে উপকূলে আঘাত হানবে। উপকূলবর্তী সমস্ত নাগরিক অবিলম্বে সরকারি আশ্রয়কেন্দ্রে চলে যান।`
  }),
  te: (cycloneName, _category, hours, peakSurge) => ({
    headline: `అత్యవసర తరలింపు ఆదేశాలు: తుఫాను ${cycloneName} రాబోయే ${hours} గంటల్లో తీరం దాటే అవకాశం`,
    directives: [
      `తీరప్రాంతం నుండి 5 కిలోమీటర్ల లోపల ఉన్న ప్రజలను వెంటనే తుఫాను పునరావాస కేంద్రాలకు తరలించండి.`,
      `${peakSurge} మీటర్ల ఆటుపోట్లు వచ్చే ప్రాంతాలలో విద్యుత్ సరఫరాను తక్షణమే నిలిపివేయండి.`,
      `ప్రభుత్వ ఆసుపత్రులలో డీజిల్ జనరేటర్లు మరియు ఆక్సిజన్ నిల్వలను సిద్ధంగా ఉంచండి.`,
      `జాతీయ రహదారి-16 పై రవాణాను నియంత్రించండి మరియు సహాయక బృందాలను రంగంలోకి దించండి.`,
      `తీరప్రాంత మండల కార్యాలయాలలో వైర్‌లెస్ కమ్యూనికేషన్ నెట్‌వర్క్‌ను ప్రారంభించండి.`
    ],
    disclaimer: `రాష్ట్ర విపత్తు నిర్వహణ సంస్థ జారీ చేసిన అధికారిక ఆదేశం.`,
    broadcastScript: `అత్యవసర హెచ్చరిక. తుఫాను ${cycloneName} రాబోయే ${hours} గంటల్లో తీరాన్ని తాకనుంది. తీరప్రాంత ప్రజలు వెంటనే సమీపంలోని తుఫాను సహాయ కేంద్రాలకు చేరుకోవాలి.`
  }),
  ta: (cycloneName, _category, hours, peakSurge) => ({
    headline: `அவசர வெளியேற்ற உத்தரவு: புயல் ${cycloneName} அடுத்த ${hours} மணி நேரத்தில் கரையை கடக்கும்`,
    directives: [
      `கடற்கரையிலிருந்து 5 கிமீ எல்லைக்குள் உள்ள மக்களை உடனடியாக புயல் நிவாரண முகாம்களுக்கு மாற்றவும்.`,
      `${peakSurge} மீட்டர் கடல் அலை அபாயப் பகுதிகளில் மின் விநியோகத்தை துண்டிக்கவும்.`,
      `அரசு மருத்துவமனைகளில் தடையில்லா மின்சாரம் மற்றும் ஆக்சிஜன் இருப்பதை உறுதி செய்யவும்.`,
      `கடலோர நெடுஞ்சாலைகளில் கனரக வாகனப் போக்குவரத்தை தற்காலிகமாக நிறுத்தவும்.`,
      `கட்டுப்பாட்டு அறைகளில் வயர்லெஸ் தகவல்தொடர்புகளை தயார் நிலையில் வைக்கவும்.`
    ],
    disclaimer: `மாநில பேரிடர் மேலாண்மை ஆணையத்தால் வெளியிடப்பட்ட அதிகாரப்பூர்வ உத்தரவு.`,
    broadcastScript: `அவசர அறிவிப்பு. புயல் ${cycloneName} அடுத்த ${hours} மணி நேரத்தில் கரையை கடக்கும். பொதுமக்கள் அனைவரும் பாதுகாப்பான நிவாரண முகாம்களுக்கு செல்லுமாறு அறிவுறுத்தப்படுகிறார்கள்.`
  }),
  hi: (cycloneName, _category, hours, peakSurge) => ({
    headline: `आपातकालीन निकासी निर्देश: चक्रवात ${cycloneName} अगले ${hours} घंटों में तट से टकराएगा`,
    directives: [
      `तट से 5 किमी के दायरे में आने वाले सभी संवेदनशील क्षेत्रों को तत्काल बहुउद्देश्यीय चक्रवात आश्रयों में स्थानांतरित करें।`,
      `${peakSurge} मीटर समुद्री लहरों के संभावित क्षेत्र में 33kV और 11kV विद्युत फीडरों को तुरंत बंद करें।`,
      `जिला अस्पतालों और प्राथमिक स्वास्थ्य केंद्रों में आपातकालीन बिजली और ऑक्सीजन की आपूर्ति सुनिश्चित करें।`,
      `तटीय राजमार्गों पर भारी वाहनों का आवागमन स्थगित करें और पेड़ हटाने वाले दलों को तैनात रखें।`,
      `सभी ब्लॉक नियंत्रण कक्षों में उपग्रह फोन और वायरलेस संचार प्रणाली को सक्रिय रखें।`
    ],
    disclaimer: `राज्य आपदा प्रबंधन प्राधिकरण द्वारा आपदा प्रबंधन अधिनियम के अंतर्गत जारी आधिकारिक निर्देश।`,
    broadcastScript: `आपातकालीन चेतावनी। राज्य आपदा प्रबंधन प्राधिकरण द्वारा चक्रवात अलर्ट। चक्रवात ${cycloneName} अगले ${hours} घंटों में तट से टकराएगा। सभी तटीय निवासी तुरंत सुरक्षित चक्रवात आश्रयों में पहुंचें।`
  })
};

/**
 * Generate complete structured advisory payload
 */
export function generateAdvisory(
  cycloneName: string,
  currentEye: CycloneTrackPoint,
  exposure: ExposureSummary,
  language = 'en'
): AdvisoryPayload {
  const hours = Math.max(2, currentEye.offsetHours < 0 ? Math.abs(currentEye.offsetHours) : 6);
  const peakSurge = exposure.peakSurgeBandMaxMeters || currentEye.surgeEstimateMeters;

  const translationFn = TRANSLATIONS[language] || TRANSLATIONS.en;
  const content = translationFn(cycloneName, currentEye.category, hours, peakSurge);

  // Sectoral Directives
  const immediateDirectives: AdvisoryDirective[] = [
    {
      sector: 'Power & Energy Grid',
      directive: `De-energize 33kV coastal substations across ${exposure.byAssetType.substation} identified critical nodes prior to gale force onset.`,
      targetAuthority: 'OPTCL / State Power Transmission Corporation',
      urgency: 'IMMEDIATE',
    },
    {
      sector: 'Public Health & Medical Services',
      directive: `Relocate ICU beds and life-support wards in ${exposure.byAssetType.hospital} coastal healthcare facilities above ground-floor flood line.`,
      targetAuthority: 'Directorate of Health & Family Welfare',
      urgency: 'IMMEDIATE',
    },
    {
      sector: 'Evacuation & Shelter Logistics',
      directive: `Activate ${exposure.byAssetType.shelter} Multipurpose Cyclone Shelters. Ensure 72-hour provisions of potable water, halogen tablets, and dry rations.`,
      targetAuthority: 'District Collectors & Block Development Officers',
      urgency: 'IMMEDIATE',
    },
    {
      sector: 'Highways & Transport Connectivity',
      directive: `Station heavy mechanical earthmovers and chainsaw disaster teams at 10km intervals along coastal arterial corridors.`,
      targetAuthority: 'National Highways Authority & State PWD',
      urgency: 'HIGH_PRIORITY',
    }
  ];

  // Priority facilities for immediate action
  const priorityFacilities: PriorityEvacuationFacility[] = exposure.severeAssets.slice(0, 6).map((item) => ({
    assetName: item.asset.name,
    assetType: item.asset.type,
    district: item.asset.district,
    riskBand: item.riskBand,
    actionRequired: item.recommendedAction,
  }));

  // List of affected administrative districts
  const districtSet = new Set<string>();
  exposure.severeAssets.forEach((item) => districtSet.add(item.asset.district));
  exposure.allExposed.slice(0, 10).forEach((item) => districtSet.add(item.asset.district));
  const affectedDistricts = Array.from(districtSet);

  return {
    advisoryId: `ADV-${cycloneName.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString().slice(-6)}`,
    cycloneName,
    category: currentEye.category,
    hoursToLandfall: hours,
    severityHeadline: content.headline,
    bulletinTimeUtc: new Date().toISOString(),
    affectedDistricts: affectedDistricts.length > 0 ? affectedDistricts : ['Bhadrak', 'Kendrapara', 'Balasore', 'Jagatsinghpur'],
    immediateDirectives,
    priorityFacilities,
    targetLanguage: language,
    speechText: content.broadcastScript,
  };
}
