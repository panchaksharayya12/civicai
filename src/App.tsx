import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { Navbar } from './components/Navbar';
import { CitizenHome } from './components/CitizenHome';
import { AIAnalysisModal } from './components/AIAnalysisModal';
import { LiveTracking } from './components/LiveTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { PriorityEngine } from './components/PriorityEngine';
import { ResolutionVerification } from './components/ResolutionVerification';
import { GuidedDemoBar } from './components/GuidedDemoBar';
import { CivicBot } from './components/CivicBot';
import { PitchDeckModal } from './components/PitchDeckModal';
import { ScreenRecordTour } from './components/ScreenRecordTour';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';

const AppContent: React.FC = () => {
  const { activeTab } = useCivic();
  const [pitchDeckOpen, setPitchDeckOpen] = React.useState(false);
  const [screenRecordOpen, setScreenRecordOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 relative selection:bg-sky-500 selection:text-white pb-28">
      {/* Top Navigation */}
      <Navbar 
        onOpenPitchDeck={() => setPitchDeckOpen(true)} 
        onOpenScreenRecord={() => setScreenRecordOpen(true)}
      />

      {/* Main Screen Views */}
      <main className="flex-1">
        {activeTab === 'citizen' && <CitizenHome />}
        {activeTab === 'tracking' && <LiveTracking />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'priority' && <PriorityEngine />}
        {activeTab === 'verify' && <ResolutionVerification />}
      </main>

      {/* User Authentication & Account Creation Modal */}
      <AuthModal />

      {/* Persistent AI Diagnostics Modal */}
      <AIAnalysisModal />

      {/* Presentation Pitch Deck Modal for Judges */}
      <PitchDeckModal isOpen={pitchDeckOpen} onClose={() => setPitchDeckOpen(false)} />

      {/* Interactive Live Screen Recording Simulation Tour */}
      <ScreenRecordTour isActive={screenRecordOpen} onClose={() => setScreenRecordOpen(false)} />

      {/* Interactive Floating CivicBot Assistant */}
      <CivicBot />

      {/* Responsive App Dock Navigation Bar */}
      <BottomNav />

      {/* Interactive Guided Hackathon Tour Dock */}
      <GuidedDemoBar />

      {/* Clean Civic Footer */}
      <footer className="mt-auto border-t border-slate-200/80 py-6 px-4 text-center text-xs text-slate-500 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">CivicAI Operations Grid</span>
            <span className="text-slate-300">•</span>
            <span>Autonomous Closed-Loop Civic Triage</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Bengaluru Metropolitan Smart City System
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CivicProvider>
      <AppContent />
    </CivicProvider>
  );
};

export default App;
