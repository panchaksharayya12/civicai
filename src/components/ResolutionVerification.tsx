import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowLeftRight, 
  ShieldCheck, 
  Camera, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { SAMPLE_IMAGES } from '../data/mockData';
import { VerificationData } from '../types';

export const ResolutionVerification: React.FC = () => {
  const { 
    issues, 
    activeIssueId, 
    activeIssue, 
    submitResolutionVerification, 
    confirmCitizenResolution, 
    playUiSound 
  } = useCivic();

  const currentIssue = activeIssue || issues[0];

  const [afterImage, setAfterImage] = useState<string>(
    currentIssue.verification?.afterImageUrl || SAMPLE_IMAGES.potholeAfter
  );
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(Boolean(currentIssue.verification));
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const handleAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAfterImage(reader.result);
          setVerificationDone(false);
          playUiSound('beep');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiVerification = () => {
    setIsVerifying(true);
    playUiSound('scan');

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationDone(true);
      playUiSound('success');

      const data: VerificationData = {
        afterImageUrl: afterImage,
        clearanceScore: 98.4,
        defectDetected: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citizenConfirmed: null,
        aiVerdict: 'Issue appears resolved: Defect depression leveled with dense bituminous mix. Surface grade tolerance within 98.4%.',
      };

      submitResolutionVerification(currentIssue.id, data);
    }, 1800);
  };

  const handleCitizenConfirm = (confirmed: boolean) => {
    confirmCitizenResolution(currentIssue.id, confirmed);
  };

  const citizenConfirmed = currentIssue.verification?.citizenConfirmed;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-7">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span>Screen 6: AI Resolution Verification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display mb-3">
          Before vs After Quality Audit
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Authority uploads repair evidence. AI compares the defective surface against the restored site. Citizen gives final sign-off before closing ticket #{currentIssue.id}.
        </p>
      </div>

      {/* Ticket Selector Bar */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[11px]">
            Auditing Incident:
          </span>
          <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
            #{currentIssue.id}
          </span>
          <span className="font-medium text-slate-900">{currentIssue.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'slider' ? 'side-by-side' : 'slider')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition font-medium"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
            <span>Mode: {viewMode === 'slider' ? 'Split Slider' : 'Side-by-Side'}</span>
          </button>
        </div>
      </div>

      {/* Main Before / After Visual Comparison Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Visual Viewer */}
        {viewMode === 'slider' ? (
          <div className="relative aspect-video max-h-[460px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 select-none shadow-md">
            {/* After Image (Background) */}
            <img
              src={afterImage}
              alt="After Repair"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-emerald-300 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold z-10 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>AFTER (REPAIR COMPLETE)</span>
            </div>

            {/* Before Image (Clipped Foreground) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentIssue.imageUrl}
                alt="Before Defect"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-rose-300 text-rose-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold z-10 flex items-center gap-1.5 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>BEFORE (REPORTED HAZARD)</span>
              </div>
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_15px_rgba(2,132,199,0.5)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-sky-600 text-white shadow-md flex items-center justify-center text-xs font-black">
                ⮂⮃
              </div>
            </div>

            {/* Range Input for Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderMove}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        ) : (
          /* Side-by-side mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-rose-200 shadow-sm">
              <img
                src={currentIssue.imageUrl}
                alt="Before"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 text-rose-700 px-3 py-1 rounded-xl text-xs font-mono font-bold border border-rose-200 shadow-xs">
                BEFORE (Defect)
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-emerald-200 shadow-sm">
              <img
                src={afterImage}
                alt="After"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 text-emerald-700 px-3 py-1 rounded-xl text-xs font-mono font-bold border border-emerald-200 shadow-xs">
                AFTER (Repaired)
              </div>
            </div>
          </div>
        )}

        {/* Upload & AI Verification Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* 1. Authority Upload Button */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1 flex items-center gap-1.5 font-mono">
                <Camera className="w-3.5 h-3.5 text-sky-600" />
                Authority "After" Photo
              </span>
              <p className="text-[11px] text-slate-500 mb-4">
                Upload completion photo taken by road maintenance crew.
              </p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAfterImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-xs transition"
              >
                Upload Photo
              </button>
              <button
                onClick={() => {
                  setAfterImage(SAMPLE_IMAGES.potholeAfter);
                  playUiSound('beep');
                }}
                className="py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[11px] font-mono font-semibold text-sky-700 border border-sky-200 transition"
              >
                Preset
              </button>
            </div>
          </div>

          {/* 2. Run AI Comparison Button */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Computer Vision Audit
              </span>
              <p className="text-[11px] text-slate-500 mb-4">
                Analyze surface elevation, patch compactness, and hazard clearance.
              </p>
            </div>

            <button
              onClick={handleRunAiVerification}
              disabled={isVerifying}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-sky-600 hover:bg-sky-500 flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Analyzing Surface...' : 'Compare Before → After'}</span>
            </button>
          </div>

          {/* 3. AI Verdict Badge */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                AI Verification Status
              </span>
              <div className="mt-2">
                {verificationDone ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800">
                    <span className="text-sm font-extrabold flex items-center gap-1.5">
                      ✅ Issue appears resolved
                    </span>
                    <span className="text-[11px] block mt-1 text-emerald-700">
                      Defect clearance: 98.4% | Leveling: PASSED
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 text-xs shadow-xs">
                    Awaiting Before → After comparison run...
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-2 block">
              Confidence threshold: &gt; 95%
            </span>
          </div>

        </div>

      </div>

      {/* Citizen Confirmation Panel */}
      <div className="bg-white/90 backdrop-blur-xl border border-sky-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-700 font-bold block mb-1">
              Final Citizen Governance Sign-Off
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Citizen Feedback on Resolution
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mt-1">
              The AI verifies the visual evidence, but the citizen who reported the issue has the ultimate authority to accept or contest the resolution.
            </p>
          </div>

          {/* Citizen action buttons */}
          <div className="flex items-center gap-3">
            {citizenConfirmed === true ? (
              <div className="px-6 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-400 text-emerald-700 font-bold text-sm flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed Resolved by Citizen!</span>
              </div>
            ) : citizenConfirmed === false ? (
              <div className="px-6 py-3.5 rounded-2xl bg-rose-50 border border-rose-400 text-rose-700 font-bold text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Citizen Flagged: Still Not Fixed (Escalated)</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleCitizenConfirm(true)}
                  className="px-6 py-3.5 rounded-2xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 shadow-md shadow-emerald-500/20 transition transform active:scale-95"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>👍 Resolved</span>
                </button>

                <button
                  onClick={() => handleCitizenConfirm(false)}
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 flex items-center gap-2 transition transform active:scale-95 shadow-xs"
                >
                  <ThumbsDown className="w-4 h-4 text-rose-600" />
                  <span>❌ Still not fixed</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
