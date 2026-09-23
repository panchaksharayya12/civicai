import React, { useState, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  Building, 
  Eye, 
  X, 
  Inbox, 
  AlertTriangle, 
  RotateCcw, 
  ExternalLink, 
  Navigation,
  Camera,
  Upload,
  Sparkles,
  Check,
  Image as ImageIcon,
  ShieldCheck,
  ArrowRight,
  Layers,
  ZoomIn,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { CivicIssue, Status } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';

// Custom Leaflet DivIcons indicating resolution state
const createMarkerIcon = (isResolved: boolean, isSelected: boolean) => {
  const bgClass = isResolved ? 'bg-emerald-500' : 'bg-amber-500';
  const pulseClass = isResolved ? '' : 'radar-pulse';
  const ringClass = isSelected 
    ? 'ring-4 ring-sky-500 shadow-xl scale-125 z-50' 
    : 'ring-2 ring-white shadow-md';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center ${pulseClass}">
        <div class="w-7 h-7 rounded-full ${bgClass} ${ringClass} flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-all">
          ${isResolved ? '✓' : '!'}
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const createUserGpsIcon = () => {
  return L.divIcon({
    className: 'user-gps-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-sky-400 opacity-75"></span>
        <div class="relative w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-md flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Smooth Leaflet camera flyTo animation controller
const MapFlyController: React.FC<{ 
  target: { coords: [number, number]; timestamp: number; zoom?: number } | null 
}> = ({ target }) => {
  const map = useMap();
  React.useEffect(() => {
    if (target) {
      map.flyTo(target.coords, target.zoom || 15, { animate: true, duration: 1.2 });
    }
  }, [target, map]);
  return null;
};

export const AdminDashboard: React.FC = () => {
  const { 
    issues, 
    activeIssueId, 
    setActiveIssueId, 
    updateIssueStatus, 
    resolveIssueWithProof,
    playUiSound,
    detectedLocation,
    currentUser,
    adminViewMode,
    setAdminViewMode
  } = useCivic();

  // Scope: by default show complaints sent from the User Portal
  const [viewScope, setViewScope] = useState<'user_portal' | 'all'>('user_portal');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');
  
  // Map controls
  const [mapMode, setMapMode] = useState<'satellite' | 'streets'>('satellite');
  const [mapFlyTarget, setMapFlyTarget] = useState<{ coords: [number, number]; timestamp: number; zoom?: number } | null>(null);
  const [mapToast, setMapToast] = useState<string | null>(null);

  // Advanced Resolution & Before/After Photo Upload Modal State
  const [resolvingIssue, setResolvingIssue] = useState<CivicIssue | null>(null);
  const [beforePhoto, setBeforePhoto] = useState<string>('');
  const [afterPhoto, setAfterPhoto] = useState<string>('');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [clearanceScore, setClearanceScore] = useState<number>(98.4);

  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  // Simple Detail / History Modal
  const [inspectingIssue, setInspectingIssue] = useState<CivicIssue | null>(null);

  // High-Res Photo Viewer Modal
  const [photoViewer, setPhotoViewer] = useState<{
    issue: CivicIssue;
    mode: 'before' | 'after' | 'compare';
  } | null>(null);

  // Helper to identify complaints sent from the user portal
  const isFromUserPortal = (issue: CivicIssue) => {
    return (
      issue.isUserSubmitted === true ||
      issue.source === 'User Portal' ||
      issue.id === 'CA1024' ||
      parseInt(issue.id.replace(/\D/g, ''), 10) >= 1024
    );
  };

  // Base list of complaints based on user portal scope
  const scopedIssues = viewScope === 'user_portal' 
    ? issues.filter(isFromUserPortal)
    : issues;

  // Filter complaints based on status and search
  const displayedComplaints = scopedIssues.filter((issue) => {
    const isResolved = issue.status === 'Resolved';
    if (statusFilter === 'PENDING' && isResolved) return false;
    if (statusFilter === 'RESOLVED' && !isResolved) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        issue.id.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q) ||
        issue.locationName.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        (issue.reporterName && issue.reporterName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Action: Focus on Map and switch to Map View
  const handleFocusOnMap = (issue: CivicIssue) => {
    setActiveIssueId(issue.id);
    setAdminViewMode('map');
    playUiSound('scan');

    setMapFlyTarget({
      coords: issue.coordinates,
      timestamp: Date.now(),
      zoom: 16,
    });

    setMapToast(`📍 Map centered on #${issue.id} (${issue.category})`);
    setTimeout(() => setMapToast(null), 3500);
  };

  // Open the Advanced Resolution Modal with Before/After Photo Upload
  const handleOpenResolveModal = (issue: CivicIssue) => {
    setResolvingIssue(issue);
    setBeforePhoto(issue.imageUrl);
    
    // Provide default after image or current after image
    const existingAfter = issue.verification?.afterImageUrl;
    const defaultAfter = 
      issue.category === 'Road Pothole' ? SAMPLE_IMAGES.potholeAfter :
      issue.category === 'Garbage Dump' ? SAMPLE_IMAGES.garbageAfter :
      issue.category === 'Broken Streetlight' ? SAMPLE_IMAGES.streetlightAfter :
      SAMPLE_IMAGES.potholeAfter;
      
    setAfterPhoto(existingAfter || defaultAfter);

    const defaultNotes = 
      issue.category === 'Road Pothole' 
        ? 'Pothole excavated, filled with bituminous hot-mix asphalt, compacted and rolled to municipal grade.'
        : issue.category === 'Garbage Dump'
        ? 'Waste completely cleared with hydraulic compactor, area sanitized with disinfectant powder.'
        : issue.category === 'Broken Streetlight'
        ? 'Blown LED ballast & circuit breaker replaced. Night illumination verified at standard lux.'
        : 'Physical repair completed and verified by municipal inspection unit.';

    setResolutionNotes(issue.verification?.notes || defaultNotes);
    setClearanceScore(issue.verification?.clearanceScore || 98.4);
    playUiSound('beep');
  };

  // Handle Photo File Uploads (Before & After)
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') {
          setBeforePhoto(reader.result as string);
        } else {
          setAfterPhoto(reader.result as string);
        }
        playUiSound('beep');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Resolution & Publish Verification Proof
  const handleSaveResolution = () => {
    if (!resolvingIssue) return;
    if (!afterPhoto) {
      playUiSound('alert');
      afterFileInputRef.current?.click();
      return;
    }

    resolveIssueWithProof(resolvingIssue.id, {
      beforeImageUrl: beforePhoto,
      afterImageUrl: afterPhoto,
      notes: resolutionNotes,
      clearanceScore: clearanceScore,
      aiVerdict: `Resolution verified: Physical restoration completed. Clearance level within ${clearanceScore}% municipal standard.`
    });

    setResolvingIssue(null);
    setMapToast(`✓ #${resolvingIssue.id} resolved with Before & After verification proof!`);
    setTimeout(() => setMapToast(null), 4000);
  };

  // Quick Reopen
  const handleReopenIssue = (issueId: string) => {
    updateIssueStatus(issueId, 'In Progress', 'Complaint reopened by Municipal Admin');
    playUiSound('beep');
    setMapToast(`Ticket #${issueId} reopened.`);
    setTimeout(() => setMapToast(null), 3000);
  };

  const totalUserComplaints = issues.filter(isFromUserPortal).length;
  const pendingCount = scopedIssues.filter((i) => i.status !== 'Resolved').length;
  const resolvedCount = scopedIssues.filter((i) => i.status === 'Resolved').length;

  const currentSelected = displayedComplaints.find((i) => i.id === activeIssueId) || displayedComplaints[0] || issues[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-7">
      
      {/* =========================================================
          1. ADMIN PORTAL HEADER & LIVE METRICS
         ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>BBMP Municipal Admin Portal</span>
            {currentUser && (
              <>
                <span className="text-emerald-300">•</span>
                <span className="text-slate-800 font-bold">{currentUser.name}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            {adminViewMode === 'complaints' ? 'Citizen Complaints Data' : 'Municipal Resolution Map'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {adminViewMode === 'complaints'
              ? 'Review citizen complaints, inspect defect evidence, and upload verified Before & After resolution photos.'
              : 'Interactive city-wide spatial map displaying complaint pin locations across Bengaluru municipal wards.'}
          </p>
        </div>

        {/* Live Metrics Counters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Complaints Received
            </span>
            <span className="text-xl font-mono font-black text-slate-900">
              {scopedIssues.length}
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-amber-700 font-bold block">
              Pending Resolution
            </span>
            <span className="text-xl font-mono font-black text-amber-800">
              {pendingCount}
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">
              Resolved & Verified
            </span>
            <span className="text-xl font-mono font-black text-emerald-800">
              {resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {mapToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-mono font-bold flex items-center gap-2.5 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{mapToast}</span>
        </div>
      )}

      {/* =========================================================
          2. TWO SEPARATE SECTION SWITCHER TABS
         ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/90 p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          {/* Section 1: Complaints Data Tab */}
          <button
            type="button"
            onClick={() => { setAdminViewMode('complaints'); playUiSound('beep'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
              adminViewMode === 'complaints'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Inbox className="w-4 h-4 text-sky-400" />
            <span>1. Complaints Data Queue ({scopedIssues.length})</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-mono rounded-full font-bold">
                {pendingCount} Pending
              </span>
            )}
          </button>

          {/* Section 2: Resolution Map Tab */}
          <button
            type="button"
            onClick={() => { setAdminViewMode('map'); playUiSound('beep'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
              adminViewMode === 'map'
                ? 'bg-slate-900 text-emerald-400 shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>2. Resolution Map ({scopedIssues.length} Pins)</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 px-3 hidden sm:block">
          Active View: {adminViewMode === 'complaints' ? '📋 Complaints & Verification Console' : '🗺️ Spatial Resolution Map'}
        </div>
      </div>

      {/* =========================================================
          VIEW A: COMPLAINTS DATA QUEUE (SEPARATE VIEW)
         ========================================================= */}
      {adminViewMode === 'complaints' && (
        <section 
          id="complaints-data-section"
          aria-label="Complaint Data"
          className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-200"
        >
          {/* Section Header & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 rounded-lg bg-sky-100 text-sky-700">
                  <Inbox className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700">
                  Citizen Grievances Queue
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ● Real-time Sync Active
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                Complaints Sent from User Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review citizen defect reports, inspect photos, upload Before & After repair evidence, and manage ticket closures.
              </p>
            </div>

            {/* Search Bar & View Scope Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* View Scope Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setViewScope('user_portal'); playUiSound('beep'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                    viewScope === 'user_portal'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📤 User Portal ({totalUserComplaints})
                </button>
                <button
                  type="button"
                  onClick={() => { setViewScope('all'); playUiSound('beep'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                    viewScope === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All System Records ({issues.length})
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, category, citizen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white w-full sm:w-56 transition font-sans"
                />
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setStatusFilter('ALL'); playUiSound('beep'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                All Complaints ({scopedIssues.length})
              </button>
              <button
                onClick={() => { setStatusFilter('PENDING'); playUiSound('beep'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  statusFilter === 'PENDING'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
                }`}
              >
                🟡 Pending Resolution ({pendingCount})
              </button>
              <button
                onClick={() => { setStatusFilter('RESOLVED'); playUiSound('beep'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  statusFilter === 'RESOLVED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                }`}
              >
                🟢 Resolved & Verified ({resolvedCount})
              </button>
            </div>

            <span className="text-xs font-mono text-slate-500">
              Showing {displayedComplaints.length} of {scopedIssues.length} records
            </span>
          </div>

          {/* Complaints List Cards */}
          {displayedComplaints.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50/50">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No Complaints Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {viewScope === 'user_portal' 
                  ? 'No user portal complaints found matching your search. Submit a complaint from the citizen portal to see it here live!'
                  : 'No complaints match the selected filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedComplaints.map((issue) => {
                const isSelected = issue.id === activeIssueId;
                const isResolved = issue.status === 'Resolved';
                const fromUser = isFromUserPortal(issue);

                return (
                  <div
                    key={issue.id}
                    className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-white p-5 sm:p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 ${
                      isSelected 
                        ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md' 
                        : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Left: Dual Before & After Photo Preview Container */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* 1. Before Photo */}
                      <div 
                        onClick={() => setPhotoViewer({ issue, mode: 'before' })}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0 shadow-inner cursor-pointer group"
                        title="Click to zoom Before Defect Photo"
                      >
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-rose-950/85 text-[9px] font-mono text-rose-300 px-1.5 py-0.5 rounded font-bold border border-rose-500/30">
                          BEFORE
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <ZoomIn className="w-5 h-5" />
                        </div>
                      </div>

                      {/* 2. After Photo (or Upload Dropzone) */}
                      {isResolved ? (
                        <div 
                          onClick={() => setPhotoViewer({ issue, mode: 'after' })}
                          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500 shrink-0 shadow-sm cursor-pointer group"
                          title="Click to zoom After Resolution Photo"
                        >
                          <img
                            src={issue.verification?.afterImageUrl || issue.imageUrl}
                            alt="Resolution After"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute top-1.5 left-1.5 bg-emerald-950/85 text-[9px] font-mono text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                            AFTER
                          </div>
                          <div className="absolute bottom-1.5 right-1.5 bg-black/75 text-[9px] font-mono text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                            {issue.verification?.clearanceScore || 98.2}%
                          </div>
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                            <ZoomIn className="w-5 h-5" />
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => handleOpenResolveModal(issue)}
                          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-sky-400 hover:border-emerald-500 bg-sky-50/60 hover:bg-emerald-50/60 shrink-0 flex flex-col items-center justify-center text-center p-2 cursor-pointer transition group"
                          title="Click to upload resolution proof photo"
                        >
                          <Camera className="w-6 h-6 text-sky-600 group-hover:text-emerald-600 mb-1 group-hover:scale-110 transition" />
                          <span className="text-[10px] font-bold text-slate-800 leading-tight">
                            Upload After Photo
                          </span>
                          <span className="text-[9px] font-mono text-sky-700 mt-1">
                            + Verify Fix
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle: Identification, Details, and Notes */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header Row: ID + Category + Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                          #{issue.id}
                        </span>

                        <h3 className="text-base font-extrabold text-slate-900 font-display">
                          {issue.category}
                        </h3>

                        {fromUser && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            📤 User Portal
                          </span>
                        )}

                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isResolved 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {isResolved ? '🟢 Resolved & Verified' : '🟡 Pending Resolution'}
                        </span>
                      </div>

                      {/* Citizen & Submission Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-sans">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <User className="w-3.5 h-3.5 text-sky-600" />
                          <span>Citizen: {issue.reporterName || 'Verified Resident'}</span>
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Submitted: {issue.createdAt}</span>
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="text-slate-600 font-medium">
                          Dept: {issue.department}
                        </span>
                      </div>

                      {/* Location Row */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{issue.locationName}</span>
                      </div>

                      {/* Ground Defect Quote */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-sans">
                        "{issue.description}"
                      </div>

                      {/* If Resolved: Verification Verdict Proof Box */}
                      {isResolved && issue.verification && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 font-sans flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold font-mono text-[11px] text-emerald-800 uppercase block">
                              Verified Resolution Proof ({issue.verification.clearanceScore}% Clearance):
                            </span>
                            <p className="text-emerald-900 mt-0.5">
                              "{issue.verification.notes || issue.verification.aiVerdict}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Direct Actions */}
                    <div className="flex flex-row xl:flex-col items-center gap-2 shrink-0 w-full xl:w-44 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                      {/* Button 1: Locate on Map */}
                      <button
                        onClick={() => handleFocusOnMap(issue)}
                        className="flex-1 xl:flex-initial w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition"
                        title="Open in Resolution Map"
                      >
                        <MapPin className="w-3.5 h-3.5 text-sky-600" />
                        <span>Locate on Map</span>
                      </button>

                      {/* Button 2: Resolve & Upload Proof / Edit Proof */}
                      <button
                        onClick={() => handleOpenResolveModal(issue)}
                        className={`flex-1 xl:flex-initial w-full px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 shadow-xs ${
                          isResolved
                            ? 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isResolved ? 'Edit Proof Photos' : '⚡ Resolve & Upload'}</span>
                      </button>

                      {/* Reopen Action (if already resolved) */}
                      {isResolved && (
                        <button
                          onClick={() => handleReopenIssue(issue.id)}
                          className="px-2.5 py-1 text-[11px] font-mono text-rose-600 hover:text-rose-800 flex items-center gap-1 transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reopen Issue</span>
                        </button>
                      )}

                      {/* Details & History */}
                      <button
                        onClick={() => setInspectingIssue(issue)}
                        className="px-2.5 py-1 text-[11px] font-mono text-slate-500 hover:text-slate-800 transition"
                      >
                        Audit Details →
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          VIEW B: RESOLUTION MAP (WHERE COMPLAINTS ARE RAISED)
         ========================================================= */}
      {adminViewMode === 'map' && (
        <section 
          id="resolution-map-section"
          aria-label="Resolution Map"
          className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm flex flex-col animate-in fade-in duration-200"
        >
          {/* Map Header Bar */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <h2 className="font-extrabold text-slate-900 font-display text-base sm:text-lg">
                  Resolution Map: Where Complaints Are Raised
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  Displaying {scopedIssues.length} active grievance coordinates across Bengaluru
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Map Mode: Satellite / Streets */}
              <div className="flex items-center bg-slate-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setMapMode('satellite'); playUiSound('beep'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                    mapMode === 'satellite'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🛰️ Satellite</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMapMode('streets'); playUiSound('beep'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                    mapMode === 'streets'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🗺️ Streets</span>
                </button>
              </div>

              {/* Button to quickly switch to Complaints Queue */}
              <button
                type="button"
                onClick={() => { setAdminViewMode('complaints'); playUiSound('beep'); }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Inbox className="w-3.5 h-3.5 text-sky-400" />
                <span>View Complaints Queue ({scopedIssues.length})</span>
              </button>
            </div>
          </div>

          {/* Map Canvas */}
          <div className="relative w-full h-[600px]">
            <MapContainer
              center={currentSelected ? currentSelected.coordinates : [12.8452, 77.6602]}
              zoom={13}
              scrollWheelZoom={true}
              attributionControl={false}
              className="w-full h-full"
            >
              {/* Satellite View */}
              {mapMode === 'satellite' && (
                <>
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                    opacity={0.8}
                  />
                </>
              )}

              {/* Street View */}
              {mapMode === 'streets' && (
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  maxZoom={19}
                />
              )}

              {/* Dynamic Camera Fly-To */}
              <MapFlyController target={mapFlyTarget} />

              {/* User GPS Location */}
              {detectedLocation && (
                <Marker
                  position={[detectedLocation.lat, detectedLocation.lng]}
                  icon={createUserGpsIcon()}
                >
                  <Popup>
                    <div className="p-1 min-w-[180px]">
                      <span className="text-[10px] font-mono text-sky-600 font-bold uppercase block mb-1">
                        📍 Auto-Detected User Location
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{detectedLocation.area}</h4>
                      <p className="text-[11px] text-slate-600 mt-1">{detectedLocation.address}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Pins for Citizen Complaints */}
              {scopedIssues.map((issue) => {
                const isResolved = issue.status === 'Resolved';
                const isSelected = issue.id === activeIssueId;
                const icon = createMarkerIcon(isResolved, isSelected);

                return (
                  <Marker
                    key={issue.id}
                    position={issue.coordinates}
                    icon={icon}
                    eventHandlers={{
                      click: () => {
                        setActiveIssueId(issue.id);
                        playUiSound('beep');
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-1.5 min-w-[220px] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                            #{issue.id}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                            isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isResolved ? 'Resolved' : 'Pending'}
                          </span>
                        </div>

                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={isResolved && issue.verification ? issue.verification.afterImageUrl : issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <h4 className="font-bold text-xs text-slate-900">{issue.category}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{issue.locationName}</p>

                        <div className="pt-1 flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveIssueId(issue.id);
                              setAdminViewMode('complaints');
                            }}
                            className="w-full py-1 text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition font-mono text-center"
                          >
                            📋 Open in Complaints Queue
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenResolveModal(issue)}
                            className="w-full py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition font-mono text-center"
                          >
                            {isResolved ? '📸 Edit Proof Photos' : '⚡ Resolve with Proof'}
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Clean Map Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-4 text-xs font-mono pointer-events-none">
              <span className="font-bold text-slate-800">Map Legend:</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block ring-2 ring-amber-200"></span> Pending Fix
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200"></span> Resolved & Verified
              </span>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          MODAL 1: ADVANCED RESOLUTION & BEFORE/AFTER PHOTO UPLOAD
         ========================================================= */}
      {resolvingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold font-mono">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      #{resolvingIssue.id}
                    </span>
                    <h3 className="text-base font-bold text-white font-display">
                      Municipal Resolution & Verification Proof
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Upload verified Before & After evidence of physical repair for citizen confirmation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResolvingIssue(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              
              {/* Hidden file inputs */}
              <input
                type="file"
                ref={beforeFileInputRef}
                onChange={(e) => handlePhotoFileChange(e, 'before')}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={afterFileInputRef}
                onChange={(e) => handlePhotoFileChange(e, 'after')}
                accept="image/*"
                className="hidden"
              />

              {/* Dual Before & After Photo Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Before Photo (Citizen Defect Evidence) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      1. BEFORE: Reported Defect
                    </span>
                    <button
                      type="button"
                      onClick={() => beforeFileInputRef.current?.click()}
                      className="text-[10px] text-sky-600 hover:underline font-bold"
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
                    <img
                      src={beforePhoto}
                      alt="Before Defect"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono text-rose-300 font-bold rounded">
                      HAZARD EVIDENCE
                    </div>
                  </div>
                </div>

                {/* 2. After Photo (Resolution Evidence) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      2. AFTER: Verified Resolution Proof
                    </span>
                    {afterPhoto && (
                      <button
                        type="button"
                        onClick={() => afterFileInputRef.current?.click()}
                        className="text-[10px] text-emerald-700 hover:underline font-bold"
                      >
                        Change Photo
                      </button>
                    )}
                  </div>

                  {afterPhoto ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500 shadow-sm group">
                      <img
                        src={afterPhoto}
                        alt="After Resolution"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-950/85 text-[10px] font-mono text-emerald-300 font-bold rounded flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        RESTORED WORK
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => afterFileInputRef.current?.click()}
                      className="aspect-video rounded-2xl border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition group"
                    >
                      <Upload className="w-7 h-7 text-emerald-600 mb-2 group-hover:scale-110 transition" />
                      <span className="text-xs font-bold text-slate-800">
                        Upload Field Repair Proof
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        Take photo or upload fresh repair image
                      </span>
                    </div>
                  )}
                </div>

              </div>

              {/* Work Order Notes & Official Verdict */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Official Work Order & Repair Description:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe repair materials used, leveling quality, and work completed..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Quality & Clearance Level Slider */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 font-mono">
                    Clearance / Restoration Quality Score:
                  </span>
                  <span className="text-emerald-700 font-black font-mono text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {clearanceScore}% Passed
                  </span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  step="0.1"
                  value={clearanceScore}
                  onChange={(e) => setClearanceScore(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setResolvingIssue(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition font-mono"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveResolution}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Mark Resolved (Publish Proof)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: HIGH-RES PHOTO VIEWER & COMPARATOR
         ========================================================= */}
      {photoViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-sky-400 font-bold">
                  #{photoViewer.issue.id}
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  {photoViewer.issue.category} — Defect vs Resolution Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPhotoViewer(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Comparator Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setPhotoViewer({ ...photoViewer, mode: 'compare' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                    photoViewer.mode === 'compare'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Side by Side
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoViewer({ ...photoViewer, mode: 'before' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                    photoViewer.mode === 'before'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Before Photo Only
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoViewer({ ...photoViewer, mode: 'after' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                    photoViewer.mode === 'after'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  After Photo Only
                </button>
              </div>

              {/* Photos Display */}
              {photoViewer.mode === 'compare' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-rose-700 block">
                      1. BEFORE: Reported Defect Evidence
                    </span>
                    <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
                      <img
                        src={photoViewer.issue.imageUrl}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-700 block">
                      2. AFTER: Verified Resolution Proof
                    </span>
                    <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500">
                      <img
                        src={photoViewer.issue.verification?.afterImageUrl || photoViewer.issue.imageUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ) : photoViewer.mode === 'before' ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 max-h-[500px]">
                  <img
                    src={photoViewer.issue.imageUrl}
                    alt="Before"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500 max-h-[500px]">
                  <img
                    src={photoViewer.issue.verification?.afterImageUrl || photoViewer.issue.imageUrl}
                    alt="After"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Proof Details */}
              {photoViewer.issue.verification && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 font-mono block">
                    Municipal Quality Clearance: {photoViewer.issue.verification.clearanceScore}%
                  </span>
                  <p className="text-slate-600 font-sans">
                    "{photoViewer.issue.verification.notes || photoViewer.issue.verification.aiVerdict}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: AUDIT DETAIL MODAL
         ========================================================= */}
      {inspectingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  #{inspectingIssue.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {inspectingIssue.category}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingIssue(null)}
                className="text-slate-400 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
                <img
                  src={inspectingIssue.imageUrl}
                  alt={inspectingIssue.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Citizen Reporter
                  </span>
                  <p className="font-bold text-slate-900">{inspectingIssue.reporterName || 'Citizen'}</p>
                  <p className="text-slate-500 text-[11px]">Submitted at {inspectingIssue.createdAt}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Location & GPS
                  </span>
                  <p className="font-semibold text-slate-800">{inspectingIssue.locationName}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                    Coordinates: [{inspectingIssue.coordinates[0].toFixed(5)}, {inspectingIssue.coordinates[1].toFixed(5)}]
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Ground Issue Description
                  </span>
                  <p className="text-slate-700 leading-relaxed font-sans">{inspectingIssue.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setInspectingIssue(null);
                  handleFocusOnMap(inspectingIssue);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition"
              >
                📍 Locate on Map
              </button>

              <button
                type="button"
                onClick={() => {
                  setInspectingIssue(null);
                  handleOpenResolveModal(inspectingIssue);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
              >
                📸 Resolve with Proof
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
