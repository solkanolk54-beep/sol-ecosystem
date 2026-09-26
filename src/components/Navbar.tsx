import React, { useState } from 'react';
import { Sprout, Smartphone, Monitor, Database, Server, Code, Sparkles, Bell, AlertOctagon, Syringe, CheckCircle2, Droplets } from 'lucide-react';
import { ToastNotificationItem } from '../types';

interface NavbarProps {
  activeTab: 'mobile_simulator' | 'full_dashboard' | 'predictive_irrigation' | 'step1_sql' | 'step2_express' | 'step3_flutter';
  setActiveTab: (tab: 'mobile_simulator' | 'full_dashboard' | 'predictive_irrigation' | 'step1_sql' | 'step2_express' | 'step3_flutter') => void;
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
    <header dir="rtl" className="sticky top-0 z-40 bg-[#0F5132] text-white border-b border-[#165B37] shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Sprout className="w-6 h-6 text-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wide text-base md:text-lg">منظومة SOL الرقمية</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B4513] text-amber-100 uppercase tracking-wider">
                  تحدي AgriTech 2026
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                مستثمرة ميلة الفلاحية • حوض بني هارون
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
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
              onClick={() => setActiveTab('step1_sql')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'step1_sql'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              الخطوة 1: قاعدة البيانات (SQL)
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
              الخطوة 2: خادم Express API
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
              الخطوة 3: كود Flutter (Dart)
            </button>
          </nav>

          {/* Quick AI Action & Farm Status & Notification Bell */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15"
                title="مركز الإشعارات والتنبيهات"
                aria-label="مركز الإشعارات"
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
                  <div className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 bg-[#16271D] border border-emerald-700/80 rounded-2xl shadow-2xl z-50 text-right overflow-hidden animate-in fade-in duration-150">
                    <div className="p-3.5 bg-[#0F5132] border-b border-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-300" />
                        <h4 className="font-bold text-xs text-white">مركز الإشعارات والتنبيهات الحية</h4>
                      </div>
                      <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                        {recentAlerts.length} تنبيهات
                      </span>
                    </div>

                    <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                      {/* Alert Item 1: Diseased Tree */}
                      <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-rose-300 flex items-center gap-1.5">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                            شجرة مصابة بعفن الأنثراكنوز
                          </span>
                          <span className="text-[9px] bg-rose-500/20 text-rose-200 px-1.5 py-0.2 rounded border border-rose-500/30">
                            عاجل
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-100">
                          الشجرة <strong>SOL-TR-OLV-003</strong> في حقل غاما مصابة بمرض الأنثراكنوز.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              onSelectTreeById?.('tr-003');
                              setIsNotificationsOpen(false);
                            }}
                            className="text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded cursor-pointer"
                          >
                            معاينة الشجرة
                          </button>
                          <button
                            onClick={() => {
                              onTriggerTreeAlert?.();
                              setIsNotificationsOpen(false);
                            }}
                            className="text-[10px] text-stone-300 hover:text-white cursor-pointer"
                          >
                            إطلاق إشعار Toast
                          </button>
                        </div>
                      </div>

                      {/* Alert Item 2: Upcoming Animal Vaccination */}
                      <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                            <Syringe className="w-3.5 h-3.5 text-amber-400" />
                            موعد تلقيح بيطري قادم
                          </span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded border border-amber-500/30">
                            بيطرة
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-100">
                          البقرة <strong>بيلا بريما (RFID-CTL-9021)</strong> مبرمج لها تلقيح ضد الكلوستريديا.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              onSelectAnimalById?.('lstk-001');
                              setIsNotificationsOpen(false);
                            }}
                            className="text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-stone-900 px-2 py-0.5 rounded cursor-pointer"
                          >
                            السجل البيطري
                          </button>
                          <button
                            onClick={() => {
                              onTriggerLivestockAlert?.();
                              setIsNotificationsOpen(false);
                            }}
                            className="text-[10px] text-stone-300 hover:text-white cursor-pointer"
                          >
                            إطلاق إشعار Toast
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-black/30 border-t border-emerald-900/60 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          onTriggerTreeAlert?.();
                          setTimeout(() => onTriggerLivestockAlert?.(), 1000);
                          setIsNotificationsOpen(false);
                        }}
                        className="text-[11px] text-emerald-300 hover:text-emerald-100 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تشغيل جميع الإشعارات التجريبية</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onOpenAiScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B4513] hover:bg-[#A0522D] text-amber-50 text-xs font-bold shadow transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>فحص فوري بالذكاء الاصطناعي</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ميلة: 142.5 هكتار</span>
            </div>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="lg:hidden flex items-center justify-between pb-3 overflow-x-auto gap-1 border-t border-white/10 pt-2 text-xs">
          <button
            onClick={() => setActiveTab('mobile_simulator')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'mobile_simulator' ? 'bg-white text-[#0F5132] font-bold' : 'text-emerald-100'
            }`}
          >
            تطبيق الهاتف (RTL)
          </button>
          <button
            onClick={() => setActiveTab('full_dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'full_dashboard' ? 'bg-white text-[#0F5132] font-bold' : 'text-emerald-100'
            }`}
          >
            لوحة العمليات
          </button>
          <button
            onClick={() => setActiveTab('predictive_irrigation')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'predictive_irrigation' ? 'bg-white text-[#0F5132] font-bold' : 'text-emerald-100'
            }`}
          >
            الري التنبؤي
          </button>
          <button
            onClick={() => setActiveTab('step1_sql')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'step1_sql' ? 'bg-white text-[#0F5132] font-bold' : 'text-emerald-100'
            }`}
          >
            قاعدة البيانات SQL
          </button>
          <button
            onClick={() => setActiveTab('step2_express')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'step2_express' ? 'bg-white text-[#0F5132] font-bold' : 'text-emerald-100'
            }`}
          >
            خادم API
          </button>
          <button
            onClick={() => setActiveTab('step3_flutter')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'step3_flutter' ? 'bg-white text-[#0F5132] font-bold' : 'text-emerald-100'
            }`}
          >
            تطبيق Flutter
          </button>
        </div>
      </div>
    </header>
  );
};
