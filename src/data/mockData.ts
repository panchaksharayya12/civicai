import { CivicIssue, Department } from '../types';

// High-fidelity local & offline images so the app works 100% reliably
export const SAMPLE_IMAGES = {
  potholeBefore: '/images/pothole_before.jpg',
  potholeAfter: '/images/pothole_after.jpg',
  manholeBefore: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
  manholeAfter: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
  garbageBefore: '/images/garbage_before.jpg',
  garbageAfter: '/images/garbage_after.jpg',
  streetlightBefore: '/images/streetlight_before.jpg',
  streetlightAfter: '/images/streetlight_after.jpg',
};

// Offline SVG Fallbacks in case external network is blocked
export const OFFLINE_SVG_POTHOLE_BEFORE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23334155"/><path d="M100 250 Q250 180 400 240 T700 230 L750 380 Q500 420 250 390 Z" fill="%231e293b"/><ellipse cx="380" cy="290" rx="140" ry="70" fill="%230f172a"/><path d="M300 280 Q380 320 460 270 Q410 330 320 310 Z" fill="%23020617"/><text x="40" y="60" fill="%23f87171" font-size="28" font-family="sans-serif" font-weight="bold">DEFECT DETECTED: SEVERE ROAD POTHOLE</text><text x="40" y="95" fill="%23cbd5e1" font-size="18" font-family="sans-serif">Depth: 12cm | Surface: Cracked Bitumen | Electronic City Ph 1</text></svg>`;

export const OFFLINE_SVG_POTHOLE_AFTER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%231e293b"/><line x1="0" y1="250" x2="800" y2="250" stroke="%23fbbf24" stroke-width="8" stroke-dasharray="30 20"/><rect x="220" y="200" width="340" height="150" rx="12" fill="%230f172a" stroke="%2310b981" stroke-width="3"/><text x="40" y="60" fill="%2334d399" font-size="28" font-family="sans-serif" font-weight="bold">AI VERIFIED RESOLVED: FRESH ASPHALT OVERLAY</text><text x="40" y="95" fill="%23cbd5e1" font-size="18" font-family="sans-serif">Leveling: 98.4% | Clearance: PASSED | Timestamp: Completed</text></svg>`;

