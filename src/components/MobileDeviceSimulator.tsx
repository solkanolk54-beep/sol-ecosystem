import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Wifi,
  Battery,
  Signal,
  Home,
  Trees,
  Activity,
  QrCode,
  Camera,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Farm, Tree, LivestockAnimal, TraceabilityBatch } from '../types';
import { DashboardView } from './DashboardView';

interface MobileDeviceSimulatorProps {
  farm: Farm;
  trees: Tree[];
  livestock: LivestockAnimal[];
  batches: TraceabilityBatch[];
  onSelectTree: (tree: Tree) => void;
  onSelectAnimal: (animal: LivestockAnimal) => void;
  onOpenAiScanner: () => void;
  onOpenTraceability: () => void;
}

export const MobileDeviceSimulator: React.FC<MobileDeviceSimulatorProps> = ({
  farm,
  trees,
  livestock,
  batches,
  onSelectTree,
  onSelectAnimal,
  onOpenAiScanner,
  onOpenTraceability,
}) => {
  const [activeBottomNav, setActiveBottomNav] = useState<'dashboard' | 'orchard' | 'livestock' | 'traceability'>('dashboard');

  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Simulation Info Pill */}
      <div className="mb-4 flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs px-4 py-1.5 rounded-full shadow-xs">
        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold">Flutter Material 3 Live Mobile Simulator (Pixel 8 / iPhone 15 Pro)</span>
        <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.2 rounded-full font-mono">
          lib/main.dart
        </span>
      </div>

      {/* Device Chassis */}
      <div className="relative w-full max-w-[420px] bg-black rounded-[48px] p-3.5 shadow-2xl border-[5px] border-stone-800 ring-1 ring-stone-700/50">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 mr-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-900/60"></div>
        </div>

        {/* Screen Display Container */}
        <div className="relative bg-[#F4F7F4] text-stone-900 rounded-[38px] overflow-hidden flex flex-col h-[740px] shadow-inner select-none">
          {/* Status Bar */}
          <div className="pt-2 px-6 pb-1 bg-[#0F5132] text-white flex items-center justify-between text-[11px] font-semibold z-20">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Flutter Material 3 App Bar */}
          <div className="bg-[#0F5132] text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10 text-[#A3E635]">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-xs tracking-wider">SOL ECOSYSTEM</div>
                <div className="text-[10px] text-emerald-200 leading-none">Cap Bon Agro-Estate</div>
              </div>
            </div>

            <button
              onClick={onOpenAiScanner}
              className="p-1.5 rounded-full bg-[#8B4513] text-white hover:bg-[#A0522D] transition-colors shadow-xs"
              title="Quick AI Scan"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <DashboardView
              farm={farm}
              trees={trees}
              livestock={livestock}
              batches={batches}
              onSelectTree={onSelectTree}
              onSelectAnimal={onSelectAnimal}
              onOpenAiScanner={onOpenAiScanner}
              onOpenTraceability={onOpenTraceability}
              isMobileSimulator={true}
            />
          </div>

          {/* Flutter Material 3 Bottom Navigation Bar */}
          <div className="bg-white border-t border-stone-200 px-4 py-2 flex items-center justify-between text-[10px] font-semibold text-stone-500 shadow-lg z-20">
            <button
              onClick={() => setActiveBottomNav('dashboard')}
              className={`flex flex-col items-center gap-0.5 ${
                activeBottomNav === 'dashboard' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveBottomNav('orchard')}
              className={`flex flex-col items-center gap-0.5 ${
                activeBottomNav === 'orchard' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <Trees className="w-4 h-4" />
              <span>Orchard</span>
            </button>

            {/* Central Floating AI Camera Action */}
            <button
              onClick={onOpenAiScanner}
              className="flex flex-col items-center -mt-5"
            >
              <div className="w-11 h-11 rounded-full bg-[#8B4513] text-white flex items-center justify-center shadow-md border-2 border-white">
                <Camera className="w-5 h-5 text-amber-200" />
              </div>
              <span className="text-[9px] text-[#8B4513] font-bold mt-0.5">AI Scan</span>
            </button>

            <button
              onClick={() => setActiveBottomNav('livestock')}
              className={`flex flex-col items-center gap-0.5 ${
                activeBottomNav === 'livestock' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Livestock</span>
            </button>

            <button
              onClick={onOpenTraceability}
              className={`flex flex-col items-center gap-0.5 ${
                activeBottomNav === 'traceability' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Passport</span>
            </button>
          </div>

          {/* iOS / Android Home Indicator Bar */}
          <div className="bg-white py-1 flex justify-center">
            <div className="w-32 h-1 bg-stone-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
