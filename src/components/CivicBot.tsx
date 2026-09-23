import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  Paperclip, 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  ChevronDown, 
  ShieldAlert, 
  HeartPulse, 
  Building2, 
  Zap, 
  ArrowUp,
  Cpu,
  Layers,
  Flame,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  model?: string;
  attachment?: string;
}

interface ChatThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

const PRESET_THREADS: ChatThread[] = [
  {
    id: 'thread-1',
    title: 'Pothole Analysis #CA1024',
    lastMessage: 'Complaint #CA1024 assigned to Rapid Road Unit #14 with 18h SLA remaining.',
    timestamp: 'Just now',
  },
  {
    id: 'thread-2',
    title: 'Ward 192 Streetlight Audit',
    lastMessage: 'Verified 8 luminaire outages along Electronics City Flyover slip road.',
    timestamp: '2h ago',
  },
  {
    id: 'thread-3',
    title: 'Monsoon Drainage Protocol',
    lastMessage: 'High flood-risk zone flagged near Silk Board junction culvert.',
    timestamp: 'Yesterday',
  },
  {
    id: 'thread-4',
    title: 'BESCOM Live Wire Alert',
    lastMessage: 'Hazard dispatched to BESCOM Bommasandra feeder desk; power isolated.',
    timestamp: 'Sep 21',
  },
];

const SUGGESTED_PROMPTS = [
  {
    title: 'Inspect #CA1024 Live Status',
    desc: 'Get real-time GPS coordinates, assigned crew & remaining SLA',
    query: 'What is the live dispatch status and remaining SLA for complaint #CA1024?',
    icon: <Building2 className="w-4 h-4 text-sky-500" />,
  },
  {
    title: 'Nearby Emergency Lifelines',
    desc: 'List emergency police, trauma care & fire stations for active location',
    query: 'Show me all active emergency numbers, police stations, and trauma hospitals near my detected location.',
    icon: <HeartPulse className="w-4 h-4 text-rose-500" />,
  },
  {
    title: 'Dynamic Priority Scoring',
    desc: 'How the algorithm prioritizes arterial hazards over FIFO backlogs',
    query: 'Explain how the CivicAI priority score formula balances severity, duplicates, and arterial traffic impact.',
    icon: <Cpu className="w-4 h-4 text-purple-500" />,
  },
  {
    title: 'Open Manhole Protocol',
    desc: 'Official BBMP emergency escalation procedure for uncovered chambers',
    query: 'What is the immediate life-safety protocol and guaranteed SLA for an open manhole on a public roadway?',
    icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
  },
];