export const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: 'CA1024',
    title: 'Severe Road Crater & Pothole on Main Arterial',
    description: 'Deep pothole causing sudden braking and two-wheeler skidding near tech park junction.',
    category: 'Road Pothole',
    severity: 'High',
    severityScore: 88,
    locationName: 'Electronic City Phase 1, Near Infosys Gate 3, Bengaluru',
    coordinates: [12.8452, 77.6602],
    potentialImpact: 'High risk of vehicular accidents, severe peak-hour traffic bottleneck & vehicle suspension damage.',
    duplicateCount: 3,
    duplicateDistanceMeters: 110,
    department: 'Municipal Roads',
    status: 'In Progress',
    imageUrl: SAMPLE_IMAGES.potholeBefore,
    confidence: 96.4,
    createdAt: '2026-09-22 09:14 AM',
    slaHours: 24,
    assignedCrew: 'Rapid Road Repair Unit #14',
    priorityScore: 92.5,
    reporterName: 'Ananya Sharma',
    source: 'User Portal',
    isUserSubmitted: true,
    verification: {
      afterImageUrl: SAMPLE_IMAGES.potholeAfter,
      clearanceScore: 98.2,
      defectDetected: false,
      timestamp: '2026-09-22 12:45 PM',
      citizenConfirmed: null,
      aiVerdict: 'Clearance verified: Defect filled with hot-mix asphalt and compacted. Surface level within 98.2% tolerance.',
      notes: 'Road surface restored to standard municipal grade. Lane striping refreshed.'
    },
    history: [
      {
        status: 'Report Submitted',
        timestamp: '09:14 AM',
        note: 'Citizen uploaded geo-tagged photo with voice description via Mobile Web.',
        actor: 'Citizen (Ananya Sharma)',
        completed: true,
        current: false
      },
      {
        status: 'AI Verified',
        timestamp: '09:15 AM',
        note: 'Computer Vision classified "Severe Road Pothole" (96.4% confidence). Detected 3 nearby duplicate reports.',
        actor: 'CivicAI Neural Engine',
        completed: true,
        current: false
      },
      {
        status: 'Department Assigned',
        timestamp: '09:18 AM',
        note: 'Auto-routed to BBMP Municipal Roads & Infrastructure. High Priority queue slot #1.',
        actor: 'System Dispatcher',
        completed: true,
        current: false
      },
      {
        status: 'In Progress',
        timestamp: '10:30 AM',
        note: 'Crew #14 dispatched with bituminous cold/hot patch asphalt mixture.',
        actor: 'Engineer R. Kumar (BBMP Roads)',
        completed: true,
        current: true
      },
      {
        status: 'Resolved',
        timestamp: 'Pending',
        note: 'Awaiting completion of field repair and Before/After AI photo verification.',
        actor: 'Quality Assurance Unit',
        completed: false,
        current: false
      }
    ]
  },
  {
    id: 'CA1019',
    title: 'Hazardous Uncovered Drainage Manhole',
    description: 'Broken cement slab leaving 4ft deep storm water drain completely exposed on walkway.',
    category: 'Open Manhole',
    severity: 'Critical',
    severityScore: 98,
    locationName: 'Indiranagar 100ft Road, Near Metro Pillar 84, Bengaluru',
    coordinates: [12.9784, 77.6408],
    potentialImpact: 'Extremely critical fall hazard for pedestrians, children, and nighttime commuters.',
    duplicateCount: 5,
    duplicateDistanceMeters: 45,
    department: 'Water & Sewerage',
    status: 'Department Assigned',
    imageUrl: SAMPLE_IMAGES.manholeBefore,
    confidence: 99.1,
    createdAt: '2026-09-22 08:30 AM',
    slaHours: 12,
    assignedCrew: 'Emergency Drainage Taskforce #03',
    priorityScore: 97.8,
    reporterName: 'Vikram Mehta',
    history: [
      {
        status: 'Report Submitted',
        timestamp: '08:30 AM',
        note: 'Pedestrian reported high-risk open sewer cover.',
        actor: 'Citizen (Vikram Mehta)',
        completed: true,
        current: false
      },
      {
        status: 'AI Verified',
        timestamp: '08:31 AM',
        note: 'Classified: Critical Manhole Defect. Alert escalated to Level 1 Emergency.',
        actor: 'CivicAI Neural Engine',
        completed: true,
        current: false
      },
      {
        status: 'Department Assigned',
        timestamp: '08:33 AM',
        note: 'Auto-assigned to BWSSB Water & Sewerage rapid team.',
        actor: 'System Dispatcher',
        completed: true,
        current: true
      },
      {
        status: 'In Progress',
        timestamp: 'Pending',
        note: 'Crew moving to site with replacement ductile iron frame.',
        actor: 'BWSSB Central Depot',
        completed: false,
        current: false
      },
      {
        status: 'Resolved',
        timestamp: 'Pending',
        note: 'Awaiting site closure and photo verification.',
        actor: 'BWSSB Quality Wing',
        completed: false,
        current: false
      }
    ]
  },
  {
    id: 'CA1015',
    title: 'Overflowing Solid Waste Blackspot',
    description: 'Unregulated commercial waste dump blocking sidewalk and attracting stray animals.',
    category: 'Garbage Dump',
    severity: 'Medium',
    severityScore: 65,
    locationName: 'Koramangala 4th Block, 80ft Road, Bengaluru',
    coordinates: [12.9345, 77.6265],
    potentialImpact: 'Public health sanitation hazard, foul odor, pedestrian forced onto active vehicular road.',
    duplicateCount: 2,
    duplicateDistanceMeters: 80,
    department: 'Solid Waste Management',
    status: 'Resolved',
    imageUrl: SAMPLE_IMAGES.garbageBefore,
    confidence: 94.7,
    createdAt: '2026-09-21 02:15 PM',
    slaHours: 24,
    assignedCrew: 'Sanitation Compactor Truck #22',
    priorityScore: 71.2,
    reporterName: 'Pooja Hegde',
    verification: {
      afterImageUrl: SAMPLE_IMAGES.garbageAfter,
      clearanceScore: 99.0,
      defectDetected: false,
      timestamp: '2026-09-21 06:40 PM',
      citizenConfirmed: true,
      aiVerdict: 'Site cleared completely: 0% residual debris detected on pedestrian corridor.',
      notes: 'Cleared 1.8 tons of mixed waste. Disinfected with lime powder.'
    },
    history: [
      {
        status: 'Report Submitted',
        timestamp: 'Yesterday 02:15 PM',
        note: 'Issue logged via CivicAI citizen portal.',
        actor: 'Citizen (Pooja Hegde)',
        completed: true,
        current: false
      },
      {
        status: 'AI Verified',
        timestamp: 'Yesterday 02:16 PM',
        note: 'Computer Vision classified commercial waste blackspot.',
        actor: 'CivicAI Neural Engine',
        completed: true,
        current: false
      },
      {
        status: 'Department Assigned',
        timestamp: 'Yesterday 02:20 PM',
        note: 'Assigned to Ward 151 Solid Waste Management.',
        actor: 'System Dispatcher',
        completed: true,
        current: false
      },
      {
        status: 'In Progress',
        timestamp: 'Yesterday 04:00 PM',
        note: 'Hydraulic compactor and 4 sanitation workers deployed.',
        actor: 'BBMP Health Inspector',
        completed: true,
        current: false
      },
      {
        status: 'Resolved',
        timestamp: 'Yesterday 06:40 PM',
        note: 'Clean-up completed and confirmed by reporting citizen.',
        actor: 'Citizen Verified (Pooja Hegde)',
        completed: true,
        current: true
      }
    ]
  },
  {
    id: 'CA1012',
    title: 'Streetlight Pole Broken / Blackout',
    description: 'Electrical pole fixture damaged following heavy winds, leaving 200m stretch dark.',
    category: 'Broken Streetlight',
    severity: 'Medium',
    severityScore: 58,
    locationName: 'Whitefield Inner Circle, Near Hope Farm, Bengaluru',
    coordinates: [12.9698, 77.7499],
    potentialImpact: 'Nighttime blind spot, increased danger for evening pedestrians & cyclist navigation.',
    duplicateCount: 1,
    duplicateDistanceMeters: 60,
    department: 'Electricity & Lighting',
    status: 'In Progress',
    imageUrl: SAMPLE_IMAGES.streetlightBefore,
    confidence: 91.8,
    createdAt: '2026-09-21 08:45 PM',
    slaHours: 48,
    assignedCrew: 'BESCOM Street Lighting Mobile Van #07',
    priorityScore: 62.4,
    reporterName: 'Karthik Rao',
    history: [
      {
        status: 'Report Submitted',
        timestamp: 'Yesterday 08:45 PM',
        note: 'Resident flagged dark street segment.',
        actor: 'Citizen (Karthik Rao)',
        completed: true,
        current: false
      },
      {
        status: 'AI Verified',
        timestamp: 'Yesterday 08:46 PM',
        note: 'Luminance analysis confirmed blackout condition.',
        actor: 'CivicAI Neural Engine',
        completed: true,
        current: false
      },
      {
        status: 'Department Assigned',
        timestamp: 'Yesterday 08:50 PM',
        note: 'Routed to BESCOM Area Lighting maintenance.',
        actor: 'System Dispatcher',
        completed: true,
        current: false
      },
      {
        status: 'In Progress',
        timestamp: 'Today 11:00 AM',
        note: 'Linemen replacing blown LED ballast and circuit breaker.',
        actor: 'BESCOM Line Inspector',
        completed: true,
        current: true
      },
      {
        status: 'Resolved',
        timestamp: 'Pending',
        note: 'Awaiting night lux verification test.',
        actor: 'BESCOM Lighting Desk',
        completed: false,
        current: false
      }
    ]
  }
];

