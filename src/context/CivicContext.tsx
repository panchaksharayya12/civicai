import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CivicIssue, PriorityWeights, ActiveTab, Status, VerificationData, UserProfile, EmergencyService } from '../types';
import { INITIAL_ISSUES, SAMPLE_IMAGES } from '../data/mockData';
import { getNearbyEmergencyServices, NATIONAL_EMERGENCIES } from '../data/emergencyData';

interface CivicContextType {
  issues: CivicIssue[];
  activeIssueId: string;
  setActiveIssueId: (id: string) => void;
  activeIssue: CivicIssue | undefined;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  priorityWeights: PriorityWeights;
  setPriorityWeights: React.Dispatch<React.SetStateAction<PriorityWeights>>;
  stats: {
    totalIssues: number;
    aiVerified: number;
    highPriority: number;
    resolved: number;
  };
  analysisModalOpen: boolean;
  setAnalysisModalOpen: (open: boolean) => void;
  stagedReport: Partial<CivicIssue> | null;
  setStagedReport: (report: Partial<CivicIssue> | null) => void;
  addNewIssue: (issue: CivicIssue) => void;
  updateIssueStatus: (id: string, newStatus: Status, note?: string) => void;
  submitResolutionVerification: (id: string, verification: VerificationData) => void;
  confirmCitizenResolution: (id: string, confirmed: boolean) => void;
  playUiSound: (type: 'beep' | 'success' | 'alert' | 'scan') => void;
  triggerCelebration: () => void;
  guidedStep: number;
  setGuidedStep: React.Dispatch<React.SetStateAction<number>>;
  guidedModeActive: boolean;
  setGuidedModeActive: (active: boolean) => void;
  resetToDemoDefaults: () => void;
  // Auth state & methods
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authInitialPortal: 'citizen' | 'admin';
  openAuthModal: (portal?: 'citizen' | 'admin') => void;
  login: (email: string, password: string, explicitRole?: 'citizen' | 'officer' | 'admin') => boolean;
  signup: (userData: Omit<UserProfile, 'id' | 'createdAt'> & { password?: string }) => boolean;
  logout: () => void;
  requireAuth: (callback: () => void) => boolean;
  // Location & Emergency state
  detectedLocation: { lat: number; lng: number; address: string; area: string } | null;
  isLocating: boolean;
  emergencyServices: EmergencyService[];
  detectLocationAndEmergencies: () => Promise<void>;
  setCustomLocation: (address: string, lat?: number, lng?: number) => void;
  // Admin View Section Mode ('complaints' | 'map')
  adminViewMode: 'complaints' | 'map';
  setAdminViewMode: (mode: 'complaints' | 'map') => void;
  // Advanced Resolution with Before & After proof
  resolveIssueWithProof: (
    id: string,
    params: {
      afterImageUrl: string;
      beforeImageUrl?: string;
      notes: string;
      clearanceScore?: number;
      aiVerdict?: string;
    }
  ) => void;
}

const DEFAULT_WEIGHTS: PriorityWeights = {
  severity: 0.35,
  duplicates: 0.25,
  locationImportance: 0.20,
  publicImpact: 0.20,
};

