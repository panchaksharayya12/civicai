import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  X, 
  CheckCircle, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { SAMPLE_IMAGES } from '../data/mockData';

export const GuidedDemoBar: React.FC = () => {
  const { 
    guidedStep, 
    setGuidedStep, 
    guidedModeActive, 
    setGuidedModeActive, 
    setActiveTab, 
    setAnalysisModalOpen, 
    setStagedReport,
    updateIssueStatus,
    submitResolutionVerification,
    confirmCitizenResolution,
    activeIssueId,
    playUiSound,
    resetToDemoDefaults
  } = useCivic();

  const [isPlaying, setIsPlaying] = useState(false);

  const DEMO_STEPS = [
    {
      title: '1. Citizen Uploads Pothole',
      desc: 'Citizen captures a photo of a dangerous road crater in Electronic City with voice note.',
      action: () => {
        setActiveTab('citizen');
        setAnalysisModalOpen(false);
      },
    },
    {
      title: '2. AI Computer Vision Detection',
      desc: 'Deep learning model identifies "Road Pothole", computes 96.4% confidence, and flags bounding box.',
      action: () => {
        setStagedReport({
          title: 'Road Pothole (Electronic City)',
          description: 'Deep road crater causing two-wheelers to swerve abruptly into traffic.',
          category: 'Road Pothole',
          severity: 'High',
          severityScore: 88,
          locationName: 'Electronic City Phase 1, Near Infosys Gate 3, Bengaluru',
          coordinates: [12.8452, 77.6602],
          potentialImpact: 'High risk of vehicular accidents & peak traffic congestion',
          duplicateCount: 3,
          duplicateDistanceMeters: 110,
          department: 'Municipal Roads',
          imageUrl: SAMPLE_IMAGES.potholeBefore,
          confidence: 96.4,
        });
        setAnalysisModalOpen(true);
      },
    },
    {
      title: '3. Severity & Duplicate Clustering',
      desc: 'AI calculates High severity (88/100) and detects 3 duplicate citizen reports within 110m radius.',
      action: () => {
        setAnalysisModalOpen(true);
      },
    },
    {
      title: '4. Automated Department Routing (#CA1024)',
      desc: 'System assigns ticket #CA1024 directly to BBMP Municipal Roads with a 24-hour SLA window.',
      action: () => {
        setAnalysisModalOpen(false);
        setActiveTab('tracking');
      },
    },
    {
      title: '5. Incident Appears on Tactical Admin Map',
      desc: 'Government Operations Command Center displays the red/orange tactical pin on city map.',
      action: () => {
        setActiveTab('admin');
      },
    },
    {
      title: '6. AI Priority Engine Ranks Urgent Dispatch',
      desc: 'Algorithmic formula ranks #CA1024 at the top of the dispatch queue due to heavy arterial traffic.',
      action: () => {
        setActiveTab('priority');
      },
    },
    {
      title: '7. Contractor Repairs & AI Verifies Resolution',
      desc: 'Crew uploads "After" photo. AI vision verifies surface leveling (98.4% clearance).',
      action: () => {
        setActiveTab('verify');
        submitResolutionVerification('CA1024', {
          afterImageUrl: SAMPLE_IMAGES.potholeAfter,
          clearanceScore: 98.4,
          defectDetected: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenConfirmed: null,
          aiVerdict: 'Clearance verified: Defect filled with hot-mix asphalt and compacted.',
        });
      },
    },
    {
      title: '8. Citizen Confirmation & Ticket Closure',
      desc: 'Reporting citizen receives notification, inspects Before/After proof, and taps "👍 Resolved"!',
      action: () => {
        setActiveTab('verify');
        confirmCitizenResolution('CA1024', true);
      },
    },
  ];

  const currentStep = DEMO_STEPS[guidedStep] || DEMO_STEPS[0];

  const handleNext = () => {
    if (guidedStep < DEMO_STEPS.length - 1) {
      const nextIdx = guidedStep + 1;
      setGuidedStep(nextIdx);
      DEMO_STEPS[nextIdx].action();
      playUiSound('beep');
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (guidedStep > 0) {
      const prevIdx = guidedStep - 1;
      setGuidedStep(prevIdx);
      DEMO_STEPS[prevIdx].action();
      playUiSound('beep');
    }
  };

  // Auto play tour effect
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setGuidedStep((prev) => {
          if (prev < DEMO_STEPS.length - 1) {
            const next = prev + 1;
            DEMO_STEPS[next].action();
            return next;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  if (!guidedModeActive) return null;

  return (
    <aside aria-label="Hackathon Stage Tour" className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-xl border border-sky-300 rounded-2xl p-4 shadow-xl shadow-sky-500/10 text-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Step Badge & Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-extrabold text-sm shrink-0 font-mono">
            {guidedStep + 1}/{DEMO_STEPS.length}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                Visor Stage Tour
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 truncate font-display">
                {currentStep.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 truncate max-w-lg mt-0.5">
              {currentStep.desc}
            </p>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Previous */}
          <button
            onClick={handlePrev}
            disabled={guidedStep === 0}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Previous Demo Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Auto Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              isPlaying
                ? 'bg-sky-600 text-white border-sky-600 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Auto Advance Demo"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Tour' : 'Auto Play'}</span>
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={guidedStep === DEMO_STEPS.length - 1}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition disabled:opacity-40"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset Demo */}
          <button
            onClick={() => {
              resetToDemoDefaults();
              setGuidedStep(0);
              DEMO_STEPS[0].action();
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
            title="Restart Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close Bar */}
          <button
            onClick={() => setGuidedModeActive(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition ml-1"
            title="Dismiss Tour Bar"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </aside>
  );
};
