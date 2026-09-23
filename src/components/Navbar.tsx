import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  RotateCcw,
  Presentation,
  Video,
  Scan,
  UserCheck,
  LogOut
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export const Navbar: React.FC<{ 
  onOpenPitchDeck?: () => void;
  onOpenScreenRecord?: () => void;
}> = ({ onOpenPitchDeck, onOpenScreenRecord }) => {
  const { 
    setActiveTab, 
    guidedModeActive, 
    setGuidedModeActive, 
    resetToDemoDefaults,
    playUiSound,
    currentUser,
    openAuthModal,
    logout
  } = useCivic();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'officer';

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/90 px-3 lg:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand: CivicAI */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => { setActiveTab(isAdmin ? 'admin' : 'citizen'); playUiSound('beep'); }}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white font-black shadow-md shadow-slate-900/10 transition group-hover:scale-105 border border-slate-800">
            <Scan className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAdmin ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAdmin ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                Civic<span className={isAdmin ? 'text-emerald-600 font-bold' : 'text-sky-600 font-bold'}>AI</span>
              </span>
              {isAdmin ? (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold tracking-wider flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Admin Command
                </span>
              ) : (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-bold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                  Citizen Portal
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 tracking-wide font-mono hidden sm:block">
              {isAdmin ? 'BBMP Municipal Incident Resolution Command' : 'Autonomous Public Issue Resolution'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onOpenScreenRecord && (
            <button
              onClick={() => {
                onOpenScreenRecord();
                playUiSound('beep');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 shadow-sm"
              title="Play Live Simulated Screen Recording Walkthrough"
            >
              <Video className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Screen Record</span>
              <span className="sm:hidden">Tour</span>
            </button>
          )}

          {onOpenPitchDeck && (
            <button
              onClick={() => {
                onOpenPitchDeck();
                playUiSound('beep');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"
              title="Open Presentation Slides"
            >
              <Presentation className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Pitch Deck</span>
            </button>
          )}

          <button
            onClick={() => {
              setGuidedModeActive(!guidedModeActive);
              playUiSound('beep');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              guidedModeActive
                ? 'bg-sky-600 text-white font-bold border-sky-600 shadow-md shadow-sky-600/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Toggle Demo Guide"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Demo Guide</span>
          </button>

          <button
            onClick={resetToDemoDefaults}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition"
            title="Reset Mock Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile & Account Credentials Widget */}
          {currentUser ? (
            <div className="relative group ml-1">
              <button 
                onClick={() => playUiSound('beep')}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl text-white transition shadow-sm ${
                  isAdmin ? 'bg-slate-900 border border-emerald-500/50 hover:bg-slate-800' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center font-mono ${
                  isAdmin ? 'bg-emerald-500 text-slate-950' : 'bg-sky-500 text-slate-950'
                }`}>
                  {isAdmin ? '🏛️' : currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-tight truncate max-w-[110px] text-white">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className={`text-[9px] font-mono capitalize ${isAdmin ? 'text-emerald-400 font-bold' : 'text-sky-400'}`}>
                    {isAdmin ? 'Admin Console' : currentUser.role}
                  </div>
                </div>
              </button>

              {/* Account Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1">
                <div className="border-b border-slate-100 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                      {isAdmin ? 'Authorized Municipal Officer' : 'Verified Resident'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="text-[10px] font-mono text-slate-600 bg-slate-50 rounded-md p-1 mt-1.5 border border-slate-100 truncate">
                    📍 {currentUser.ward}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    playUiSound('beep');
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition font-medium flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of Account
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ml-1">
              {/* Separate Official Admin Login Button */}
              <button
                onClick={() => openAuthModal('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm font-mono"
                title="Municipal Officer & Government Command Gateway"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Admin Portal</span>
                <span className="sm:hidden">Admin</span>
              </button>

              {/* Citizen Sign In / Create Account Button */}
              <button
                onClick={() => openAuthModal('citizen')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-sky-600 hover:bg-sky-500 text-white shadow-sm font-mono"
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-200" />
                <span className="hidden sm:inline">Citizen Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
