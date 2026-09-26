import React from 'react';
import { X, Trees, Droplets, Calendar, ShieldCheck, AlertCircle, Clock, MapPin, Activity } from 'lucide-react';
import { Tree } from '../types';

interface TreeDetailModalProps {
  tree: Tree | null;
  onClose: () => void;
  onToggleIrrigation: (treeId: string) => void;
}

export const TreeDetailModal: React.FC<TreeDetailModalProps> = ({
  tree,
  onClose,
  onToggleIrrigation,
}) => {
  if (!tree) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-stone-900 w-full max-w-xl rounded-2xl overflow-hidden border border-emerald-100 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F5132] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Trees className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{tree.tagCode}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    tree.healthStatus === 'healthy'
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                      : tree.healthStatus === 'needs_attention'
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                      : 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                  }`}
                >
                  {tree.healthStatus.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-emerald-200">{tree.variety} • {tree.species}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Key Agronomic Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
              <div className="text-xs text-stone-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Tree Age</span>
              </div>
              <div className="text-base font-bold text-stone-900 mt-1">{tree.ageYears} Yrs</div>
              <div className="text-[10px] text-stone-400">Planted {tree.plantingDate}</div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
              <div className="text-xs text-stone-500 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Soil Moisture</span>
              </div>
              <div className="text-base font-bold text-blue-700 mt-1">{tree.soilMoisturePct}%</div>
              <div className="text-[10px] text-stone-400">TDR Sensor #S-{tree.id.slice(-3)}</div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
              <div className="text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Last Harvest</span>
              </div>
              <div className="text-base font-bold text-stone-900 mt-1">
                {tree.lastHarvestDate || 'In Season'}
              </div>
              <div className="text-[10px] text-stone-400">Batch Grade: EVOO A</div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
              <div className="text-xs text-stone-500 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Canopy Diam.</span>
              </div>
              <div className="text-base font-bold text-stone-900 mt-1">{tree.canopyDiameterMeters} m</div>
              <div className="text-[10px] text-stone-400">Drone LiDAR Scanned</div>
            </div>
          </div>

          {/* Location & Irrigation Section */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F5132]">
                <MapPin className="w-4 h-4" />
                <span>Parcel Zone: {tree.parcelZone}</span>
              </div>
              <div className="text-xs text-stone-600 mt-0.5">
                Irrigation Status:{' '}
                <span className="font-bold uppercase text-stone-800">{tree.irrigationStatus}</span> (Pulsed Solar Drip Line)
              </div>
            </div>
            <button
              onClick={() => onToggleIrrigation(tree.id)}
              className="px-3 py-1.5 rounded-lg bg-[#0F5132] hover:bg-[#165B37] text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              {tree.irrigationStatus === 'deficit' ? 'Trigger 2h Drip Flow' : 'Cycle Irrigation Check'}
            </button>
          </div>

          {/* Disease History & Treatment Dossier */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
              <span>Agronomic Health History & AI Diagnoses ({tree.diseaseHistory.length})</span>
            </h4>

            {tree.diseaseHistory.length === 0 ? (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center text-xs text-stone-500">
                <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                No pathology recorded. Tree has maintained clean phytosanitary status.
              </div>
            ) : (
              <div className="space-y-2.5">
                {tree.diseaseHistory.map((item, idx) => (
                  <div key={idx} className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.condition}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-700">Treatment: </span>
                      {item.treatment}
                    </div>
                    <div className="text-[10px] text-stone-400 pt-1">Logged on {item.date} by Lead Agronomist</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
