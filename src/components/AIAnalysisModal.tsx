import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Car, 
  Copy, 
  Building2, 
  X, 
  Eye, 
  ArrowRight,
  Crosshair,
  Scan,
  Loader2
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { CivicIssue } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';

export const AIAnalysisModal: React.FC = () => {
  const { 
    analysisModalOpen, 
    setAnalysisModalOpen, 
    stagedReport, 
    addNewIssue, 
    setActiveTab, 
    playUiSound,
    currentUser,
    requireAuth,
    issues,
    setActiveIssueId
  } = useCivic();

  const [scanStep, setScanStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (analysisModalOpen) {
      setScanStep(0);
      setIsSubmitting(false);
      setSubmitSuccess(false);
      const timer1 = setTimeout(() => setScanStep(1), 700);
      const timer2 = setTimeout(() => setScanStep(2), 1400);
      const timer3 = setTimeout(() => setScanStep(3), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [analysisModalOpen]);

  if (!analysisModalOpen || !stagedReport) return null;

  const handleSubmitComplaint = () => {
    setIsSubmitting(true);
    playUiSound('scan');

    setTimeout(() => {
      // Find highest existing numeric ID and increment
      let maxNum = 1024;
      issues.forEach((i) => {
        const num = parseInt(i.id.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num >= maxNum) maxNum = num + 1;
      });
      const newId = `CA${maxNum}`;

      const reporter = currentUser ? currentUser.name : 'Verified Citizen';
      const wardInfo = currentUser ? currentUser.ward : 'Ward 192 (Begur)';
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newComplaint: CivicIssue = {
        id: newId,
        title: stagedReport.title || 'Road Pothole Defect',
        description: stagedReport.description || 'Reported civic issue requiring immediate municipal attention.',
        category: (stagedReport.category as any) || 'Road Pothole',
        severity: stagedReport.severity || 'High',
        severityScore: stagedReport.severityScore || 88,
        locationName: stagedReport.locationName || 'Electronic City Phase 1, Bengaluru',
        coordinates: stagedReport.coordinates || [12.8452, 77.6602],
        potentialImpact: stagedReport.potentialImpact || 'Traffic hazard & vehicular safety',
        duplicateCount: stagedReport.duplicateCount || 1,
        duplicateDistanceMeters: stagedReport.duplicateDistanceMeters || 110,
        department: (stagedReport.department as any) || 'Municipal Roads',
        status: 'AI Verified',
        imageUrl: stagedReport.imageUrl || SAMPLE_IMAGES.potholeBefore,
        confidence: stagedReport.confidence || 96.4,
        createdAt: `Today ${nowTime}`,
        slaHours: 24,
        assignedCrew: 'Rapid Road Repair Unit #14',
        priorityScore: 92.5,
        reporterName: reporter,
        source: 'User Portal',
        isUserSubmitted: true,
        history: [
          {
            status: 'Report Submitted',
            timestamp: nowTime,
            note: `Complaint registered by ${reporter} (${wardInfo}) with geotagged photo.`,
            actor: reporter,
            completed: true,
            current: false,
          },
          {
            status: 'AI Verified',
            timestamp: nowTime,
            note: `Computer vision verified ${stagedReport.category || 'Defect'} (${stagedReport.confidence || 96}% confidence). Duplicates grouped.`,
            actor: 'Civic Vision Engine',
            completed: true,
            current: true,
          },
          {
            status: 'Department Assigned',
            timestamp: 'Pending',
            note: `Dispatched to ${stagedReport.department || 'Municipal Roads'} emergency queue.`,
            actor: 'System Dispatcher',
            completed: false,
            current: false,
          },
          {
            status: 'In Progress',
            timestamp: 'Pending',
            note: 'Awaiting repair team deployment on ground.',
            actor: 'Field Operations',
            completed: false,
            current: false,
          },
          {
            status: 'Resolved',
            timestamp: 'Pending',
            note: 'Before/After verification pending.',
            actor: 'Quality Assurance Unit',
            completed: false,
            current: false,
          },
        ],
      };

      addNewIssue(newComplaint);
      setActiveIssueId(newId);
      setSubmitSuccess(true);
      playUiSound('success');

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(false);
        setAnalysisModalOpen(false);

        if (currentUser?.role === 'admin' || currentUser?.role === 'officer') {
          setActiveTab('admin');
        } else {
          setActiveTab('tracking');
        }
      }, 600);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl shadow-slate-900/20 overflow-hidden relative">
        
        {/* Top bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Scan className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Screen 2: Visor Neural Vision HUD
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-800 font-bold">
                  LIVE INFERENCE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">Convolutional defect telemetry & 110m spatial cluster</p>
            </div>
          </div>
          <button
            onClick={() => setAnalysisModalOpen(false)}
            className="text-slate-400 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Visual Scanner with Bounding Box Overlay */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
            <img
              src={stagedReport.imageUrl}
              alt="Scan Target"
              className="w-full h-full object-cover"
            />

            {/* Neural Net Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf815_1px,transparent_1px),linear-gradient(to_bottom,#38bdf815_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Cyan Laser Scanline */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-visor-scan pointer-events-none"></div>

            {/* Bounding Box on the defect */}
            <div className="absolute top-[32%] left-[26%] w-[48%] h-[42%] border-2 border-dashed border-sky-400 rounded-2xl bg-sky-500/10 pointer-events-none flex flex-col justify-between p-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold bg-slate-900/90 text-sky-300 px-2 py-0.5 rounded border border-sky-400/50">
                  TARGET: {stagedReport.category || 'Road Pothole'} [0.96]
                </span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-emerald-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  DEPTH: ~12cm | CLEARANCE: REQ
                </span>
              </div>
            </div>

            {/* Bottom Floating Telemetry */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs text-white font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Latency: 142ms</span>
              </div>
              <span className="text-sky-300 font-semibold">
                Confidence: {stagedReport.confidence || 96.4}%
              </span>
            </div>
          </div>

          {/* Extracted AI Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            
            {/* 1. Detected Defect */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  🔍 AI Detected
                </span>
                <span className="text-base font-extrabold text-slate-900 font-display">
                  {stagedReport.category || 'Road Pothole'}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">Asphalt surface breach & base erosion</p>
              </div>
            </div>

            {/* 2. Severity */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  ⚠️ Severity Rating
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-amber-600 font-mono">
                    {stagedReport.severity || 'High'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ({stagedReport.severityScore || 88}/100)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Immediate danger to two-wheelers</p>
              </div>
            </div>

            {/* 3. Location */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  📍 Location Detected
                </span>
                <span className="text-sm font-bold text-slate-900 truncate block font-display">
                  {stagedReport.locationName?.split(',')[0] || 'Electronic City'}
                </span>
                <span className="text-[11px] font-mono text-slate-500 truncate block">
                  GPS: 12.8452° N, 77.6602° E
                </span>
              </div>
            </div>

            {/* 4. Potential Impact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  🚗 Potential Impact
                </span>
                <span className="text-sm font-bold text-slate-900 block font-sans">
                  {stagedReport.potentialImpact || 'Traffic & vehicle safety'}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">Peak hour congestion multiplier</p>
              </div>
            </div>

            {/* 5. Duplicate Reports */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  🔄 Duplicate Reports
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-purple-700 font-mono">
                    {stagedReport.duplicateCount || 3} nearby
                  </span>
                  <span className="text-[11px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200">
                    within 110m
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Auto-merged to prevent spam</p>
              </div>
            </div>

            {/* 6. Department */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  🏢 Auto-Assigned Department
                </span>
                <span className="text-base font-extrabold text-slate-900 font-display">
                  {stagedReport.department || 'Municipal Roads'}
                </span>
                <p className="text-xs text-slate-600 mt-0.5">BBMP Infrastructure Division</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>AI verification passed. Ready to dispatch ticket.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setAnalysisModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitComplaint}
              disabled={isSubmitting}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition transform active:scale-95 font-display ${
                submitSuccess 
                  ? 'bg-emerald-600 shadow-emerald-500/20' 
                  : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10'
              } disabled:opacity-80`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Registering to City Grid...</span>
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Complaint Registered!</span>
                </>
              ) : (
                <>
                  <span>Submit Complaint</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
