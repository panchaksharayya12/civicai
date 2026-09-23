import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Presentation, 
  Flame
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export const PitchDeckModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { playUiSound } = useCivic();

  if (!isOpen) return null;

  const SLIDES = [
    {
      badge: 'Slide 1 of 4 • The Civic Crisis',
      title: 'Municipal Helplines Are Broken',
      subtitle: 'Why traditional public grievance portals fail both citizens and municipal authorities.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-50 border border-rose-200">
            <span className="text-2xl font-black text-rose-600 block mb-1 font-mono">FIFO Failure</span>
            <h5 className="font-bold text-slate-900 text-sm mb-1 font-display">First-In-First-Out Delays</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complaints are queued in chronological order. A cosmetic wall graffiti is processed ahead of a lethal 4ft open manhole on a school route.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-amber-200">
            <span className="text-2xl font-black text-amber-600 block mb-1 font-mono">42% Duplicates</span>
            <h5 className="font-bold text-slate-900 text-sm mb-1 font-display">Crowdsource Spam</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a pothole appears on an arterial road, 20 citizens report it independently, overwhelming call centers with redundant tickets.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-black text-slate-800 block mb-1 font-mono">Zero Proof</span>
            <h5 className="font-bold text-slate-900 text-sm mb-1 font-display">Ghost Closures</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Contractors falsely mark tickets "Resolved" without photographic evidence, leaving citizens frustrated and civic trust broken.
            </p>
          </div>
        </div>
      )
    },
    {
      badge: 'Slide 2 of 4 • The Visor Solution',
      title: 'CivicAI: Autonomous Action Engine',
      subtitle: 'An end-to-end platform from computer vision diagnosis to verified site closure.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-50 border border-sky-200">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold mb-2 font-mono">1</div>
            <h5 className="font-bold text-slate-900 text-sm mb-1 font-display">AI Computer Vision</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extracts defect class, depth, severity, and clusters duplicates within 110m radius automatically.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-sky-200">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold mb-2 font-mono">2</div>
            <h5 className="font-bold text-slate-900 text-sm mb-1 font-display">AI Priority Engine</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Weights severity, duplicate density, and arterial road traffic to dynamically rank urgent incidents.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold mb-2 font-mono">3</div>
            <h5 className="font-bold text-slate-900 text-sm mb-1 font-display">Before / After Audit</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI compares repair photos against original damage. Ticket closes only when citizen confirms satisfaction.
            </p>
          </div>
        </div>
      )
    },
    {
      badge: 'Slide 3 of 4 • System Architecture',
      title: 'Full-Stack Modern Civic Architecture',
      subtitle: 'Engineered for extreme reliability, offline resilience, and cross-screen synchronization.',
      content: (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-3.5 text-left">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-sky-700 font-bold">CLIENT LAYER</span>
            <span className="text-slate-600">React 18 + Vite + Tailwind CSS + Web Speech API</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-sky-600 font-bold">GEOSPATIAL & GIS</span>
            <span className="text-slate-600">Leaflet.js + CartoDB Positron Tiles + Radar Rings</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-emerald-700 font-bold">BACKEND SERVICE</span>
            <span className="text-slate-600">Python FastAPI + Uvicorn + Zero-Dependency Fallback</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-900 font-bold">SYNC & EVENT BUS</span>
            <span className="text-slate-600">BroadcastChannel API (Dual-Screen Presentation Sync)</span>
          </div>
        </div>
      )
    },
    {
      badge: 'Slide 4 of 4 • Impact & Metrics',
      title: 'Measurable Civic Impact & Scalability',
      subtitle: 'Transforming municipal governance into transparent, measurable public service.',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-3xl font-black text-sky-700 block mb-1 font-mono">68%</span>
            <span className="text-xs text-slate-800 font-semibold block">Faster Dispatch</span>
            <p className="text-[11px] text-slate-500 mt-1">Direct auto-routing to department crews</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-3xl font-black text-sky-600 block mb-1 font-mono">92%</span>
            <span className="text-xs text-slate-800 font-semibold block">Deduplication</span>
            <p className="text-[11px] text-slate-500 mt-1">Crowdsource reports merged automatically</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-3xl font-black text-emerald-600 block mb-1 font-mono">0%</span>
            <span className="text-xs text-slate-800 font-semibold block">Ghost Closures</span>
            <p className="text-[11px] text-slate-500 mt-1">Guaranteed by AI Before/After audit</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-3xl font-black text-slate-900 block mb-1 font-mono">24h</span>
            <span className="text-xs text-slate-800 font-semibold block">Strict SLA</span>
            <p className="text-[11px] text-slate-500 mt-1">Real-time countdown accountability</p>
          </div>
        </div>
      )
    }
  ];

  const current = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-sky-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-sky-700 font-bold">
              {current.badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2 font-display">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-6">
            {current.subtitle}
          </p>

          <div className="my-2">
            {current.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'bg-sky-600 w-6 shadow-sm' : 'bg-slate-200'
                }`}
              ></span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/CivicAI_Visor_Edition_Pitch_Deck.pptx"
              download="CivicAI_Visor_Edition_Pitch_Deck.pptx"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              title="Download PowerPoint Presentation (.pptx)"
            >
              <span>Download .PPTX</span>
            </a>

            <button
              onClick={() => {
                if (currentSlide > 0) {
                  setCurrentSlide(currentSlide - 1);
                  playUiSound('beep');
                }
              }}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-30 transition shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (currentSlide < SLIDES.length - 1) {
                  setCurrentSlide(currentSlide + 1);
                  playUiSound('beep');
                } else {
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1.5 transition shadow-md shadow-sky-500/20"
            >
              <span>{currentSlide === SLIDES.length - 1 ? 'Finish Deck' : 'Next Slide'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
