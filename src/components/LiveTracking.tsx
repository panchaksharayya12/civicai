import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Camera,
  ArrowRight,
  Sparkles,
  Flame,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { Status } from '../types';

export const LiveTracking: React.FC = () => {
  const { 
    issues, 
    activeIssueId, 
    setActiveIssueId, 
    activeIssue, 
    setActiveTab, 
    playUiSound,
    confirmCitizenResolution
  } = useCivic();

  const [searchId, setSearchId] = useState(activeIssueId);

  useEffect(() => {
    setSearchId(activeIssueId);
  }, [activeIssueId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = issues.find((i) => i.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) {
      setActiveIssueId(found.id);
      playUiSound('beep');
    } else {
      playUiSound('alert');
    }
  };

  const currentIssue = activeIssue || issues[0];

  // 5 Canonical Hackathon Stepper Stages matching Screen 3
  const STEPS: { title: string; statusMatch: Status[]; desc: string }[] = [
    { title: 'Report Submitted', statusMatch: ['Report Submitted', 'AI Verified', 'Department Assigned', 'In Progress', 'Resolution Pending', 'Resolved'], desc: 'Citizen geo-tagged photo & voice complaint received' },
    { title: 'AI Verified', statusMatch: ['AI Verified', 'Department Assigned', 'In Progress', 'Resolution Pending', 'Resolved'], desc: 'Computer Vision classified defect & grouped duplicates' },
    { title: 'Department Assigned', statusMatch: ['Department Assigned', 'In Progress', 'Resolution Pending', 'Resolved'], desc: `${currentIssue.department} assigned with SLA: ${currentIssue.slaHours}h` },
    { title: 'Action Pending / In Progress', statusMatch: ['In Progress', 'Resolution Pending', 'Resolved'], desc: currentIssue.assignedCrew || 'Field repair crew dispatched' },
    { title: 'Resolved', statusMatch: ['Resolved'], desc: 'Before/After AI vision clearance confirmed' },
  ];

  const getStepState = (stepIndex: number) => {
    const statusOrder: Status[] = [
      'Report Submitted',
      'AI Verified',
      'Department Assigned',
      'In Progress',
      'Resolution Pending',
      'Resolved',
    ];
    
    let currentIdx = statusOrder.indexOf(currentIssue.status);
    if (currentIssue.status === 'Resolution Pending') currentIdx = 3.5;

    let targetIdx = 0;
    if (stepIndex === 0) targetIdx = 0;
    if (stepIndex === 1) targetIdx = 1;
    if (stepIndex === 2) targetIdx = 2;
    if (stepIndex === 3) targetIdx = 3;
    if (stepIndex === 4) targetIdx = 5;

    if (currentIdx > targetIdx) return 'completed';
    if (currentIdx === targetIdx || (stepIndex === 3 && currentIssue.status === 'Resolution Pending')) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Registration & Admin Quick Switch Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-800 uppercase">
                Grievance #{currentIssue.id} Live in Municipal Operations
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                AI Triaged
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Complaint has been routed to <strong>{currentIssue.department}</strong>. Live field dispatch is active.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('citizen');
            playUiSound('beep');
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-1.5 transition shadow-xs shrink-0 font-display"
        >
          <span>+ Report Another Issue</span>
        </button>
      </div>

      {/* Title & Ticket Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono font-semibold uppercase tracking-wider mb-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Real-time Grievance Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display flex items-center gap-3">
            <span>Complaint #{currentIssue.id}</span>
            <span className={`text-xs px-3 py-1 rounded-full border font-mono font-semibold ${
              currentIssue.status === 'Resolved' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                : currentIssue.status === 'In Progress' || currentIssue.status === 'Resolution Pending'
                ? 'bg-sky-50 text-sky-700 border-sky-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}>
              {currentIssue.status}
            </span>
          </h1>
        </div>

        {/* Search / Ticket Switcher */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            placeholder="Search Ticket (e.g. CA1024)..."
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 w-48 focus:outline-none focus:border-sky-500 shadow-sm transition"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Lookup
          </button>
        </form>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
        
        {/* Ticket Header Brief */}
        <div className="bg-slate-50/70 border-b border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={currentIssue.imageUrl}
              alt="Defect Preview"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900">{currentIssue.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{currentIssue.locationName}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-medium bg-white text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 font-mono shadow-xs">
                  {currentIssue.department}
                </span>
                <span className="text-[11px] font-mono text-sky-700 font-semibold">
                  {currentIssue.duplicateCount} citizen reports clustered
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Guaranteed SLA Window
            </span>
            <span className="text-xl font-mono font-extrabold text-sky-600">
              {currentIssue.status === 'Resolved' ? 'Completed on Time' : '18h 42m Remaining'}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Standard 24h Municipal Repair Protocol
            </span>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="p-6 sm:p-8">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 mb-6">
            Live Resolution Stepper
          </h4>

          <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3.5 sm:before:left-4.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {STEPS.map((step, idx) => {
              const state = getStepState(idx);

              return (
                <div key={step.title} className="relative flex items-start gap-4">
                  {/* Step Bullet Icon */}
                  <div className="absolute -left-6 sm:-left-8 top-0.5">
                    {state === 'completed' && (
                      <div className="w-7 h-7 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {state === 'current' && (
                      <div className="w-7 h-7 rounded-full bg-sky-50 border-2 border-sky-500 flex items-center justify-center text-sky-600 font-bold animate-pulse shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                      </div>
                    )}
                    {state === 'pending' && (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-400 text-xs font-mono">
                        ○
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 transition hover:border-slate-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h5 className={`font-bold text-sm ${
                        state === 'completed' ? 'text-emerald-700' :
                        state === 'current' ? 'text-sky-700' : 'text-slate-600'
                      }`}>
                        {state === 'completed' ? '✓ ' : state === 'current' ? '● ' : '○ '}
                        {step.title}
                      </h5>
                      <span className="text-[11px] font-mono text-slate-500">
                        {state === 'completed' ? 'Verified' : state === 'current' ? 'Active Stage' : 'Queued'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BEFORE & AFTER RESOLUTION VERIFICATION SECTION */}
        {(currentIssue.status === 'Resolved' || currentIssue.verification) ? (
          <div className="border-t border-slate-200/90 bg-gradient-to-b from-emerald-50/50 via-white to-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-slate-900 font-display">
                      Resolution Verification Proof: Before & After
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {currentIssue.verification?.clearanceScore || 98.4}% Clearance
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Visual proof of physical field restoration verified by Municipal Engineer and AI Neural Engine.
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold self-start sm:self-auto">
                ✓ Verified Closed: {currentIssue.verification?.timestamp || 'Today'}
              </div>
            </div>

            {/* Side-by-Side Before & After Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    1. BEFORE: Reported Defect
                  </span>
                  <span className="text-[10px] text-slate-400">Citizen Evidence</span>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
                  <img
                    src={currentIssue.imageUrl}
                    alt="Defect Before Repair"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-mono text-rose-300 font-bold border border-rose-500/40">
                    HAZARD DETECTED ({currentIssue.confidence}%)
                  </div>
                </div>
              </div>

              {/* After Photo */}
              <div className="rounded-2xl border-2 border-emerald-500 bg-white p-3 space-y-2 shadow-md">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    2. AFTER: Verified Resolution
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {currentIssue.verification?.clearanceScore || 98.4}% Quality Score
                  </span>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-emerald-200 shadow-inner group">
                  <img
                    src={currentIssue.verification?.afterImageUrl || currentIssue.imageUrl}
                    alt="Restoration After Repair"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-950/85 backdrop-blur-md rounded-md text-[10px] font-mono text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>RESTORED & VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Inspection Verdict Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 font-display flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  BBMP Municipal Work Order Report:
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  Unit: {currentIssue.assignedCrew || 'Rapid Road Repair Unit #14'}
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-sans">
                "{currentIssue.verification?.notes || currentIssue.verification?.aiVerdict || 'Surface leveled and defect restored to municipal road standard. Verified by field inspection.'}"
              </p>
            </div>

            {/* Citizen Confirmation Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-100">
              <span className="text-xs text-slate-700 font-medium">
                Did the municipal repair team completely resolve this defect?
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => confirmCitizenResolution(currentIssue.id, true)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 ${
                    currentIssue.verification?.citizenConfirmed === true
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span>👍 Confirm Resolved</span>
                </button>
                <button
                  type="button"
                  onClick={() => confirmCitizenResolution(currentIssue.id, false)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 ${
                    currentIssue.verification?.citizenConfirmed === false
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200'
                  }`}
                >
                  <span>⚠️ Issue Persists</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-200/80 bg-slate-50/60 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-mono uppercase text-slate-900">
                  Awaiting Field Repair & Resolution Photo
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentIssue.assignedCrew || 'Municipal Field Team'} has been assigned. The Before & After verification photos will automatically appear here once repairs are completed on site.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Citizen Notification Simulation Banner */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-600">
          <span className="font-bold text-sky-900 block mb-0.5">Automated Citizen SMS & WhatsApp Notifications Active</span>
          When the field contractor completes the asphalt repair and uploads the evidence photo, an automated notification is pushed to the citizen with Before & After verification.
        </div>
      </div>

    </div>
  );
};