export const DEMO_PRESETS = [
  {
    label: 'Road Pothole (High Priority)',
    category: 'Road Pothole' as const,
    location: 'Electronic City Phase 1, Bengaluru',
    coordinates: [12.8452, 77.6602] as [number, number],
    image: SAMPLE_IMAGES.potholeBefore,
    afterImage: SAMPLE_IMAGES.potholeAfter,
    description: 'Deep road crater in middle lane causing severe traffic deceleration and accident risk.',
    severity: 'High' as const,
    severityScore: 88,
    impact: 'Traffic bottleneck & vehicle suspension safety',
    duplicateCount: 3,
    department: 'Municipal Roads' as Department,
    confidence: 96.4
  },
  {
    label: 'Overflowing Waste Dump (Medium)',
    category: 'Garbage Dump' as const,
    location: 'Koramangala 4th Block, Bengaluru',
    coordinates: [12.9345, 77.6265] as [number, number],
    image: SAMPLE_IMAGES.garbageBefore,
    afterImage: SAMPLE_IMAGES.garbageAfter,
    description: 'Garbage accumulation overflowing onto road causing hygiene and vehicular obstruction.',
    severity: 'Medium' as const,
    severityScore: 68,
    impact: 'Public sanitation, disease vector, and odor issue',
    duplicateCount: 2,
    department: 'Solid Waste Management' as Department,
    confidence: 95.0
  },
  {
    label: 'Broken Streetlight (Medium)',
    category: 'Broken Streetlight' as const,
    location: 'Whitefield Inner Circle, Bengaluru',
    coordinates: [12.9698, 77.7499] as [number, number],
    image: SAMPLE_IMAGES.streetlightBefore,
    afterImage: SAMPLE_IMAGES.streetlightAfter,
    description: 'Damaged lighting mast fixture causing total dark zone at junction.',
    severity: 'Medium' as const,
    severityScore: 58,
    impact: 'Pedestrian security & night navigation hazard',
    duplicateCount: 1,
    department: 'Electricity & Lighting' as Department,
    confidence: 92.5
  }
];

