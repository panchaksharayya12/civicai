import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  Mic, 
  MicOff, 
  Upload, 
  Sparkles, 
  Check, 
  Navigation, 
  FileText,
  Scan,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Layers,
  Crosshair,
  ArrowRight,
  Phone,
  PhoneCall,
  Copy,
  HeartPulse,
  Flame,
  Building2,
  Droplets,
  Shield,
  AlertTriangle,
  UserCheck,
  Lock,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  Search,
  X,
  Globe
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { DEMO_PRESETS, SAMPLE_IMAGES, OFFLINE_SVG_POTHOLE_BEFORE, SUGGESTED_AREAS, SuggestedArea } from '../data/mockData';
import { CivicIssue } from '../types';

export const CitizenHome: React.FC = () => {
  const { 
    setStagedReport, 
    setAnalysisModalOpen, 
    playUiSound,
    currentUser,
    setIsAuthModalOpen,
    requireAuth,
    detectedLocation,
    isLocating,
    emergencyServices,
    detectLocationAndEmergencies,
    setCustomLocation
  } = useCivic();

  // Form State
  const [location, setLocation] = useState(
    detectedLocation?.address || 'Electronic City Phase 1, Near Infosys Gate 3, Bengaluru'
  );
  const [description, setDescription] = useState('Severe road pothole in the center lane right next to the bus stop. Multiple two-wheelers nearly crashed this morning due to rain water masking the depth.');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [isCustomOther, setIsCustomOther] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [emergencyCategory, setEmergencyCategory] = useState<string>('ALL');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');

  // Filtered suggested areas based on manual typing and whole-city zone filter
  const filteredSuggestedAreas = useMemo(() => {
    const query = location.toLowerCase().trim();
    let list = SUGGESTED_AREAS;

    if (selectedZoneFilter !== 'ALL') {
      list = list.filter((area) => {
        if (selectedZoneFilter === 'Central') return area.zone.includes('Central') || area.tag === 'Central' || area.tag === 'Whole City';
        if (selectedZoneFilter === 'South') return area.zone.includes('South') || area.zone.includes('Bommanahalli') || area.tag === 'Whole City';
        if (selectedZoneFilter === 'East') return area.zone.includes('East') || area.zone.includes('Mahadevapura') || area.tag === 'Whole City';
        if (selectedZoneFilter === 'North') return area.zone.includes('Yelahanka') || area.name.includes('Hebbal') || area.name.includes('Manyata') || area.tag === 'Whole City';
        if (selectedZoneFilter === 'West') return area.zone.includes('West') || area.zone.includes('Dasarahalli') || area.zone.includes('RR Nagar') || area.tag === 'Whole City';
        if (selectedZoneFilter === 'Tech Hubs') return area.tag === 'Tech Hub' || area.tag === 'Whole City';
        return true;
      });
    }

    if (!query) return list;

    return list.filter(
      (area) =>
        area.name.toLowerCase().includes(query) ||
        area.address.toLowerCase().includes(query) ||
        area.zone.toLowerCase().includes(query) ||
        area.ward.toLowerCase().includes(query) ||
        (query.includes('bengaluru') || query.includes('bangalore'))
    );
  }, [location, selectedZoneFilter]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(e.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestedLocation = (area: SuggestedArea) => {
    setLocation(area.address);
    setCustomLocation(area.address, area.lat, area.lng);
    setIsLocationDropdownOpen(false);
    playUiSound('beep');
  };

  // Auto-sync location when GPS resolves
  useEffect(() => {
    if (detectedLocation) {
      setLocation(detectedLocation.address);
    }
  }, [detectedLocation]);

  const handleSelectPreset = (index: number) => {
    setIsCustomOther(false);
    setCustomCategory('');
    const preset = DEMO_PRESETS[index];
    setSelectedPreset(index);
    // Do NOT preload preset.image - keep it clean for citizen photo upload just like in Others
    setLocation(preset.location);
    setDescription(preset.description);
    setCustomLocation(preset.location, preset.coordinates[0], preset.coordinates[1]);
    playUiSound('beep');
  };

  const handleSelectOthers = () => {
    setIsCustomOther(true);
    setSelectedPreset(-1);
    setDescription('');
    setCustomCategory('');
    setSelectedImage(''); // clear loaded image so user can upload their own photo
    playUiSound('beep');
    setTimeout(() => {
      const el = document.getElementById('citizen-intake-form');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleDetectLocation = async () => {
    await detectLocationAndEmergencies();
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
      playUiSound('beep');
    } else {
      setIsRecording(true);
      playUiSound('beep');
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || 
                                (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              setDescription((prev) => `${prev} [Voice Transcription: "${transcript}"]`);
              playUiSound('success');
            }
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
          };

          recognition.onerror = () => {
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
          };

          recognition.start();
        } catch {
          simulateVoiceAutoTranscribe();
        }
      } else {
        simulateVoiceAutoTranscribe();
      }
    }
  };

  const simulateVoiceAutoTranscribe = () => {
    setTimeout(() => {
      setDescription(
        'Severe road crater right in front of gate 3. Water filled the pothole and two-wheelers are swerving abruptly into incoming traffic.'
      );
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      playUiSound('success');
    }, 3500);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 960;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.75);
              setSelectedImage(compressed);
            } else {
              setSelectedImage(reader.result as string);
            }
            setSelectedPreset(-1);
            playUiSound('beep');
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyNumber = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedPhone(id);
    playUiSound('beep');
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const renderEmergencyIcon = (category: string) => {
    switch (category) {
      case 'Police': return <Shield className="w-4 h-4 text-sky-600" />;
      case 'Medical': return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'Fire': return <Flame className="w-4 h-4 text-amber-600" />;
      case 'Municipal': return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'Electricity': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'Water': return <Droplets className="w-4 h-4 text-cyan-600" />;
      default: return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleTriggerAnalysis = () => {
    // If no photo is uploaded, prompt user and open file picker
    if (!selectedImage) {
      playUiSound('alert');
      const uploadEl = document.getElementById('defect-upload-section');
      uploadEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fileInputRef.current?.click();
      return;
    }

    playUiSound('scan');

    const customTitle = customCategory.trim() || 'Custom Civic Defect';
    const customDesc = description.trim() || 'Reported civic issue requiring immediate municipal attention.';
    
    // Auto-infer department based on user's typed issue title and description
    const textToAnalyze = `${customTitle} ${customDesc}`.toLowerCase();
    let inferredDept: any = 'Municipal Roads';
    if (textToAnalyze.includes('water') || textToAnalyze.includes('pipe') || textToAnalyze.includes('drain') || textToAnalyze.includes('sewage') || textToAnalyze.includes('leak') || textToAnalyze.includes('flood') || textToAnalyze.includes('manhole')) {
      inferredDept = 'Water & Sewerage';
    } else if (textToAnalyze.includes('garbage') || textToAnalyze.includes('waste') || textToAnalyze.includes('dump') || textToAnalyze.includes('trash') || textToAnalyze.includes('clean') || textToAnalyze.includes('debris')) {
      inferredDept = 'Solid Waste Management';
    } else if (textToAnalyze.includes('light') || textToAnalyze.includes('electric') || textToAnalyze.includes('wire') || textToAnalyze.includes('pole') || textToAnalyze.includes('dark') || textToAnalyze.includes('power')) {
      inferredDept = 'Electricity & Lighting';
    } else if (textToAnalyze.includes('traffic') || textToAnalyze.includes('signal') || textToAnalyze.includes('sign') || textToAnalyze.includes('speed') || textToAnalyze.includes('camera')) {
      inferredDept = 'Traffic & Safety';
    } else {
      inferredDept = 'Municipal Roads';
    }

    const preset = (selectedPreset >= 0 && !isCustomOther) ? DEMO_PRESETS[selectedPreset] : null;

    const staged: Partial<CivicIssue> = (isCustomOther || !preset) ? {
      title: customTitle,
      description: customDesc,
      category: customTitle as any,
      severity: 'High',
      severityScore: 85,
      locationName: location || (detectedLocation ? detectedLocation.address : 'Electronic City Phase 1, Bengaluru'),
      coordinates: detectedLocation ? [detectedLocation.lat, detectedLocation.lng] : [12.8452, 77.6602],
      potentialImpact: 'Public safety hazard & municipal infrastructure impediment',
      duplicateCount: 1,
      duplicateDistanceMeters: 0,
      department: inferredDept,
      imageUrl: selectedImage || SAMPLE_IMAGES.potholeBefore,
      confidence: 96.0,
      reporterName: currentUser ? currentUser.name : 'Verified Citizen',
      source: 'User Portal',
      isUserSubmitted: true,
    } : {
      title: preset.label,
      description: description || preset.description,
      category: preset.category,
      severity: preset.severity,
      severityScore: preset.severityScore,
      locationName: location || (detectedLocation ? detectedLocation.address : preset.location),
      coordinates: detectedLocation ? [detectedLocation.lat, detectedLocation.lng] : preset.coordinates,
      potentialImpact: preset.impact,
      duplicateCount: preset.duplicateCount,
      duplicateDistanceMeters: 110,
      department: preset.department,
      imageUrl: selectedImage || preset.image,
      confidence: preset.confidence,
      reporterName: currentUser ? currentUser.name : 'Verified Citizen',
      source: 'User Portal',
      isUserSubmitted: true,
    };

    setStagedReport(staged);
    setAnalysisModalOpen(true);
  };

  const filteredEmergencies = emergencyServices.filter((srv) => {
    if (emergencyCategory === 'ALL') return true;
    return srv.category.toLowerCase() === emergencyCategory.toLowerCase();
  });

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-24 overflow-hidden">
      
      {/* Background Typographic Watermark */}
      <div 
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-4 left-0 right-0 flex justify-center overflow-hidden z-0"
      >
        <span className="font-display text-[13vw] sm:text-[15vw] font-black uppercase tracking-[-0.05em] leading-[0.8] text-slate-200/50 whitespace-nowrap">
          CIVIC RESOLUTION
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 sm:pt-14">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-mono uppercase tracking-wider mb-4 shadow-sm">
            <Scan className="w-3.5 h-3.5 text-sky-400" />
            <span>Autonomous Closed-Loop Civic Triage</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 font-display leading-[1.05] mb-4">
            Autonomous Public Issue <br />
            <span className="text-sky-600">Resolution at Scale.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto font-sans leading-relaxed">
            The rare light civic engine: computer vision diagnoses municipal hazards in real time, clusters duplicates, and enforces verified physical closure.
          </p>
        </div>

        {/* =========================================================
            VISOR SIGNATURE ELEMENT 2:
            ROUNDED 16:9 VISOR FRAME
           ========================================================= */}
        {(() => {
          const currentPreset = selectedPreset >= 0 ? DEMO_PRESETS[selectedPreset] : null;
          const heroImage = selectedImage || currentPreset?.image || SAMPLE_IMAGES.potholeBefore;
          const heroCategory = isCustomOther && customCategory.trim() ? customCategory : (currentPreset?.category || 'Road Pothole');
          const heroConfidence = currentPreset?.confidence || 96.4;
          const heroCoordinates = currentPreset?.coordinates || [12.8452, 77.6602];
          const heroLocation = location ? location.split(',')[0] : (currentPreset?.location.split(',')[0] || 'Electronic City Ph 1');
          const heroSeverity = currentPreset?.severity || 'High';
          const heroSeverityScore = currentPreset?.severityScore || 88;
          const heroDuplicates = currentPreset?.duplicateCount ?? 3;
          const heroDepthLabel = 
            heroCategory === 'Road Pothole' ? 'DEPTH: ~12cm | CLEARANCE: REQ' :
            heroCategory === 'Garbage Dump' ? 'VOLUME: ~2.4m³ | BIO-HAZARD: LEVEL 2' :
            heroCategory === 'Broken Streetlight' ? 'LUX: 0.2 (NIGHT BLIND) | CIRCUIT: FAULT' :
            'HAZARD: ANOMALY FLAGGED';

          return (
            <div className="relative max-w-4xl mx-auto mb-12">
              <div className="visor-lens-frame p-2 shadow-2xl">
                <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-950">
                  <img
                    src={heroImage}
                    alt="Visor Lens Scan"
                    className="w-full h-full object-cover transition-all duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = OFFLINE_SVG_POTHOLE_BEFORE;
                    }}
                  />

                  {/* Optic Telemetry & HUD Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Laser Scanline */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-visor-scan pointer-events-none"></div>

                  {/* Corner Optic Crosshairs */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-white font-mono text-[11px] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <Crosshair className="w-3.5 h-3.5 text-sky-400 animate-spin [animation-duration:10s]" />
                    <span>VISOR LENS: OPTIC 1080P</span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2 text-white font-mono text-[11px] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>MODEL CONFIDENCE: {heroConfidence}%</span>
                  </div>

                  {/* Bounding Box on the Hazard */}
                  <div className="absolute top-[30%] left-[28%] w-[44%] h-[44%] border-2 border-dashed border-sky-400 rounded-2xl bg-sky-500/10 pointer-events-none flex flex-col justify-between p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-sky-950/90 text-sky-200 px-2 py-0.5 rounded-md border border-sky-400/50">
                        TARGET: {heroCategory}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-300 bg-black/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
                        {heroDepthLabel}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white text-xs bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 font-bold">LAT/LNG:</span>
                      <span>{heroCoordinates[0]}° N, {heroCoordinates[1]}° E</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-300">{heroLocation}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">SEVERITY: {heroSeverity.toUpperCase()} ({heroSeverityScore}/100)</span>
                      <span className="text-emerald-400">DUPLICATES: {heroDuplicates} MERGED</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

        {/* =========================================================
            VISOR SIGNATURE ELEMENT 3:
            THREE CARDS FANNED AT OPPOSING ANGLES BENEATH IT
           ========================================================= */}
        <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Fanned Card 1 (Left - Tilted -2.5°) */}
          <div className="visor-card-fan-left visor-panel-elevated rounded-3xl p-6 relative border border-slate-200 shadow-xl cursor-default">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold mb-3 shadow-sm">
              <Scan className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase font-bold text-sky-600 block mb-1">
              Fanned Claim // 01
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5">
              Computer Vision Triage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Autonomous neural classification tags defect depth, road base erosion, and severity score (88/100) in 142ms.
            </p>
          </div>

          {/* Fanned Card 2 (Center - Elevated) */}
          <div className="visor-card-fan-center visor-panel-elevated rounded-3xl p-6 relative border-2 border-slate-900 shadow-2xl cursor-default bg-white z-10">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold mb-3 shadow-md">
              <Layers className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-[11px] font-mono uppercase font-bold text-slate-900 block mb-1">
              Fanned Claim // 02
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5">
              110m Spatial Clustering
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Aggregates redundant citizen complaints into a single prioritized dispatch ticket to eliminate call-center spam.
            </p>
          </div>

          {/* Fanned Card 3 (Right - Tilted +2.5°) */}
          <div className="visor-card-fan-right visor-panel-elevated rounded-3xl p-6 relative border border-slate-200 shadow-xl cursor-default">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold mb-3 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase font-bold text-emerald-600 block mb-1">
              Fanned Claim // 03
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5">
              Zero Ghost Closures
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Contractor repairs require AI Before/After surface audit and citizen confirmation before closing Ticket #CA1024.
            </p>
          </div>

        </div>

        {/* User Account & Credentials Status Banner */}
        {currentUser ? (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center font-mono shrink-0 shadow-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
                    Verified {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Registered: {currentUser.ward} • Priority dispatch attached to your verified citizen ID
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold self-start sm:self-auto flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Credentials Active
            </span>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-mono shrink-0 shadow-sm">
                <Lock className="w-5 h-5 text-sky-100" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Step 1: Create Citizen Credentials First</h4>
                <p className="text-[11px] text-slate-600">
                  Municipal regulations require citizens to create an account and password before filing complaints to prevent ghost spam.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setIsAuthModalOpen(true); playUiSound('beep'); }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Create Account / Sign In</span>
            </button>
          </div>
        )}

        {/* One-Click Scenario Presets */}
        <div className="max-w-4xl mx-auto mb-8 visor-panel rounded-3xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              1-Click Demo Scenarios:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Instant Presets</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DEMO_PRESETS.map((preset, idx) => (
              <button
                key={preset.label}
                onClick={() => handleSelectPreset(idx)}
                className={`p-3.5 rounded-2xl text-left text-xs font-medium transition-all border ${
                  selectedPreset === idx && !isCustomOther
                    ? 'bg-slate-900 text-white shadow-lg border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold truncate font-display text-sm">{preset.category}</div>
                <div className="text-[10px] flex items-center justify-between mt-2 font-mono">
                  <span className={selectedPreset === idx && !isCustomOther ? 'text-sky-300' : 'text-slate-500'}>
                    {preset.severity}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                    selectedPreset === idx && !isCustomOther ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {preset.duplicateCount} dups
                  </span>
                </div>
              </button>
            ))}

            {/* 4th Item: Others (Custom Issue Option) */}
            <button
              type="button"
              onClick={handleSelectOthers}
              className={`p-3.5 rounded-2xl text-left text-xs font-medium transition-all border ${
                isCustomOther
                  ? 'bg-sky-600 text-white shadow-lg border-sky-600 ring-2 ring-sky-300'
                  : 'bg-white border-2 border-dashed border-sky-300 text-slate-700 hover:border-sky-500 hover:bg-sky-50/50'
              }`}
            >
              <div className="font-bold truncate font-display text-sm flex items-center gap-1.5">
                <PlusCircle className={`w-4 h-4 ${isCustomOther ? 'text-white' : 'text-sky-600'}`} />
                <span>Others</span>
              </div>
              <div className="text-[10px] flex items-center justify-between mt-2 font-mono">
                <span className={isCustomOther ? 'text-sky-100' : 'text-sky-600 font-bold'}>
                  Custom Issue
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                  isCustomOther ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700 font-bold'
                }`}>
                  Type & Photo
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Citizen Intake Interactive Card */}
        <div id="citizen-intake-form" className="max-w-4xl mx-auto visor-panel-elevated rounded-3xl p-6 sm:p-10 space-y-7 border border-slate-200 shadow-xl">
          
          {/* Custom Issue Name & Category Input when Others is selected */}
          {isCustomOther && (
            <div className="p-4 rounded-2xl bg-sky-50/90 border-2 border-sky-300 space-y-2 animate-in fade-in slide-in-from-top-2 shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-sky-900 font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-sky-600" />
                  Type Your Issue / Defect Name
                </span>
                <span className="text-[11px] text-sky-700 font-normal">Custom Problem Category</span>
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Fallen Tree, Water Pipeline Burst, Broken Footpath, Illegal Dumping, Open Wire..."
                className="w-full bg-white border border-sky-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium shadow-xs"
                autoFocus
              />
              <p className="text-[11px] text-sky-700 font-mono">
                ✦ Type any civic hazard here. You can also upload a photo below and describe it.
              </p>
            </div>
          )}

          {/* Location */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-900">
                <MapPin className="w-4 h-4 text-sky-600" />
                1. Detect / Select Location (Whole Bengaluru Coverage)
              </span>
              <span className="text-slate-500 text-[11px] font-normal flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                BBMP Municipal Geocoding (198 Wards)
              </span>
            </label>

            <div className="relative flex items-center">
              <input
                ref={locationInputRef}
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setIsLocationDropdownOpen(true);
                  if (e.target.value.trim().length > 3) {
                    setCustomLocation(e.target.value);
                  }
                }}
                onFocus={() => setIsLocationDropdownOpen(true)}
                placeholder="Search whole Bengaluru or type specific street/landmark (e.g. Koramangala, Whitefield, Hebbal)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 pl-11 pr-36 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition shadow-2xs font-medium"
              />
              <div className="absolute left-3.5 text-sky-600">
                <MapPin className="w-4 h-4" />
              </div>

              {/* Action buttons inside right of input */}
              <div className="absolute right-2 flex items-center gap-1">
                {location && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocation('');
                      setIsLocationDropdownOpen(true);
                      locationInputRef.current?.focus();
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/70 transition"
                    title="Clear location"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition shadow-sm whitespace-nowrap"
                  title="Detect live GPS coordinates"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-400' : 'text-sky-400'}`} />
                  <span>{isLocating ? 'Locating...' : 'Auto Detect'}</span>
                </button>
              </div>
            </div>

            {/* Auto-suggested areas dropdown menu */}
            {isLocationDropdownOpen && (
              <div 
                ref={dropdownRef}
                className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-80 overflow-y-auto"
              >
                {/* Header with Zone Filter Pills */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Search className="w-3.5 h-3.5 text-sky-600" />
                      Bengaluru Locations & Municipal Wards ({filteredSuggestedAreas.length})
                    </span>
                    <span className="text-slate-500">Tap to Select</span>
                  </div>

                  {/* Zone quick filters */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px] font-mono">
                    {[
                      { id: 'ALL', label: 'All Bengaluru' },
                      { id: 'Central', label: 'Central' },
                      { id: 'South', label: 'South' },
                      { id: 'East', label: 'East & ORR' },
                      { id: 'North', label: 'North' },
                      { id: 'West', label: 'West' },
                      { id: 'Tech Hubs', label: 'Tech Corridors' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedZoneFilter(tab.id)}
                        className={`px-2 py-0.5 rounded-lg font-semibold transition whitespace-nowrap ${
                          selectedZoneFilter === tab.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredSuggestedAreas.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {filteredSuggestedAreas.map((area) => {
                      const isCurrent = location.toLowerCase().includes(area.name.toLowerCase()) || 
                                       (area.tag === 'Whole City' && (location.includes('Bengaluru Urban') || location.includes('Whole Bengaluru')));
                      const isWholeCity = area.tag === 'Whole City';

                      return (
                        <button
                          key={area.name}
                          type="button"
                          onClick={() => handleSelectSuggestedLocation(area)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-sky-50 transition flex items-start gap-3 group ${
                            isCurrent ? 'bg-sky-50/70 border-l-4 border-l-sky-600' : ''
                          } ${isWholeCity ? 'bg-gradient-to-r from-sky-50/60 to-emerald-50/40' : ''}`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                            isWholeCity 
                              ? 'bg-sky-600 text-white' 
                              : isCurrent ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600'
                          }`}>
                            {isWholeCity ? <Globe className="w-4 h-4 text-white" /> : <MapPin className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold truncate ${isWholeCity ? 'text-sky-950 font-display' : 'text-slate-900 group-hover:text-sky-900'}`}>
                                {area.name}
                              </span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                                isWholeCity 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold' 
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {area.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5">
                              {area.address}
                            </div>
                            <div className="text-[10px] font-mono text-slate-600 flex items-center gap-2 mt-0.5">
                              <span>🏛️ {area.ward}</span>
                              <span>•</span>
                              <span>📍 {area.lat.toFixed(4)}° N, {area.lng.toFixed(4)}° E</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">Custom Bengaluru Address Entered</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      "{location}" will be registered as your complaint location.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Suggested Area Pills covering whole Bengaluru */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-600 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Popular Suggested Areas Across Whole Bengaluru (1-Click Selection):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {/* 1st Pill: Prominent Whole Bengaluru */}
                <button
                  type="button"
                  onClick={() => handleSelectSuggestedLocation(SUGGESTED_AREAS[0])}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                    location.includes('Bengaluru Urban') || location.includes('Whole Bengaluru')
                      ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-sky-300 border-slate-900'
                  }`}
                  title="Select Whole Bengaluru City"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Whole Bengaluru</span>
                </button>

                {SUGGESTED_AREAS.slice(1, 14).map((area) => {
                  const isCurrent = location.toLowerCase().includes(area.name.toLowerCase());
                  return (
                    <button
                      key={area.name}
                      type="button"
                      onClick={() => handleSelectSuggestedLocation(area)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border ${
                        isCurrent
                          ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-sky-400' : 'bg-slate-400'}`}></span>
                      <span>{area.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active GPS / Ward Telemetry Badge */}
            {detectedLocation && (
              <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Resolved Zone:</span>
                  <span className="text-slate-900 font-bold">{detectedLocation.area || 'Bengaluru Urban'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>GPS: {detectedLocation.lat.toFixed(4)}° N, {detectedLocation.lng.toFixed(4)}° E</span>
                </div>
              </div>
            )}
          </div>

          {/* Upload / Media Section */}
          <div id="defect-upload-section">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-900">
                <Camera className="w-4 h-4 text-sky-600" />
                2. Upload Defect Evidence
              </span>
              <span className="text-slate-500 text-[11px] font-normal">Vision Classification Ready</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*,video/*"
              className="hidden"
            />

            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-400 hover:border-sky-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-sky-50/50 hover:bg-sky-50/80 transition group shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 mb-3 group-hover:scale-110 shadow-sm transition">
                  <Camera className="w-7 h-7 text-sky-600" />
                </div>
                <p className="text-base font-bold text-slate-900 mb-1 font-display">
                  Click or Tap to Upload Issue Photo
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  Take a photo or choose an image file of the defect from your device
                </p>
                <span className="text-[11px] font-mono text-sky-700 font-semibold bg-white px-3 py-1 rounded-full border border-sky-200">
                  ✦ Neural Vision Model Ready
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group shadow-sm">
                  <img
                    src={selectedImage}
                    alt="Defect"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <div className="flex items-center justify-between w-full text-xs text-white">
                      <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Photo Loaded
                      </span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-medium transition"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-sky-50/30 transition group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 mb-3 group-hover:scale-110 shadow-sm transition">
                    <Upload className="w-5 h-5 text-sky-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1 font-display">
                    Replace or upload new photo
                  </p>
                  <p className="text-xs text-slate-500 mb-2">
                    Click to browse files
                  </p>
                  <span className="text-[11px] font-mono text-sky-600 font-semibold">
                    ✦ Neural Vision Active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Voice Complaint & Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                3. Issue Description & Voice Complaint
              </label>

              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition border ${
                  isRecording
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-rose-600" />
                    <span>Recording ({recordingSeconds}s)... Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-sky-600" />
                    <span>🎙️ Voice Complaint (Speech to Text)</span>
                  </>
                )}
              </button>
            </div>

            {isRecording && (
              <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-xs font-bold text-rose-700 font-mono">Listening to speech...</span>
                </div>
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-rose-500 rounded animate-[pulse_0.4s_ease-in-out_infinite] h-3"></span>
                  <span className="w-1 bg-rose-500 rounded animate-[pulse_0.6s_ease-in-out_infinite] h-5"></span>
                  <span className="w-1 bg-rose-500 rounded animate-[pulse_0.3s_ease-in-out_infinite] h-2"></span>
                  <span className="w-1 bg-rose-500 rounded animate-[pulse_0.5s_ease-in-out_infinite] h-4"></span>
                </div>
              </div>
            )}

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isCustomOther ? "Describe what the issue is, where it is located, and any danger or damage caused..." : "Describe the public hazard..."}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition font-sans"
            />
          </div>

          {/* Action Button: AI Analyze */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTriggerAnalysis}
              className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/15 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group font-display"
            >
              <Scan className="w-5 h-5 text-sky-400 group-hover:rotate-12 transition" />
              <span>AI Analyze & Report Issue</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold uppercase tracking-wider">
                Instant Diagnosis
              </span>
            </button>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-200 pt-5 font-mono">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Spatial Deduplication
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 24h Department SLA
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Before/After Quality Audit
            </span>
          </div>

        </div>

        {/* =========================================================
            NEARBY EMERGENCY SERVICES & LIFE-SAFETY HELPLINES
           ========================================================= */}
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm shrink-0">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-950 font-display">
                    Nearby Emergency Services & Lifelines
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                    24x7 Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Real-time municipal dispatch & trauma rescue indexed for: <strong className="text-slate-800">{detectedLocation?.area || 'Electronic City'}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center gap-2 transition self-start sm:self-auto shadow-sm"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Scanning GPS...' : 'Re-scan Nearby Services'}</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {['ALL', 'Police', 'Medical', 'Fire', 'Municipal', 'Electricity', 'Water'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setEmergencyCategory(cat); playUiSound('beep'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition whitespace-nowrap ${
                  emergencyCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Lifelines' : cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEmergencies.map((srv) => (
              <div 
                key={srv.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs shrink-0">
                        {renderEmergencyIcon(srv.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                          {srv.name}
                        </h4>
                        <span className="text-[10px] font-mono text-sky-700 font-semibold">
                          {srv.category} • {srv.distanceKm} km away
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      Active
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3 truncate">
                    📍 {srv.address}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Helpline Number</span>
                    <span className="text-sm font-black font-mono text-slate-900">{srv.number}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(srv.number, srv.id)}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                      title="Copy Number"
                    >
                      {copiedPhone === srv.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`tel:${srv.number}`}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
