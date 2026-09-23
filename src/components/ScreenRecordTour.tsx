import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  MousePointer2, 
  Flame
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { SAMPLE_IMAGES } from '../data/mockData';

export const ScreenRecordTour: React.FC<{ isActive: boolean; onClose: () => void }> = ({ isActive, onClose }) => {
  const { 
    setActiveTab, 
    setAnalysisModalOpen, 
    setStagedReport, 
    submitResolutionVerification, 
    confirmCitizenResolution,
    triggerCelebration,
    playUiSound,
    resetToDemoDefaults
  } = useCivic();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState(false);
  const [currentNarration, setCurrentNarration] = useState('Initializing automated presentation flow...');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const totalDuration = 45; // 45-second cinematic demo tour
  const timerRef = useRef<number | null>(null);

  const SCENES = [
    {
      at: 0,
      title: 'Scene 1: Citizen Hazard Intake',
      narration: 'Citizen identifies severe road pothole in Electronic City and opens CivicAI reporting portal.',
      run: () => {
        resetToDemoDefaults();
        setActiveTab('citizen');
        setAnalysisModalOpen(false);
        setCursorPosition({ x: 48, y: 35 });
      }
    },
    {
      at: 5,
      title: 'Scene 1: Photo & Voice Selected',
      narration: 'Preset "Road Pothole (High Priority)" selected with auto-detected GPS coordinates and voice description.',
      run: () => {
        setCursorPosition({ x: 30, y: 22 });
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);
        playUiSound('beep');
      }
    },
    {
      at: 8,
      title: 'Scene 2: Triggering Computer Vision',
      narration: 'Citizen clicks "AI Analyze & Report Issue" — sending frame to convolutional vision pipeline.',
      run: () => {
        setCursorPosition({ x: 50, y: 68 });
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);
        playUiSound('scan');
      }
    },
    {
      at: 10,
      title: 'Scene 2: Neural Vision HUD Scanner',
      narration: 'Vision model detects Road Pothole (96.4% confidence), computes High severity, clusters 3 duplicates.',
      run: () => {
        setStagedReport({
          title: 'Road Pothole (Electronic City)',
          description: 'Deep road crater in middle lane causing severe traffic deceleration and accident risk.',
          category: 'Road Pothole',
          severity: 'High',
          severityScore: 88,
          locationName: 'Electronic City Phase 1, Bengaluru',
          coordinates: [12.8452, 77.6602],
          potentialImpact: 'High risk of vehicular accidents & peak traffic congestion',
          duplicateCount: 3,
          duplicateDistanceMeters: 110,
          department: 'Municipal Roads',
          imageUrl: SAMPLE_IMAGES.potholeBefore,
          confidence: 96.4,
        });
        setAnalysisModalOpen(true);
        setCursorPosition({ x: 50, y: 40 });
      }
    },
    {
      at: 16,
      title: 'Scene 2: Submit Complaint & Ticket Generation',
      narration: 'AI auto-routes ticket #CA1024 to BBMP Municipal Roads with guaranteed 24-hour SLA.',
      run: () => {
        setCursorPosition({ x: 68, y: 72 });
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);
        playUiSound('success');
      }
    },
    {
      at: 18,
      title: 'Scene 3: Live Citizen Tracking Stepper',
      narration: 'Ticket #CA1024 opens with live stepper: Report Submitted ➜ AI Verified ➜ Department Assigned.',
      run: () => {
        setAnalysisModalOpen(false);
        setActiveTab('tracking');
        setCursorPosition({ x: 50, y: 45 });
      }
    },
    {
      at: 23,
      title: 'Scene 4: Municipal Government Command Center',
      narration: 'Operations Dashboard updates KPIs (1,284 issues) and displays pulsing tactical map pin.',
      run: () => {
        setActiveTab('admin');
        setCursorPosition({ x: 38, y: 52 });
        playUiSound('beep');
      }
    },
    {
      at: 28,
      title: 'Scene 5: Autonomous Priority Engine',
      narration: 'Dynamic priority formula ranks #CA1024 at Top #1 based on arterial traffic & duplicate density.',
      run: () => {
        setActiveTab('priority');
        setCursorPosition({ x: 50, y: 32 });
        playUiSound('beep');
      }
    },
    {
      at: 34,
      title: 'Scene 6: Resolution Verification (Before vs After)',
      narration: 'Crew finishes repair. Contractor uploads photo; AI vision verifies 98.4% surface clearance.',
      run: () => {
        setActiveTab('verify');
        submitResolutionVerification('CA1024', {
          afterImageUrl: SAMPLE_IMAGES.potholeAfter,
          clearanceScore: 98.4,
          defectDetected: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenConfirmed: null,
          aiVerdict: 'Issue appears resolved: Defect filled with hot-mix asphalt and compacted.',
        });
        setCursorPosition({ x: 52, y: 48 });
        playUiSound('success');
      }
    },
    {
      at: 40,
      title: 'Scene 6: Citizen Final Veto — Ticket Closed!',
      narration: 'Citizen reviews Before/After evidence, taps "👍 Resolved", and closes ticket with zero ghost closure!',
      run: () => {
        setCursorPosition({ x: 74, y: 82 });
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);
        confirmCitizenResolution('CA1024', true);
        triggerCelebration();
        playUiSound('success');
      }
    },
  ];

  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      setCurrentTime(0);
      SCENES[0].run();
      setCurrentNarration(SCENES[0].narration);
    } else {
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          const found = SCENES.find((s) => s.at === next);
          if (found) {
            found.run();
            setCurrentNarration(found.narration);
            setCurrentStepIdx(SCENES.indexOf(found));
          }
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  if (!isActive) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Animated Simulated Cursor with Sky Blue Glow */}
      <div 
        className="fixed z-50 pointer-events-none transition-all duration-700 ease-out"
        style={{ left: `${cursorPosition.x}%`, top: `${cursorPosition.y}%` }}
      >
        <div className="relative">
          <MousePointer2 className="w-6 h-6 text-sky-600 fill-sky-600 drop-shadow-[0_0_12px_rgba(2,132,199,0.8)] transform -rotate-12" />
          {isClicking && (
            <span className="absolute -top-2 -left-2 w-10 h-10 rounded-full border-2 border-sky-500 animate-ping"></span>
          )}
        </div>
      </div>

      {/* Top Floating Cinematic Recording HUD */}
      <aside aria-label="Live Demo Screen Recording HUD" className="fixed top-20 left-4 right-4 z-50 max-w-4xl mx-auto animate-fade-in pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-sky-400/80 rounded-3xl p-3.5 shadow-2xl text-slate-900 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: REC Status Indicator */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-mono text-xs font-black text-rose-700 tracking-wider">
                ● REC
              </span>
              <span className="font-mono text-xs text-slate-900 font-bold ml-1">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                  VISOR SIMULATION ENGINE
                </span>
                <span className="text-xs font-bold text-slate-900 truncate font-display">
                  {SCENES[currentStepIdx]?.title || 'CivicAI Tour'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 truncate max-w-md mt-0.5">
                {currentNarration}
              </p>
            </div>
          </div>

          {/* Right: Media Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-sky-600" /> : <Play className="w-3.5 h-3.5 text-sky-600" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                setCurrentStepIdx(0);
                SCENES[0].run();
                setCurrentNarration(SCENES[0].narration);
                setIsPlaying(true);
                playUiSound('beep');
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
              title="Restart Recording"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1 transition ml-1 shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>

        </div>

        {/* Visor Cyan/Sky progress scrub bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-b-2xl overflow-hidden mt-1 border border-slate-200">
          <div 
            className="bg-gradient-to-r from-sky-600 to-sky-400 h-full transition-all duration-500 shadow-sm"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          ></div>
        </div>
      </aside>
    </>
  );
};
