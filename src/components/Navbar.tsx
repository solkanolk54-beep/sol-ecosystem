import React, { useState } from 'react';
import { Sprout, Smartphone, Monitor, Database, Server, Code, Sparkles, Bell, AlertOctagon, Syringe, Droplets, Fuel, FileText } from 'lucide-react';
import { ToastNotificationItem } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeTab: 'mobile_simulator' | 'full_dashboard' | 'predictive_irrigation' | 'resource_consumption' | 'weekly_summary' | 'step1_sql' | 'step2_express' | 'step3_flutter';
  setActiveTab: (tab: 'mobile_simulator' | 'full_dashboard' | 'predictive_irrigation' | 'resource_consumption' | 'weekly_summary' | 'step1_sql' | 'step2_express' | 'step3_flutter') => void;
  onOpenAiScanner: () => void;
  activeAlertCount?: number;
  recentAlerts?: ToastNotificationItem[];
  onTriggerTreeAlert?: () => void;
  onTriggerLivestockAlert?: () => void;
  onSelectTreeById?: (treeId: string) => void;
  onSelectAnimalById?: (animalId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiScanner,
  activeAlertCount = 2,
  recentAlerts = [],
  onTriggerTreeAlert,
  onTriggerLivestockAlert,
  onSelectTreeById,
  onSelectAnimalById,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header dir="rtl" className="sticky top-0 z-40 bg-[#0F5132] dark:bg-[#072416] text-white border-b border-[#165B37] dark:border-emerald-950 shadow-md font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[56px] sm:h-16 py-1.5 sm:py-0">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold tracking-wide text-xs sm:text-base md:text-lg whitespace-nowrap">منظومة SOL</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#8B4513] text-amber-100 uppercase tracking-wider whitespace-nowrap">
                  2026
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-emerald-200 hidden sm:block">
                مستثمرة ميلة الفلاحية • حوض بني هارون
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop view only - hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('mobile_simulator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mobile_simulator'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              محاكي الهاتف (Flutter RTL)
            </button>
            <button
              onClick={() => setActiveTab('full_dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'full_dashboard'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              لوحة العمليات الموسعة
            </button>
            <button
              onClick={() => setActiveTab('predictive_irrigation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'predictive_irrigation'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-300" />
              الري التنبؤي الذكي (FAO-56)
            </button>
            <button
              onClick={() => setActiveTab('resource_consumption')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'resource_consumption'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Fuel className="w-3.5 h-3.5 text-amber-300" />
              مراقبة استهلاك الموارد
            </button>
            <button
              onClick={() => setActiveTab('weekly_summary')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'weekly_summary'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              التقرير الأسبوعي
            </button>
            <button
              onClick={() => setActiveTab('step1_sql')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'step1_sql'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              SQL
            </button>
            <button
              onClick={() => setActiveTab('step2_express')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'step2_express'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              API
            </button>
            <button
              onClick={() => setActiveTab('step3_flutter')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'step3_flutter'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Flutter
            </button>
          </nav>

          {/* Quick AI Action & Farm Status & Notification Bell & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <ThemeToggle variant="icon" />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15"
                title="مركز الإشعارات والتنبيهات"
              >
                <Bell className="w-4 h-4 text-amber-200" />
                {activeAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-[#0F5132] animate-pulse">
                    {activeAlertCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 sm:w-96 bg-[#16271D] border border-emerald-700/80 rounded-2xl shadow-2xl z-50 text-right overflow-hidden animate-in fade-in duration-150">
                    <div className="p-3 bg-[#0F5132] border-b border-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-300" />
                        <h4 className="font-bold text-xs text-white">مركز الإشعارات والتنبيهات الحية</h4>
                      </div>
                      <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                        {recentAlerts.length} تنبيهات
                      </span>
                    </div>

                    <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                      <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-rose-300 flex items-center gap-1.5">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                            شجرة مصابة بعفن الأنثراكنوز
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-100">
                          الشجرة <strong>SOL-TR-OLV-003</strong> مصابة بمرض الأنثراكنوز.
                        </p>
                        <button
                          onClick={() => {
                            onSelectTreeById?.('tr-003');
                            setIsNotificationsOpen(false);
                          }}
                          className="mt-1 text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded cursor-pointer"
                        >
                          معاينة الشجرة
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                            <Syringe className="w-3.5 h-3.5 text-amber-400" />
                            موعد تلقيح بيطري قادم
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-100">
                          البقرة <strong>بيلا بريما</strong> مبرمج لها تلقيح.
                        </p>
                        <button
                          onClick={() => {
                            onSelectAnimalById?.('lstk-001');
                            setIsNotificationsOpen(false);
                          }}
                          className="mt-1 text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-stone-900 px-2 py-0.5 rounded cursor-pointer"
                        >
                          السجل البيطري
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* AI Action Button */}
            <button
              onClick={onOpenAiScanner}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#8B4513] hover:bg-[#A0522D] text-amber-50 text-[11px] sm:text-xs font-bold shadow transition-colors cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden sm:inline">فحص بالذكاء الاصطناعي</span>
              <span className="sm:hidden">فحص AI</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar - Streamlined WITHOUT Mobile Simulator */}
        <div className="lg:hidden flex items-center gap-1.5 pb-2 overflow-x-auto border-t border-white/10 pt-2 text-[11px] no-scrollbar">
          <button
            onClick={() => setActiveTab('full_dashboard')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
              activeTab === 'full_dashboard' || activeTab === 'mobile_simulator' ? 'bg-white text-[#0F5132] font-bold shadow-sm' : 'text-emerald-100 bg-white/5'
            }`}
          >
            لوحة العمليات
          </button>
          <button
            onClick={() => setActiveTab('predictive_irrigation')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
              activeTab === 'predictive_irrigation' ? 'bg-white text-[#0F5132] font-bold shadow-sm' : 'text-emerald-100 bg-white/5'
            }`}
          >
            الري التنبؤي
          </button>
          <button
            onClick={() => setActiveTab('resource_consumption')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
              activeTab === 'resource_consumption' ? 'bg-white text-[#0F5132] font-bold shadow-sm' : 'text-emerald-100 bg-white/5'
            }`}
          >
            مراقبة الموارد
          </button>
          <button
            onClick={() => setActiveTab('weekly_summary')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
              activeTab === 'weekly_summary' ? 'bg-white text-[#0F5132] font-bold shadow-sm' : 'text-emerald-100 bg-white/5'
            }`}
          >
            التقرير الأسبوعي
          </button>
          <button
            onClick={() => setActiveTab('step1_sql')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
              activeTab === 'step1_sql' ? 'bg-white text-[#0F5132] font-bold shadow-sm' : 'text-emerald-100 bg-white/5'
            }`}
          >
            SQL
          </button>
          <button
            onClick={() => setActiveTab('step2_express')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
              activeTab === 'step2_express' ? 'bg-white text-[#0F5132] font-bold shadow-sm' : 'text-emerald-100 bg-white/5'
            }`}
          >
            API
          </button>
          <button
            onClick={() => setActiveTab('step3_flutter')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
              activeTab === 'step3_flutter' ? 'bg-white text-[#0F5132] font-bold shadow-sm' : 'text-emerald-100 bg-white/5'
            }`}
          >
            Flutter
          </button>
        </div>
      </div>
    </header>
  );
};
