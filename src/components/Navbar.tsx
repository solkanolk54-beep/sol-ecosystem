import React from 'react';
import { Sprout, Smartphone, Monitor, Database, Server, Code, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'mobile_simulator' | 'full_dashboard' | 'step1_sql' | 'step2_express' | 'step3_flutter';
  setActiveTab: (tab: 'mobile_simulator' | 'full_dashboard' | 'step1_sql' | 'step2_express' | 'step3_flutter') => void;
  onOpenAiScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiScanner,
}) => {
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'full_dashboard'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              لوحة العمليات الموسعة
            </button>
            <button
              onClick={() => setActiveTab('step1_sql')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'step3_flutter'
                  ? 'bg-white text-[#0F5132] shadow-sm font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              الخطوة 3: كود Flutter (Dart)
            </button>
          </nav>

          {/* Quick AI Action & Farm Status */}
          <div className="flex items-center gap-2 sm:gap-3">
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
