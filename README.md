# CivicAI - Smart Public Issue Resolution

**Hackathon 2026 · Bengaluru Smart City Challenge**

An AI-powered civic platform that connects citizens, field officers, and administrators to report, prioritize, track, and verify resolution of public infrastructure issues in Bengaluru.

---

## Live Demo

**[civicai-neon.vercel.app](https://civicai-neon.vercel.app)**

---

## Team

| Member | Role |
|--------|------|
| **Panchaksharayya** | Full-Stack & AI Integration |
| **Rashmi** | UI/UX & Frontend Development |

---

## Features

- **AI Defect Scanner** - Visor-HUD interface with real-time image analysis and severity detection
- **Smart Location Picker** - 35+ Bengaluru areas with zone filters, GPS auto-locate, autocomplete
- **Priority Engine** - Weighted scoring: severity x duplicates x location x public impact
- **Admin Dashboard** - Complaints Queue + Interactive Leaflet Map with separate sections
- **Role-Based Auth** - Citizen, Field Officer, Admin portals
- **Before/After Proof** - Side-by-side comparison, clearance quality score, citizen confirmation
- **CivicBot AI** - In-app assistant for complaints and navigation
- **Guided Demo Mode** - Auto-advancing walkthrough for presentations

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS |
| **Maps** | React Leaflet, OpenStreetMap |
| **AI** | Google Gemini Vision API |
| **Backend** | FastAPI (Python) |
| **Deploy** | Vercel |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/panchaksharayya12/civicai.git
cd civicai

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

---

## Demo Scenarios

| Issue | Location | Severity | Resolution Time |
|-------|----------|----------|-----------------|
| Pothole | Koramangala 4th Block | CRITICAL | 2.1 days |
| Garbage Pile | Whitefield Main Road | HIGH | 1.4 days |
| Street Light | Indiranagar 100ft Rd | MEDIUM | 3.8 days |
| Waterlogging | Silk Board Junction | CRITICAL | 4.2 days |

---

## Project Structure

```
civicai/
├── src/
│   ├── components/           # React components
│   │   ├── CitizenHome.tsx   # Main citizen portal
│   │   ├── AdminDashboard.tsx # Admin control centre
│   │   ├── LiveTracking.tsx  # Issue tracking & before/after
│   │   ├── CivicBot.tsx      # AI chatbot
│   │   └── ...
│   ├── context/
│   │   └── CivicContext.tsx  # Global state management
│   ├── data/
│   │   └── mockData.ts       # Bengaluru locations & sample data
│   └── types.ts              # TypeScript interfaces
├── public/images/            # Before/After civic defect photos
├── backend/                  # FastAPI Python backend
└── CivicAI_Hackathon_Presentation.pptx  # 12-slide pitch deck
```

---

## Presentation

The 12-slide hackathon pitch deck is included in the repo: [CivicAI_Hackathon_Presentation.pptx](./CivicAI_Hackathon_Presentation.pptx)

---

## License

MIT (c) 2026 Panchaksharayya & Rashmi
