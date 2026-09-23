import React from 'react';
import { 
  Camera, 
  MapPin, 
  Inbox,
  Activity
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    playUiSound, 
    currentUser, 
    issues,
    guidedModeActive,
    adminViewMode,
    setAdminViewMode
  } = useCivic();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'officer' || activeTab === 'admin';

  // Count unassigned/new issues for Admin
  const pendingCount = issues.filter(
    (i) => i.status !== 'Resolved'
  ).length;

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    playUiSound('beep');
  };

  // If guided tour is active on mobile, lift bottom dock slightly so they don't collide
  const bottomPositionClass = guidedModeActive 
    ? 'bottom-24 sm:bottom-20' 
    : 'bottom-3 sm:bottom-4';

  return (
    <nav 
      aria-label="Mobile Application Navigation Dock"
      className={`fixed ${bottomPositionClass} left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm transition-all duration-300 pointer-events-auto`}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-1.5 shadow-2xl shadow-slate-950/40 flex items-center justify-around text-white">
        
        {isAdmin ? (
          /* =========================================================
             STRICT ADMIN ONLY NAVIGATION DOCK
             ========================================================= */
          <>
            {/* ADMIN TAB 1: Resolution Map */}
            <button
              onClick={() => {
                handleTabChange('admin');
                setAdminViewMode('map');
              }}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all ${
                activeTab === 'admin' && adminViewMode === 'map'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-5 h-5 mb-0.5 text-emerald-400" />
              <span className="text-[11px] font-mono tracking-tight truncate">Resolution Map</span>
            </button>

            {/* ADMIN TAB 2: Complaints Data */}
            <button
              onClick={() => {
                handleTabChange('admin');
                setAdminViewMode('complaints');
              }}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all ${
                activeTab === 'admin' && adminViewMode === 'complaints'
                  ? 'bg-slate-800 text-sky-400 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Inbox className="w-5 h-5 mb-0.5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full ring-2 ring-slate-900 font-mono">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono tracking-tight truncate">Complaints Data</span>
            </button>
          </>
        ) : (
          /* =========================================================
             STRICT CITIZEN ONLY NAVIGATION DOCK
             ========================================================= */
          <>
            {/* CITIZEN TAB 1: Report Issue */}
            <button
              onClick={() => handleTabChange('citizen')}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all ${
                activeTab === 'citizen'
                  ? 'bg-sky-500 text-white font-bold shadow-lg shadow-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Camera className="w-5 h-5 mb-0.5" />
                {activeTab === 'citizen' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                )}
              </div>
              <span className="text-[11px] font-mono tracking-tight truncate">Report Issue</span>
            </button>

            {/* CITIZEN TAB 2: Track Status */}
            <button
              onClick={() => handleTabChange('tracking')}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all ${
                activeTab === 'tracking'
                  ? 'bg-sky-500 text-white font-bold shadow-lg shadow-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-mono tracking-tight truncate">Track Issue</span>
            </button>
          </>
        )}

      </div>
    </nav>
  );
};

export default BottomNav;