// Web Audio API futuristic sound synthesizer
const playTone = (freq: number, duration: number, type: OscillatorType = 'sine') => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio might be muted/blocked by browser gesture policy, ignore gracefully
  }
};

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<CivicIssue[]>(() => {
    const saved = localStorage.getItem('civic_ai_issues');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ISSUES;
      }
    }
    return INITIAL_ISSUES;
  });

  const [activeIssueId, setActiveIssueId] = useState<string>('CA1024');
  const [activeTab, setActiveTab] = useState<ActiveTab>('citizen');
  const [adminViewMode, setAdminViewMode] = useState<'complaints' | 'map'>('complaints');
  const [priorityWeights, setPriorityWeights] = useState<PriorityWeights>(DEFAULT_WEIGHTS);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [stagedReport, setStagedReport] = useState<Partial<CivicIssue> | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedModeActive, setGuidedModeActive] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('civic_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialPortal, setAuthInitialPortal] = useState<'citizen' | 'admin'>('citizen');
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  const openAuthModal = (portal: 'citizen' | 'admin' = 'citizen') => {
    setAuthInitialPortal(portal);
    setIsAuthModalOpen(true);
    playUiSound('beep');
  };

  // Auto-detected Location & Nearby Emergency Helplines
  const [detectedLocation, setDetectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    area: string;
  } | null>(() => {
    return {
      lat: 12.8452,
      lng: 77.6602,
      address: 'Electronic City Phase 1, Near Infosys Gate 3, Bengaluru, Karnataka 560100',
      area: 'Electronic City',
    };
  });
  const [isLocating, setIsLocating] = useState(false);
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>(() => {
    return getNearbyEmergencyServices(12.8452, 77.6602, 'Electronic City');
  });

  // Sync state across browser tabs for dual-screen hackathon demos
  useEffect(() => {
    try {
      localStorage.setItem('civic_ai_issues', JSON.stringify(issues));
    } catch (storageErr) {
      console.warn('Storage quota exceeded, storing lightweight representation:', storageErr);
      try {
        const lightweight = issues.map((i) => ({
          ...i,
          imageUrl: i.imageUrl && i.imageUrl.length > 30000 ? SAMPLE_IMAGES.potholeBefore : i.imageUrl,
        }));
        localStorage.setItem('civic_ai_issues', JSON.stringify(lightweight));
      } catch {
        // Fallback gracefully without breaking React lifecycle
      }
    }

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('civic_ai_sync_channel');
      channel.postMessage({ type: 'SYNC_ISSUES', issues, activeIssueId });

      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ISSUES' && event.data.issues) {
          setIssues(event.data.issues);
          if (event.data.activeIssueId) setActiveIssueId(event.data.activeIssueId);
        }
      };
    } catch {
      // BroadcastChannel unsupported in some environments
    }

    return () => {
      channel?.close();
    };
  }, [issues, activeIssueId]);

  // Recalculate priority scores dynamically based on weights
  const calculatePriority = (issue: CivicIssue, weights: PriorityWeights): number => {
    const sevPart = (issue.severityScore || 70) * (weights.severity || 0.35);
    // Normalize duplicates: 1 duplicate = 30, 5 duplicates = 100
    const dupNormalized = Math.min(100, Math.max(20, (issue.duplicateCount || 1) * 20));
    const dupPart = dupNormalized * (weights.duplicates || 0.25);
    
    // Location importance: Arterials & Metro corridor = 90-95
    const loc = (issue.locationName || '').toLowerCase();
    const locImportance = loc.includes('arterial') || loc.includes('metro') || loc.includes('electronic city') ? 92 : 75;
    const locPart = locImportance * (weights.locationImportance || 0.20);
    
    // Public impact score
    const impactScore = issue.severity === 'Critical' ? 95 : issue.severity === 'High' ? 85 : 60;
    const impactPart = impactScore * (weights.publicImpact || 0.20);

    return Number((sevPart + dupPart + locPart + impactPart).toFixed(1));
  };

  // Re-score issues when weights change
  useEffect(() => {
    setIssues((prev) =>
      prev.map((issue) => ({
        ...issue,
        priorityScore: calculatePriority(issue, priorityWeights),
      }))
    );
  }, [priorityWeights]);

  const activeIssue = issues.find((i) => i.id === activeIssueId) || issues[0];

  // Dynamic base stats (with mock offsets for realistic national civic scale)
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;
  const highPriorityCount = issues.filter((i) => i.severity === 'Critical' || i.severity === 'High').length;
  const totalIssues = 1284 + (issues.length - INITIAL_ISSUES.length);
  const aiVerified = 936 + (issues.length - INITIAL_ISSUES.length);
  const resolved = 817 + (resolvedCount - 1);
  const highPriority = 142 + (highPriorityCount - 2);

  const playUiSound = (type: 'beep' | 'success' | 'alert' | 'scan') => {
    if (type === 'beep') {
      playTone(880, 0.08, 'sine');
    } else if (type === 'success') {
      playTone(523.25, 0.1, 'triangle');
      setTimeout(() => playTone(659.25, 0.1, 'triangle'), 100);
      setTimeout(() => playTone(783.99, 0.2, 'triangle'), 200);
    } else if (type === 'alert') {
      playTone(440, 0.15, 'sawtooth');
      setTimeout(() => playTone(330, 0.2, 'sawtooth'), 150);
    } else if (type === 'scan') {
      playTone(1200, 0.05, 'sine');
      setTimeout(() => playTone(1500, 0.05, 'sine'), 60);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#38bdf8', '#fbbf24', '#ffffff']
    });
  };

  const addNewIssue = (newIssue: CivicIssue) => {
    const scoredIssue = {
      ...newIssue,
      priorityScore: calculatePriority(newIssue, priorityWeights),
    };
    setIssues((prev) => [scoredIssue, ...prev]);
    setActiveIssueId(scoredIssue.id);
    playUiSound('success');
  };

  const updateIssueStatus = (id: string, newStatus: Status, note?: string) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const newHistory = [
          ...item.history.map((h) => ({ ...h, current: false })),
          {
            status: newStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: note || `Status transitioned to ${newStatus}`,
            actor: 'BBMP Municipal Officer',
            completed: true,
            current: true,
          },
        ];

        return {
          ...item,
          status: newStatus,
          history: newHistory,
        };
      })
    );
    playUiSound('beep');
  };

  const submitResolutionVerification = (id: string, verification: VerificationData) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          status: 'Resolution Pending',
          verification: {
            ...verification,
            citizenConfirmed: null
          },
          history: [
            ...item.history.map((h) => ({ ...h, current: false })),
            {
              status: 'Resolution Pending',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Field contractor uploaded repair photo. AI verified ${verification.clearanceScore}% clearance.`,
              actor: 'AI Vision QA Inspector',
              completed: true,
              current: true,
            }
          ]
        };
      })
    );
    playUiSound('success');
  };

  const confirmCitizenResolution = (id: string, confirmed: boolean) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedStatus: Status = confirmed ? 'Resolved' : 'In Progress';
        return {
          ...item,
          status: updatedStatus,
          verification: item.verification
            ? { ...item.verification, citizenConfirmed: confirmed }
            : undefined,
          history: [
            ...item.history.map((h) => ({ ...h, current: false })),
            {
              status: updatedStatus,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: confirmed
                ? 'Citizen confirmed satisfactory resolution! Ticket closed.'
                : 'Citizen flagged defect persists. Ticket reopened with High Priority urgency.',
              actor: 'Citizen Verified',
              completed: true,
              current: true,
            }
          ]
        };
      })
    );

    if (confirmed) {
      triggerCelebration();
      playUiSound('success');
    } else {
      playUiSound('alert');
    }
  };

  const resolveIssueWithProof = (
    id: string,
    params: {
      afterImageUrl: string;
      beforeImageUrl?: string;
      notes: string;
      clearanceScore?: number;
      aiVerdict?: string;
    }
  ) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const clearance = params.clearanceScore || 98.4;
        const verdict = params.aiVerdict || `Resolution verified: Physical restoration completed. Clearance level within ${clearance}% municipal standard.`;

        const verificationData: VerificationData = {
          afterImageUrl: params.afterImageUrl,
          clearanceScore: clearance,
          defectDetected: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenConfirmed: true,
          aiVerdict: verdict,
          notes: params.notes || 'Field repair completed and verified by Municipal Officer.'
        };

        const newHistory = [
          ...item.history.map((h) => ({ ...h, current: false })),
          {
            status: 'Resolved' as Status,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: `Resolved by Municipal Admin with verified Before & After evidence. ${params.notes}`,
            actor: 'BBMP Municipal Officer',
            completed: true,
            current: true,
          },
        ];

        return {
          ...item,
          imageUrl: params.beforeImageUrl || item.imageUrl,
          status: 'Resolved' as Status,
          verification: verificationData,
          history: newHistory,
        };
      })
    );
    triggerCelebration();
    playUiSound('success');
  };

  const resetToDemoDefaults = () => {
    localStorage.removeItem('civic_ai_issues');
    setIssues(INITIAL_ISSUES);
    setActiveIssueId('CA1024');
    setPriorityWeights(DEFAULT_WEIGHTS);
    setGuidedStep(0);
    playUiSound('beep');
  };

  // Location Auto-detection with Reverse Geocoding & Emergency Lookup
  const detectLocationAndEmergencies = async () => {
    setIsLocating(true);
    playUiSound('scan');

    const updateLocationData = (lat: number, lng: number, address: string, area: string) => {
      const locObj = { lat, lng, address, area };
      setDetectedLocation(locObj);
      const services = getNearbyEmergencyServices(lat, lng, `${area} ${address}`);
      setEmergencyServices(services);
      setIsLocating(false);
      playUiSound('success');
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              { headers: { 'Accept': 'application/json' } }
            );
            if (res.ok) {
              const data = await res.json();
              const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.residential || data.address?.road || 'Local Ward';
              const city = data.address?.city || data.address?.town || data.address?.county || 'Bengaluru';
              const fullAddr = data.display_name || `${suburb}, ${city}`;
              updateLocationData(lat, lng, fullAddr, suburb);
              return;
            }
          } catch {
            // Geocoding error fallback
          }
          updateLocationData(
            lat,
            lng,
            `Verified Coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E (Auto-detected GPS)`,
            'Local Ward'
          );
        },
        (error) => {
          console.warn('Browser geolocation note:', error.message);
          updateLocationData(
            12.8452,
            77.6602,
            'Electronic City Phase 1, Hosur Road Corridor, Bengaluru (Ward 192)',
            'Electronic City'
          );
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      updateLocationData(
        12.8452,
        77.6602,
        'Electronic City Phase 1, Hosur Road Corridor, Bengaluru (Ward 192)',
        'Electronic City'
      );
    }
  };

  const setCustomLocation = (address: string, lat: number = 12.8452, lng: number = 77.6602) => {
    const area = address.split(',')[0] || 'Selected Ward';
    setDetectedLocation({ lat, lng, address, area });
    setEmergencyServices(getNearbyEmergencyServices(lat, lng, address));
  };

  // User Authentication Methods
  const login = (email: string, password: string, explicitRole?: 'citizen' | 'officer' | 'admin'): boolean => {
    const defaultCitizen: UserProfile = {
      id: 'usr-101',
      name: 'Priya Sharma',
      email: 'priya@citizen.in',
      phone: '+91 98450 12345',
      ward: 'Ward 192 - Begur / Electronic City',
      role: 'citizen',
      createdAt: '2026-01-15',
    };

    const defaultAdmin: UserProfile = {
      id: 'usr-901',
      name: 'Rajesh Kumar (BBMP Commissioner)',
      email: 'commissioner@bbmp.gov.in',
      phone: '+91 98450 99999',
      ward: 'Central City Command - BBMP Head Office',
      role: 'admin',
      createdAt: '2025-06-10',
    };

    let user: UserProfile;
    if (explicitRole === 'admin' || explicitRole === 'officer' || email.toLowerCase().includes('admin') || email.toLowerCase().includes('commissioner') || email.toLowerCase().includes('officer') || email.toLowerCase().includes('bbmp')) {
      user = {
        ...defaultAdmin,
        role: explicitRole || 'admin',
        email: email || defaultAdmin.email,
        name: email.toLowerCase().includes('engineer') ? 'Suresh Patil (Ward 192 Chief Engineer)' : defaultAdmin.name,
      };
    } else if (email.toLowerCase().includes('priya')) {
      user = defaultCitizen;
    } else {
      user = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        phone: '+91 98450 00000',
        ward: 'Ward 192 - Begur / Electronic City',
        role: explicitRole || 'citizen',
        createdAt: new Date().toISOString().split('T')[0],
      };
    }

    setCurrentUser(user);
    localStorage.setItem('civic_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    playUiSound('success');

    // Automatically navigate to Admin command console if admin/officer, else citizen view
    if (user.role === 'admin' || user.role === 'officer') {
      setActiveTab('admin');
    } else {
      setActiveTab('citizen');
    }

    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }
    return true;
  };

  const signup = (userData: Omit<UserProfile, 'id' | 'createdAt'> & { password?: string }): boolean => {
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      ward: userData.ward,
      role: userData.role || 'citizen',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(newUser);
    localStorage.setItem('civic_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    playUiSound('success');

    if (newUser.role === 'admin' || newUser.role === 'officer') {
      setActiveTab('admin');
    } else {
      setActiveTab('citizen');
    }

    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('civic_user');
    playUiSound('beep');
  };

  const requireAuth = (callback: () => void): boolean => {
    if (currentUser) {
      callback();
      return true;
    }
    setPendingAuthAction(() => callback);
    setIsAuthModalOpen(true);
    playUiSound('alert');
    return false;
  };

  return (
    <CivicContext.Provider
      value={{
        issues,
        activeIssueId,
        setActiveIssueId,
        activeIssue,
        activeTab,
        setActiveTab,
        priorityWeights,
        setPriorityWeights,
        stats: {
          totalIssues,
          aiVerified,
          highPriority,
          resolved,
        },
        analysisModalOpen,
        setAnalysisModalOpen,
        stagedReport,
        setStagedReport,
        addNewIssue,
        updateIssueStatus,
        submitResolutionVerification,
        confirmCitizenResolution,
        playUiSound,
        triggerCelebration,
        guidedStep,
        setGuidedStep,
        guidedModeActive,
        setGuidedModeActive,
        resetToDemoDefaults,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authInitialPortal,
        openAuthModal,
        login,
        signup,
        logout,
        requireAuth,
        detectedLocation,
        isLocating,
        emergencyServices,
        detectLocationAndEmergencies,
        setCustomLocation,
        adminViewMode,
        setAdminViewMode,
        resolveIssueWithProof,
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