export interface SuggestedArea {
  name: string;
  address: string;
  zone: string;
  ward: string;
  lat: number;
  lng: number;
  tag: 'Whole City' | 'Tech Hub' | 'Commercial' | 'Residential' | 'Transit' | 'Central';
}

export const SUGGESTED_AREAS: SuggestedArea[] = [
  {
    name: 'Whole Bengaluru (All Zones)',
    address: 'Bengaluru Urban, Karnataka, India (BBMP Central Command)',
    zone: 'BBMP Central Command',
    ward: 'All 198 Wards (Whole Bengaluru)',
    lat: 12.9716,
    lng: 77.5946,
    tag: 'Whole City',
  },
  // CENTRAL BENGALURU
  {
    name: 'MG Road / Brigade Road',
    address: 'MG Road, Near Trinity Metro Station & Brigade Rd, Bengaluru',
    zone: 'Central Zone',
    ward: 'Ward 111 (Shanthi Nagar)',
    lat: 12.9733,
    lng: 77.6200,
    tag: 'Central',
  },
  {
    name: 'Majestic / Kempegowda Bus Station',
    address: 'Kempegowda Bus Station & Metro Interchange, Majestic, Bengaluru',
    zone: 'Central Zone',
    ward: 'Ward 120 (Cottonpet / Majestic)',
    lat: 12.9767,
    lng: 77.5713,
    tag: 'Transit',
  },
  {
    name: 'Shivajinagar / Commercial Street',
    address: 'Commercial Street & Russell Market, Shivajinagar, Bengaluru',
    zone: 'Central Zone',
    ward: 'Ward 92 (Shivajinagar)',
    lat: 12.9822,
    lng: 77.6083,
    tag: 'Commercial',
  },
  {
    name: 'Basavanagudi (Gandhi Bazaar)',
    address: 'Gandhi Bazaar Main Road, Basavanagudi, Bengaluru',
    zone: 'South Zone',
    ward: 'Ward 154 (Basavanagudi)',
    lat: 12.9422,
    lng: 77.5753,
    tag: 'Commercial',
  },

  // SOUTH BENGALURU
  {
    name: 'Koramangala 4th Block',
    address: 'Koramangala 4th Block, 80 Feet Road, Bengaluru',
    zone: 'South Zone',
    ward: 'Ward 151 (Koramangala)',
    lat: 12.9345,
    lng: 77.6265,
    tag: 'Commercial',
  },
  {
    name: 'Jayanagar 4th Block',
    address: 'Jayanagar 4th Block, Near Shopping Complex & Metro, Bengaluru',
    zone: 'South Zone',
    ward: 'Ward 153 (Jayanagar)',
    lat: 12.9298,
    lng: 77.5833,
    tag: 'Commercial',
  },
  {
    name: 'JP Nagar 2nd Phase',
    address: 'JP Nagar 2nd Phase, Near 24th Main Road, Bengaluru',
    zone: 'South Zone',
    ward: 'Ward 177 (JP Nagar)',
    lat: 12.9090,
    lng: 77.5898,
    tag: 'Residential',
  },
  {
    name: 'BTM Layout 2nd Stage',
    address: 'BTM Layout 2nd Stage, Near Udupi Garden Signal, Bengaluru',
    zone: 'South Zone',
    ward: 'Ward 176 (BTM Layout)',
    lat: 12.9166,
    lng: 77.6101,
    tag: 'Residential',
  },
  {
    name: 'Banashankari 2nd Stage',
    address: 'Banashankari 2nd Stage, Near BDA Complex & Bus Stand, Bengaluru',
    zone: 'South Zone',
    ward: 'Ward 166 (Banashankari)',
    lat: 12.9255,
    lng: 77.5658,
    tag: 'Residential',
  },

  // BOMMANAHALLI & TECH CORRIDORS
  {
    name: 'Electronic City Phase 1',
    address: 'Electronic City Phase 1, Near Infosys Gate 3, Bengaluru',
    zone: 'Bommanahalli Zone',
    ward: 'Ward 192 (Begur / Electronic City)',
    lat: 12.8452,
    lng: 77.6602,
    tag: 'Tech Hub',
  },
  {
    name: 'Electronic City Phase 2',
    address: 'Electronic City Phase 2, Near Tech Mahindra & TCS, Bengaluru',
    zone: 'Bommanahalli Zone',
    ward: 'Ward 193 (Electronic City Ph 2)',
    lat: 12.8398,
    lng: 77.6789,
    tag: 'Tech Hub',
  },
  {
    name: 'HSR Layout Sector 2',
    address: 'HSR Layout Sector 2, 27th Main Road, Bengaluru',
    zone: 'Bommanahalli Zone',
    ward: 'Ward 174 (HSR Layout)',
    lat: 12.9116,
    lng: 77.6474,
    tag: 'Residential',
  },
  {
    name: 'Bannerghatta Road (IIM-B)',
    address: 'Bannerghatta Road, Near IIM Bangalore Campus, Bengaluru',
    zone: 'Bommanahalli Zone',
    ward: 'Ward 193 (Arakere)',
    lat: 12.8953,
    lng: 77.5989,
    tag: 'Tech Hub',
  },

  // MAHADEVAPURA & EAST
  {
    name: 'Indiranagar 100ft Road',
    address: 'Indiranagar 100ft Road, Near Metro Pillar 84, Bengaluru',
    zone: 'East Zone',
    ward: 'Ward 89 (Indiranagar)',
    lat: 12.9784,
    lng: 77.6408,
    tag: 'Commercial',
  },
  {
    name: 'Whitefield ITPL Main Road',
    address: 'Whitefield ITPL Main Road, Near Hope Farm Junction, Bengaluru',
    zone: 'Mahadevapura Zone',
    ward: 'Ward 84 (Whitefield)',
    lat: 12.9698,
    lng: 77.7499,
    tag: 'Tech Hub',
  },
  {
    name: 'Marathahalli Bridge (ORR)',
    address: 'Marathahalli Bridge, Outer Ring Road Junction, Bengaluru',
    zone: 'Mahadevapura Zone',
    ward: 'Ward 85 (Doddanekkundi)',
    lat: 12.9569,
    lng: 77.7011,
    tag: 'Transit',
  },
  {
    name: 'Bellandur Outer Ring Road',
    address: 'Bellandur Outer Ring Road, Near Ecospace Tech Park, Bengaluru',
    zone: 'Mahadevapura Zone',
    ward: 'Ward 150 (Bellandur)',
    lat: 12.9260,
    lng: 77.6762,
    tag: 'Tech Hub',
  },
  {
    name: 'Sarjapur Road / Kaikondrahalli',
    address: 'Sarjapur Main Road, Near Wipro Corporate Office, Bengaluru',
    zone: 'Mahadevapura Zone',
    ward: 'Ward 150 (Bellandur / Sarjapur)',
    lat: 12.9121,
    lng: 77.6788,
    tag: 'Tech Hub',
  },
  {
    name: 'KR Puram / Tin Factory',
    address: 'KR Puram Hanging Bridge & Tin Factory Junction, Bengaluru',
    zone: 'Mahadevapura Zone',
    ward: 'Ward 52 (KR Puram)',
    lat: 12.9982,
    lng: 77.6778,
    tag: 'Transit',
  },

  // NORTH BENGALURU & YELAHANKA
  {
    name: 'Hebbal Flyover Junction',
    address: 'Hebbal Flyover Junction, Bellary Road, Bengaluru',
    zone: 'Yelahanka Zone',
    ward: 'Ward 7 (Byatarayanapura)',
    lat: 13.0358,
    lng: 77.5970,
    tag: 'Transit',
  },
  {
    name: 'Yelahanka New Town',
    address: 'Yelahanka New Town 4th Phase, Major Sandeep Unnikrishnan Rd, Bengaluru',
    zone: 'Yelahanka Zone',
    ward: 'Ward 4 (Yelahanka Satellite Town)',
    lat: 13.0998,
    lng: 77.5963,
    tag: 'Residential',
  },
  {
    name: 'Manyata Tech Park (Nagavara)',
    address: 'Manyata Embassy Business Park, Outer Ring Road, Bengaluru',
    zone: 'East Zone',
    ward: 'Ward 23 (Nagavara)',
    lat: 13.0475,
    lng: 77.6200,
    tag: 'Tech Hub',
  },
  {
    name: 'Sahakar Nagar / Judicial Layout',
    address: 'Sahakar Nagar Main Road, Near 60ft Road, Bengaluru',
    zone: 'Yelahanka Zone',
    ward: 'Ward 8 (Kodigehalli)',
    lat: 13.0624,
    lng: 77.5878,
    tag: 'Residential',
  },
  {
    name: 'Vidyaranyapura',
    address: 'Vidyaranyapura Main Road, Near BEL Circle, Bengaluru',
    zone: 'Yelahanka Zone',
    ward: 'Ward 9 (Vidyaranyapura)',
    lat: 13.0784,
    lng: 77.5583,
    tag: 'Residential',
  },
  {
    name: 'KIA Airport Road / Devanahalli',
    address: 'Kempegowda International Airport Toll Plaza, Bellary Highway, Bengaluru',
    zone: 'Yelahanka Zone',
    ward: 'Devanahalli Rural / Airport Corridor',
    lat: 13.1986,
    lng: 77.7066,
    tag: 'Transit',
  },

  // WEST BENGALURU
  {
    name: 'Malleshwaram 8th Cross',
    address: 'Malleshwaram 8th Cross, Sampige Road, Bengaluru',
    zone: 'West Zone',
    ward: 'Ward 65 (Malleshwaram)',
    lat: 13.0031,
    lng: 77.5701,
    tag: 'Commercial',
  },
  {
    name: 'Rajajinagar 1st Block (ISKCON)',
    address: 'Rajajinagar 1st Block, Near ISKCON Temple & Metro, Bengaluru',
    zone: 'West Zone',
    ward: 'Ward 10 (Rajajinagar)',
    lat: 13.0098,
    lng: 77.5511,
    tag: 'Residential',
  },
  {
    name: 'Vijayanagar / Chord Road',
    address: 'Vijayanagar Metro Station & Club Road, Bengaluru',
    zone: 'West Zone',
    ward: 'Ward 123 (Vijayanagar)',
    lat: 12.9698,
    lng: 77.5358,
    tag: 'Commercial',
  },
  {
    name: 'Yeshwanthpur Junction',
    address: 'Yeshwanthpur APMC Yard & Railway Station Road, Bengaluru',
    zone: 'West Zone',
    ward: 'Ward 37 (Yeshwanthpur)',
    lat: 13.0238,
    lng: 77.5510,
    tag: 'Transit',
  },
  {
    name: 'Peenya Industrial Area',
    address: 'Peenya 1st Stage, Near Metro Station & Outer Ring Rd, Bengaluru',
    zone: 'Dasarahalli Zone',
    ward: 'Ward 41 (Peenya Industrial Area)',
    lat: 13.0285,
    lng: 77.5197,
    tag: 'Tech Hub',
  },

  // RR NAGAR & SOUTH-WEST
  {
    name: 'Rajarajeshwari Nagar (RR Nagar)',
    address: 'Rajarajeshwari Nagar, Ideal Homes Township, 80ft Road, Bengaluru',
    zone: 'RR Nagar Zone',
    ward: 'Ward 160 (Rajarajeshwari Nagar)',
    lat: 12.9237,
    lng: 77.5186,
    tag: 'Residential',
  },
  {
    name: 'Kengeri Satellite Town',
    address: 'Kengeri Satellite Town, Near Metro Station & Mysore Road, Bengaluru',
    zone: 'RR Nagar Zone',
    ward: 'Ward 159 (Kengeri)',
    lat: 12.9156,
    lng: 77.4831,
    tag: 'Transit',
  }
];