export const CivicBot: React.FC = () => {
  const { activeIssueId, issues, playUiSound, currentUser, detectedLocation } = useCivic();

  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState<'CivicAI 4.5 Pro' | 'Civic 4o Omni' | 'Disaster DeepSeek R1'>('CivicAI 4.5 Pro');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const [activeThreadId, setActiveThreadId] = useState('thread-1');
  const [threads, setThreads] = useState<ChatThread[]>(PRESET_THREADS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello ${currentUser ? currentUser.name.split(' ')[0] : 'Citizen'}! I am **CivicAI 4.5 Pro**, your autonomous civic intelligence assistant.\n\nI have indexed active complaint **#${activeIssueId}** in ${detectedLocation ? detectedLocation.area : 'Electronic City Phase 1'}. Ask me about municipal SLAs, live triage, or emergency helpline dispatch.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'CivicAI 4.5 Pro',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playUiSound('beep');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    playUiSound('beep');
    const newId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: 'New Civic Inquiry',
      lastMessage: 'Chat initialized',
      timestamp: 'Just now',
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `New conversation started with **${selectedModel}**.\nHow can I assist you with municipal triage, complaint tracking, or emergency life safety?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
      },
    ]);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() && !attachedImage) return;

    playUiSound('beep');
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    // Update active thread title if default
    const activeIssue = issues.find((i) => i.id === activeIssueId);

    // Call Python backend or smart realistic generation
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          issue_id: activeIssueId,
          model: selectedModel 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.response,
          time: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: selectedModel,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        playUiSound('beep');
        return;
      }
    } catch {
      // Backend fallback handled below
    }

    // Realistic Pro assistant synthesis
    setTimeout(() => {
      let reply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('status') || lower.includes('ca1024') || lower.includes('ticket')) {
        reply = `### Incident Triage Status: #${activeIssueId}\n\n` +
          `- **Category:** ${activeIssue?.category || 'Road Pothole'}\n` +
          `- **Severity:** ${activeIssue?.severity || 'High'} (${activeIssue?.severityScore || 88}/100)\n` +
          `- **Assigned Unit:** ${activeIssue?.assignedCrew || 'Rapid Road Repair Unit #14'}\n` +
          `- **Department:** ${activeIssue?.department || 'Municipal Roads'}\n` +
          `- **SLA Remaining:** 18 hours (Standard 24h SLA)\n` +
          `- **Current Phase:** **In Progress** — Physical crew on-site. AI camera closure verification pending.`;
      } else if (lower.includes('emergency') || lower.includes('hospital') || lower.includes('police') || lower.includes('number')) {
        reply = `### 🚨 Emergency Lifeline & Helplines (Ward 192)\n\n` +
          `| Service | Helpline | Response Time | Description |\n` +
          `| :--- | :--- | :--- | :--- |\n` +
          `| **Police Control Room** | **112 / 080-28520033** | < 8 mins | Electronic City Police Station |\n` +
          `| **Ambulance / Trauma** | **108 / 080-71222222** | Immediate | Narayana Health City Trauma ICU |\n` +
          `| **Fire & Disaster** | **101 / 080-28520101** | Rapid | Electronic City Phase 1 Fire Station |\n` +
          `| **BBMP Disaster Cell** | **1533 / 080-22660000** | 24x7 | Flooding, Road Collapse, Fallen Trees |\n` +
          `| **BESCOM Live Wire** | **1912** | 24x7 | Electric Sparks & Fallen Cables |\n` +
          `| **BWSSB Water Leak** | **1916** | 24x7 | High-Pressure Main Burst |`;
      } else if (lower.includes('priority') || lower.includes('formula') || lower.includes('algorithm')) {
        reply = `### ⚙️ CivicAI Autonomous Priority Engine\n\n` +
          `Our engine calculates an **Urgency Index (0-100)** to eliminate first-in-first-out (FIFO) bureaucracy:\n\n` +
          `$$\\text{Priority} = 0.35(S) + 0.25(D) + 0.20(L) + 0.20(P)$$\n\n` +
          `- **Severity ($S$, 35%):** Computer vision depth & hazard estimation.\n` +
          `- **Duplicates ($D$, 25%):** Geospatial clustering within 150m radius.\n` +
          `- **Location Importance ($L$, 20%):** Arterial corridors, school zones & bus routes receive elevated multiplier.\n` +
          `- **Public Impact ($P$, 20%):** Commuter volume & peak-hour safety risk.`;
      } else if (lower.includes('manhole') || lower.includes('drain')) {
        reply = `### ⚠️ Open Manhole Life-Safety Protocol\n\n` +
          `1. **AI Auto-Escalation:** Open manholes trigger a **Critical 6-Hour SLA** override immediately upon photo confirmation.\n` +
          `2. **Barricade Dispatch:** Automated notice sent to nearest BBMP Ward patrol for immediate fluorescent reflective barricade placement (<45 mins).\n` +
          `3. **Ductile Iron Replacement:** Water & Sewerage (BWSSB) emergency repair crew dispatched with heavy-duty replacement frame.`;
      } else {
        reply = `I have received your inquiry regarding municipal operations. As **${selectedModel}**, I monitor live telemetry across Bengaluru BBMP wards. You can ask me to track existing tickets, lookup emergency numbers, or analyze municipal SLAs.`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      playUiSound('beep');
    }, 700);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      playUiSound('beep');
    } else {
      setIsRecording(true);
      playUiSound('scan');
      setTimeout(() => {
        setIsRecording(false);
        setInput('Check live tracking status and assigned repair crew for ticket #CA1024');
        playUiSound('success');
      }, 2500);
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachedImage(reader.result);
          playUiSound('beep');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Render markdown-like simple formatting for tables and code blocks
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    const isTable = text.includes('|') && text.includes('---');

    if (isTable) {
      return (
        <div className="space-y-2 text-xs leading-relaxed">
          {lines.map((line, idx) => {
            if (line.startsWith('|')) {
              const cells = line.split('|').filter(c => c.trim().length > 0);
              if (line.includes('---')) return null;
              const isHeader = idx < 4;
              return (
                <div key={idx} className={`grid grid-cols-4 gap-2 p-1.5 rounded-lg ${isHeader ? 'bg-slate-100 font-bold font-mono text-slate-800' : 'bg-slate-50/70 border border-slate-100 text-slate-700'}`}>
                  {cells.map((cell, cidx) => (
                    <span key={cidx} className="truncate">{cell.trim().replace(/\*\*/g, '')}</span>
                  ))}
                </div>
              );
            }
            if (line.startsWith('###')) {
              return <h4 key={idx} className="font-bold text-sm text-slate-900 mt-2 mb-1">{line.replace('###', '').trim()}</h4>;
            }
            return <p key={idx}>{line}</p>;
          })}
        </div>
      );
    }

    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
        {lines.map((line, idx) => {
          if (line.startsWith('###')) {
            return (
              <h4 key={idx} className="font-extrabold text-sm sm:text-base text-slate-900 mt-2 mb-1">
                {line.replace('###', '').trim()}
              </h4>
            );
          }
          if (line.startsWith('- ')) {
            const parts = line.replace('- ', '').split(':');
            return (
              <div key={idx} className="flex items-start gap-2 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-900 font-semibold">{parts[0]}:</strong>
                  {parts.slice(1).join(':')}
                </span>
              </div>
            );
          }
          if (line.startsWith('$$')) {
            return (
              <div key={idx} className="p-2.5 my-2 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto">
                {line.replace(/\$\$/g, '')}
              </div>
            );
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            playUiSound('beep');
          }}
          className="relative group flex items-center gap-2.5 pl-3.5 pr-4 py-3 bg-slate-950 text-white rounded-2xl shadow-2xl hover:bg-slate-900 transition-all border border-slate-800 hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-sky-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>CivicAI Pro</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                GPT-Pro
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Autonomous Chatbot</div>
          </div>
        </button>
      </div>

      {/* ChatGPT Pro Dialog Box */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl border border-slate-200/90 bg-white overflow-hidden ${
            isFullscreen 
              ? 'inset-3 sm:inset-6 rounded-3xl' 
              : 'bottom-20 right-4 sm:right-6 w-[95vw] sm:w-[840px] h-[640px] max-h-[90vh] rounded-3xl'
          }`}
        >
          {/* Top Bar / Model Selector */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition hidden md:block"
                title="Toggle Sidebar"
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Model Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold font-mono transition text-slate-100"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>{selectedModel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {modelDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                    <button
                      onClick={() => { setSelectedModel('CivicAI 4.5 Pro'); setModelDropdownOpen(false); playUiSound('beep'); }}
                      className={`w-full text-left p-2.5 rounded-xl transition ${selectedModel === 'CivicAI 4.5 Pro' ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-200'}`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>CivicAI 4.5 Pro</span>
                        <span className="text-[9px] font-mono px-1 rounded bg-black/30 text-sky-200">Recommended</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono mt-0.5">High-reasoning civic & SLA engine</div>
                    </button>

                    <button
                      onClick={() => { setSelectedModel('Civic 4o Omni'); setModelDropdownOpen(false); playUiSound('beep'); }}
                      className={`w-full text-left p-2.5 rounded-xl transition mt-1 ${selectedModel === 'Civic 4o Omni' ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-200'}`}
                    >
                      <div className="text-xs font-bold">Civic 4o Omni</div>
                      <div className="text-[10px] text-slate-300 font-mono mt-0.5">Ultra-fast field complaint classification</div>
                    </button>

                    <button
                      onClick={() => { setSelectedModel('Disaster DeepSeek R1'); setModelDropdownOpen(false); playUiSound('beep'); }}
                      className={`w-full text-left p-2.5 rounded-xl transition mt-1 ${selectedModel === 'Disaster DeepSeek R1' ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-200'}`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>Disaster DeepSeek R1</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono mt-0.5">Emergency triage & life safety focus</div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions on Top Right */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                title="Start New Thread"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition"
                title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => { setIsOpen(false); playUiSound('beep'); }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Container: Sidebar + Chat Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar (ChatGPT Pro Threads) */}
            {sidebarOpen && (
              <div className="w-60 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between p-3 hidden md:flex shrink-0">
                <div className="space-y-3">
                  <button
                    onClick={handleNewChat}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-bold font-mono transition flex items-center justify-between border border-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-400" />
                      New Thread
                    </span>
                    <span className="text-[10px] text-slate-400">⌘K</span>
                  </button>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2">
                      Recent Threads
                    </span>
                    {threads.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveThreadId(t.id);
                          playUiSound('beep');
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition flex items-center gap-2.5 ${
                          activeThreadId === t.id
                            ? 'bg-slate-800 text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                        <span className="truncate">{t.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Bottom Status */}
                <div className="border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-slate-800/50 text-slate-300">
                    <div className="w-5 h-5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-white leading-tight">Pro Plan Unlimited</div>
                      <div className="text-[9px] text-slate-400 font-mono truncate">BBMP Triage Grid</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col justify-between bg-slate-50/50 min-w-0">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Empty State / Suggestions */}
                {messages.length === 1 && (
                  <div className="max-w-2xl mx-auto my-4 space-y-4">
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/10 border border-slate-800">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 font-display">
                        How can CivicAI Pro assist your ward today?
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        Multimodal civic triage, emergency numbers & SLA enforcement
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SUGGESTED_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(p.query)}
                          className="p-3 text-left rounded-2xl bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 transition shadow-2xs group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {p.icon}
                            <span className="font-bold text-xs text-slate-900 group-hover:text-sky-700">
                              {p.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {p.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Stream */}
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-xs ${
                        isUser 
                          ? 'bg-slate-900 text-white font-mono text-xs font-bold' 
                          : 'bg-sky-600 text-white'
                      }`}>
                        {isUser ? (currentUser ? currentUser.name.charAt(0) : 'U') : <Bot className="w-4 h-4" />}
                      </div>

                      {/* Content Card */}
                      <div className={`group relative rounded-2xl p-4 shadow-xs max-w-[85%] sm:max-w-[78%] ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none'
                      }`}>
                        {/* Attached Image preview if any */}
                        {msg.attachment && (
                          <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 max-w-xs">
                            <img src={msg.attachment} alt="Attachment" className="w-full h-32 object-cover" />
                          </div>
                        )}

                        {/* Text */}
                        {isUser ? (
                          <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        ) : (
                          renderMessageContent(msg.text)
                        )}

                        {/* Metadata Footer */}
                        <div className={`flex items-center justify-between gap-3 mt-2.5 pt-2 border-t text-[10px] font-mono ${
                          isUser ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-400'
                        }`}>
                          <span>{msg.time}</span>
                          {!isUser && (
                            <div className="flex items-center gap-2">
                              <span>{msg.model || 'CivicAI Pro'}</span>
                              <button
                                onClick={() => handleCopyText(msg.text, msg.id)}
                                className="p-1 hover:text-slate-700 transition"
                                title="Copy Text"
                              >
                                {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 max-w-md mr-auto animate-in fade-in">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] font-mono text-slate-500 ml-2">CivicAI Pro synthesizing telemetry...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Pro Input Bar */}
              <div className="p-4 bg-white border-t border-slate-200">
                {attachedImage && (
                  <div className="mb-2 flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl w-fit">
                    <img src={attachedImage} alt="Thumb" className="w-10 h-10 object-cover rounded-lg" />
                    <span className="text-xs text-slate-600 font-mono">Photo attached</span>
                    <button
                      onClick={() => setAttachedImage(null)}
                      className="p-1 hover:bg-slate-200 rounded-full text-slate-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="relative flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-300/80 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 p-2 transition">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileAttach}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Attachment Icon */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition shrink-0"
                    title="Upload Inspection Image"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`Message ${selectedModel}... (Shift+Enter for newline)`}
                    className="flex-1 max-h-36 bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 py-1.5 px-1 font-sans"
                  />

                  {/* Mic Dictation */}
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-xl transition shrink-0 ${
                      isRecording 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                    }`}
                    title={isRecording ? 'Listening...' : 'Voice Dictate'}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send Button (ChatGPT Pro Style circle) */}
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() && !attachedImage}
                    className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 transition shrink-0 shadow-sm"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 px-1">
                  <span>CivicAI Pro can make mistakes. Verify life-safety hazards with 112.</span>
                  <span className="hidden sm:inline">Model: {selectedModel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
