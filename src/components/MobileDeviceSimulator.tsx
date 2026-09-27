import React, { useState } from 'react';
import {
  Smartphone,
  Wifi,
  Battery,
  Signal,
  Home,
  Trees,
  Activity,
  QrCode,
  Camera,
  AlertOctagon,
  Syringe,
  X,
  ChevronLeft,
  FileText
} from 'lucide-react';
import { Farm, Tree, LivestockAnimal, TraceabilityBatch, ToastNotificationItem } from '../types';
import { LiveWeatherData } from '../services/weatherService';
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
  onTriggerTreeAlert?: () => void;
  onTriggerLivestockAlert?: () => void;
  activeAlert?: ToastNotificationItem | null;
  onDismissAlert?: (id: string) => void;
  onNavigateToPredictiveIrrigation?: () => void;
  onNavigateToResourceConsumption?: () => void;
  onNavigateToWeeklySummary?: () => void;
  liveWeather?: LiveWeatherData | null;
  onRefreshWeather?: () => Promise<void>;
  isWeatherLoading?: boolean;
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
  onTriggerTreeAlert,
  onTriggerLivestockAlert,
  activeAlert,
  onDismissAlert,
  onNavigateToPredictiveIrrigation,
  onNavigateToResourceConsumption,
  onNavigateToWeeklySummary,
  liveWeather,
  onRefreshWeather,
  isWeatherLoading = false,
}) => {
  const [activeBottomNav, setActiveBottomNav] = useState<'dashboard' | 'orchard' | 'livestock' | 'traceability'>('dashboard');

  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Simulation Info Pill */}
      <div className="mb-4 flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs px-4 py-1.5 rounded-full shadow-xs">
        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold">محاكي تطبيق Flutter المباشر (Pixel 8 / iPhone 15 Pro) • Material 3 RTL</span>
        <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.2 rounded-full font-mono">
          lib/main.dart (عربي / RTL)
        </span>
      </div>

      {/* Device Chassis */}
      <div className="relative w-full max-w-[420px] bg-black rounded-[48px] p-3.5 shadow-2xl border-[5px] border-stone-800 ring-1 ring-stone-700/50">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 mr-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-900/60"></div>
        </div>

        {/* Screen Display Container (RTL Layout) */}
        <div dir="rtl" className="relative bg-[#F4F7F4] text-stone-900 rounded-[38px] overflow-hidden flex flex-col h-[740px] shadow-inner select-none text-right font-sans">
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
              <div className="text-right">
                <div className="font-black text-xs tracking-wide">منظومة SOL الرقمية</div>
                <div className="text-[10px] text-emerald-200 leading-none">ميلة، الجزائر • حوض بني هارون</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onNavigateToWeeklySummary}
                className="p-1.5 rounded-full bg-white/10 text-emerald-300 hover:bg-white/20 transition-colors shadow-xs cursor-pointer"
                title="التقرير الزراعي الأسبوعي (PDF)"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenAiScanner}
                className="p-1.5 rounded-full bg-[#8B4513] text-white hover:bg-[#A0522D] transition-colors shadow-xs cursor-pointer"
                title="فحص فوري بالذكاء الاصطناعي"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* In-Device Real-time Push Notification Banner (Material 3 Heads-up Notification) */}
          {activeAlert && (
            <div className="bg-stone-900/95 border-b border-stone-800 text-white p-2.5 z-20 shadow-xl animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-start justify-between gap-2 text-xs">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      activeAlert.type === 'danger'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {activeAlert.type === 'danger' ? (
                      <AlertOctagon className="w-3.5 h-3.5" />
                    ) : (
                      <Syringe className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[11px] truncate text-white">{activeAlert.title}</div>
                    <div className="text-[10px] text-stone-300 leading-tight line-clamp-1">{activeAlert.message}</div>
                    {activeAlert.actionLabel && (
                      <button
                        onClick={() => {
                          activeAlert.onAction?.();
                          onDismissAlert?.(activeAlert.id);
                        }}
                        className="mt-1 text-[10px] font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{activeAlert.actionLabel}</span>
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDismissAlert?.(activeAlert.id)}
                  className="text-stone-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

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
              onTriggerTreeAlert={onTriggerTreeAlert}
              onTriggerLivestockAlert={onTriggerLivestockAlert}
              onNavigateToPredictiveIrrigation={onNavigateToPredictiveIrrigation}
              onNavigateToResourceConsumption={onNavigateToResourceConsumption}
              onNavigateToWeeklySummary={onNavigateToWeeklySummary}
              liveWeather={liveWeather}
              onRefreshWeather={onRefreshWeather}
              isWeatherLoading={isWeatherLoading}
            />
          </div>

          {/* Flutter Material 3 Bottom Navigation Bar */}
          <div className="bg-white border-t border-stone-200 px-4 py-2 flex items-center justify-between text-[10px] font-semibold text-stone-500 shadow-lg z-20">
            <button
              onClick={() => setActiveBottomNav('dashboard')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeBottomNav === 'dashboard' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => setActiveBottomNav('orchard')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeBottomNav === 'orchard' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <Trees className="w-4 h-4" />
              <span>البستان</span>
            </button>

            {/* Central Floating AI Camera Action */}
            <button
              onClick={onOpenAiScanner}
              className="flex flex-col items-center -mt-5 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-[#8B4513] text-white flex items-center justify-center shadow-md border-2 border-white">
                <Camera className="w-5 h-5 text-amber-200" />
              </div>
              <span className="text-[9px] text-[#8B4513] font-bold mt-0.5">فحص ذكي</span>
            </button>

            <button
              onClick={() => setActiveBottomNav('livestock')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeBottomNav === 'livestock' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>المواشي</span>
            </button>

            <button
              onClick={() => setActiveBottomNav('traceability')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeBottomNav === 'traceability' ? 'text-[#0F5132] font-bold' : 'hover:text-stone-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>جواز الجودة</span>
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
