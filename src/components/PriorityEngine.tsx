import React from 'react';
import { 
  Sliders, 
  Sparkles, 
  ArrowUpDown, 
  Info,
  Flame
} from 'lucide-react';
import { useCivic } from '../context/CivicContext';
import { CivicIssue } from '../types';

export const PriorityEngine: React.FC = () => {
  const { 
    issues, 
    priorityWeights, 
    setPriorityWeights, 
    setActiveIssueId, 
    setActiveTab, 
    playUiSound 
  } = useCivic();

  const sortedIssues = [...issues].sort((a, b) => b.priorityScore - a.priorityScore);

  const handleSliderChange = (key: keyof typeof priorityWeights, val: number) => {
    setPriorityWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleInspectIssue = (issue: CivicIssue) => {
    setActiveIssueId(issue.id);
    setActiveTab('admin');
    playUiSound('beep');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-7">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span>Screen 5: Autonomous Priority Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display mb-3">
          Intelligent Risk Triage & Ranking
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Instead of authorities drowning in hundreds of unranked complaints, CivicAI calculates mathematical urgency and tells response crews exactly which issues require attention first.
        </p>
      </div>

      {/* Formula & Weight Calibration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Formula Card (7 cols) */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
              <Sliders className="w-4 h-4 text-sky-600" />
              Dynamic Priority Calculation Formula
            </h3>
            <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 font-semibold">
              Live Algorithmic Weights
            </span>
          </div>

          {/* Formula Display Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs sm:text-sm text-slate-700 overflow-x-auto shadow-inner">
            <div className="text-slate-400 text-xs mb-1 font-mono">// Mathematical Urgency Scoring</div>
            <span className="text-sky-700 font-bold">Priority Score</span> = 
            <span className="text-slate-900"> (Severity × {Math.round(priorityWeights.severity * 100)}%)</span> + 
            <span className="text-slate-700"> (Duplicates × {Math.round(priorityWeights.duplicates * 100)}%)</span> + 
            <span className="text-sky-600"> (Location Importance × {Math.round(priorityWeights.locationImportance * 100)}%)</span> + 
            <span className="text-sky-800"> (Public Impact × {Math.round(priorityWeights.publicImpact * 100)}%)</span>
          </div>

          {/* Interactive Weight Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">1. Defect Severity Weight</span>
                <span className="text-sky-600 font-mono font-bold">{Math.round(priorityWeights.severity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.60"
                step="0.05"
                value={priorityWeights.severity}
                onChange={(e) => handleSliderChange('severity', parseFloat(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">2. Duplicate Reports / Cluster Density</span>
                <span className="text-sky-600 font-mono font-bold">{Math.round(priorityWeights.duplicates * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={priorityWeights.duplicates}
                onChange={(e) => handleSliderChange('duplicates', parseFloat(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">3. Location Importance (Arterials, Hospitals, Metro)</span>
                <span className="text-sky-600 font-mono font-bold">{Math.round(priorityWeights.locationImportance * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.40"
                step="0.05"
                value={priorityWeights.locationImportance}
                onChange={(e) => handleSliderChange('locationImportance', parseFloat(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">4. Public Impact & Commuter Safety</span>
                <span className="text-sky-600 font-mono font-bold">{Math.round(priorityWeights.publicImpact * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.40"
                step="0.05"
                value={priorityWeights.publicImpact}
                onChange={(e) => handleSliderChange('publicImpact', parseFloat(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Explainability & Insights Card (5 cols) */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3 font-display">
              <Info className="w-4 h-4 text-sky-600" />
              Why This Solves Municipal Gridlock
            </h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-slate-900 block mb-1 font-mono">Eliminates FIFO Bottleneck:</strong>
                Traditional municipal helplines resolve tickets in the order they were filed. CivicAI immediately pushes life-threatening hazards (e.g. open manholes on arterial transit routes) to Rank #1.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-slate-900 block mb-1 font-mono">Duplicate Crowdsource Amplification:</strong>
                When 3 or 5 different citizens photograph the same road pothole near Infosys Gate, the AI recognizes the spatial cluster and boosts priority rather than creating 5 duplicate tickets.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-center justify-between">
            <span>Ranked dispatch active across all wards</span>
            <span className="font-mono font-bold text-sky-700">0.14s Cycle Time</span>
          </div>
        </div>

      </div>

      {/* Ranked Dispatch Queue Table */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
              <ArrowUpDown className="w-4 h-4 text-sky-600" />
              Real-time Municipal Dispatch Queue
            </h3>
            <p className="text-xs text-slate-500">Issues sorted by AI Priority Score. Click any item to inspect or dispatch.</p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Showing {sortedIssues.length} active incidents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold text-[11px] font-mono border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Rank</th>
                <th className="px-4 py-3.5">Ticket ID</th>
                <th className="px-4 py-3.5">Civic Issue</th>
                <th className="px-4 py-3.5">Location & Zone</th>
                <th className="px-4 py-3.5">Duplicates</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Priority Score</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedIssues.map((issue, idx) => {
                const isTop1 = idx === 0;
                return (
                  <tr 
                    key={issue.id}
                    className={`hover:bg-slate-50/80 transition ${
                      isTop1 ? 'bg-sky-50/40' : ''
                    }`}
                  >
                    <td className="px-5 py-4 font-mono font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          idx === 0 ? 'bg-sky-500 text-white font-black shadow-sm' :
                          idx === 1 ? 'bg-slate-200 text-slate-900 font-bold' :
                          idx === 2 ? 'bg-slate-100 text-slate-700 font-bold' : 'bg-slate-50 text-slate-500'
                        }`}>
                          #{idx + 1}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-sky-700">
                      #{issue.id}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900 text-sm">{issue.category}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{issue.description}</div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-slate-800 font-medium truncate block max-w-[200px]">
                        {issue.locationName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        GPS: {issue.coordinates.join(', ')}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        {issue.duplicateCount} clustered
                      </span>
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-700">
                      {issue.department}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              issue.priorityScore >= 90 ? 'bg-rose-500' :
                              issue.priorityScore >= 80 ? 'bg-amber-500' :
                              issue.priorityScore >= 60 ? 'bg-sky-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, issue.priorityScore)}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-extrabold text-sm text-slate-900">
                          {issue.priorityScore}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleInspectIssue(issue)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                      >
                        Inspect & Route
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
