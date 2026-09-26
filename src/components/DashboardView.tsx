import React, { useState } from 'react';
import {
  Trees,
  Activity,
  Droplets,
  Sparkles,
  QrCode,
  ShieldCheck,
  Search,
  Camera,
  MapPin,
  ChevronLeft,
  Sun,
  AlertOctagon,
  Syringe,
  BellRing,
  RefreshCw,
  CloudRain,
  Cloud,
  Wind
} from 'lucide-react';
import { Farm, Tree, LivestockAnimal, TraceabilityBatch } from '../types';
import { LiveWeatherData } from '../services/weatherService';

interface DashboardViewProps {
  farm: Farm;
  trees: Tree[];
  livestock: LivestockAnimal[];
  batches: TraceabilityBatch[];
  onSelectTree: (tree: Tree) => void;
  onSelectAnimal: (animal: LivestockAnimal) => void;
  onOpenAiScanner: () => void;
  onOpenTraceability: () => void;
  isMobileSimulator?: boolean;
  onTriggerTreeAlert?: () => void;
  onTriggerLivestockAlert?: () => void;
  onNavigateToPredictiveIrrigation?: () => void;
  liveWeather?: LiveWeatherData | null;
  onRefreshWeather?: () => Promise<void>;
  isWeatherLoading?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farm,
  trees,
  livestock,
  batches: _batches,
  onSelectTree,
  onSelectAnimal,
  onOpenAiScanner,
  onOpenTraceability,
  isMobileSimulator = false,
  onTriggerTreeAlert,
  onTriggerLivestockAlert,
  onNavigateToPredictiveIrrigation,
  liveWeather,
  onRefreshWeather,
  isWeatherLoading = false,
}) => {
  // Weather details modal state
  const [isWeatherDetailsOpen, setIsWeatherDetailsOpen] = useState(false);
  // Filters for trees
  const [treeHealthFilter, setTreeHealthFilter] = useState<'all' | 'healthy' | 'needs_attention' | 'diseased'>('all');
  const [treeSearch, setTreeSearch] = useState('');

  // Filters for livestock
  const [livestockSpeciesFilter, setLivestockSpeciesFilter] = useState<'all' | 'cattle' | 'sheep'>('all');
  const [livestockSearch, setLivestockSearch] = useState('');

  // Filtered Tree List
  const filteredTrees = trees.filter((t) => {
    const matchesHealth = treeHealthFilter === 'all' || t.healthStatus === treeHealthFilter;
    const matchesSearch =
      treeSearch === '' ||
      t.tagCode.toLowerCase().includes(treeSearch.toLowerCase()) ||
      t.variety.toLowerCase().includes(treeSearch.toLowerCase()) ||
      t.species.toLowerCase().includes(treeSearch.toLowerCase()) ||
      t.parcelZone.toLowerCase().includes(treeSearch.toLowerCase());
    return matchesHealth && matchesSearch;
  });

  // Filtered Livestock List
  const filteredLivestock = livestock.filter((a) => {
    const matchesSpecies = livestockSpeciesFilter === 'all' || a.species === livestockSpeciesFilter;
    const matchesSearch =
      livestockSearch === '' ||
      a.tagRfid.toLowerCase().includes(livestockSearch.toLowerCase()) ||
      a.nameOrAlias.toLowerCase().includes(livestockSearch.toLowerCase()) ||
      a.breed.toLowerCase().includes(livestockSearch.toLowerCase()) ||
      a.pastureZone.toLowerCase().includes(livestockSearch.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  // Status mapping
  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return { text: 'سليمة', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'needs_attention':
        return { text: 'تحتاج عناية', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'diseased':
        return { text: 'مصابة', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { text: status, bg: 'bg-stone-100 text-stone-800 border-stone-300' };
    }
  };

  const getIrrigationText = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'سقي مثالي';
      case 'deficit':
        return 'عجز مائي';
      case 'scheduled':
        return 'سقي مبرمج';
      default:
        return status;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'healthy':
        return 'سليم';
      case 'lactating':
        return 'مدرّة للحليب';
      case 'pregnant':
        return 'حامل';
      default:
        return condition;
    }
  };

  const diseasedTreeSample = trees.find((t) => t.healthStatus === 'diseased') || trees[2];
  const upcomingLivestockSample = livestock.find((a) => a.vaccinationSchedule.some((v) => v.status === 'upcoming')) || livestock[0];

  return (
    <div dir="rtl" className={`space-y-5 text-right font-sans ${isMobileSimulator ? 'p-3' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
      {/* 1. FARM OVERVIEW HERO CARD */}
      <div className="bg-gradient-to-br from-[#0F5132] via-[#14532D] to-[#166534] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-700/50 relative overflow-hidden">
        {/* Subtle decorative background curves */}
        <div className="absolute left-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Live Weather Badge (Real-Time API: Open-Meteo & OpenWeatherMap) */}
            <div className="relative inline-block mb-2">
              <div
                onClick={() => setIsWeatherDetailsOpen(!isWeatherDetailsOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-md border border-white/20 shadow-sm cursor-pointer transition-all"
                title="انقر لعرض تفاصيل محطة الأرصاد بميلة"
              >
                {/* Live green pulse indicator */}
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3E635]"></span>
                </span>

                {/* Dynamic weather icon */}
                {liveWeather?.weatherIcon === 'rain' ? (
                  <CloudRain className="w-3.5 h-3.5 text-cyan-300" />
                ) : liveWeather?.weatherIcon === 'cloud' ? (
                  <Cloud className="w-3.5 h-3.5 text-stone-300" />
                ) : liveWeather?.weatherIcon === 'wind' ? (
                  <Wind className="w-3.5 h-3.5 text-sky-300" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                )}

                <span className="font-extrabold text-white">
                  {liveWeather ? liveWeather.summaryBadge : farm.weather}
                </span>

                <span className="text-[10px] font-bold bg-[#0F5132]/80 text-[#A3E635] px-1.5 py-0.2 rounded-full border border-emerald-500/40">
                  {liveWeather?.isLive ? 'مباشر' : 'تحديث حي'}
                </span>

                {onRefreshWeather && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefreshWeather();
                    }}
                    className={`p-0.5 rounded-full hover:bg-white/20 transition-all cursor-pointer ${
                      isWeatherLoading ? 'animate-spin text-amber-300' : 'text-emerald-200'
                    }`}
                    title="تحديث بيانات الطقس الآن"
                    aria-label="تحديث بيانات الطقس"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Expandable Live Weather Popover */}
              {isWeatherDetailsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsWeatherDetailsOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#16271D]/95 border border-emerald-600/80 rounded-2xl shadow-2xl p-3.5 z-40 text-right backdrop-blur-md text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2 mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>محطة ميلة المباشرة (حوض بني هارون)</span>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-mono">
                        {liveWeather?.timestamp || 'الآن'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-stone-200 mb-2">
                      <div className="bg-black/20 p-2 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">الحرارة المحسوسة</span>
                        <span className="font-bold text-white font-mono">{liveWeather?.feelsLikeC ?? 25.3}° م</span>
                      </div>
                      <div className="bg-black/20 p-2 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">الرطوبة النسبية</span>
                        <span className="font-bold text-white font-mono">{liveWeather?.humidityPct ?? 53}%</span>
                      </div>
                      <div className="bg-black/20 p-2 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">سرعة الرياح</span>
                        <span className="font-bold text-white font-mono">{liveWeather?.windSpeedKmh ?? 15} كم/سا</span>
                      </div>
                      <div className="bg-black/20 p-2 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">البخر المرجعي ET0</span>
                        <span className="font-bold text-white font-mono">{liveWeather?.et0MmDay ?? 4.1} مم/يوم</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-emerald-800">
                      <span>المصدر: {liveWeather?.source || 'Open-Meteo Live API'}</span>
                      {onRefreshWeather && (
                        <button
                          onClick={() => onRefreshWeather()}
                          className="text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isWeatherLoading ? 'animate-spin' : ''}`} />
                          <span>تحديث الآن</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Farm Name & Header */}
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{farm.name}</h1>

            {/* Subtitle & Location & Soil Description */}
            <p className="text-xs sm:text-sm text-emerald-100 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>{farm.region} • {farm.country} • {farm.soilType}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Estate Area Badge */}
            <div className="bg-black/20 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/10 text-right">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">المساحة الإجمالية</div>
              <div className="text-xl sm:text-2xl font-black">{farm.areaHectares} هكتار</div>
            </div>
          </div>
        </div>

        {/* Telemetry KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          {/* Metric 1: Olive Trees */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <div className="text-xs text-emerald-200 flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-bold">أشجار الزيتون</span>
            </div>
            <div className="text-lg sm:text-xl font-black mt-1">4,250 شجرة</div>
            <div className="text-[10px] text-emerald-200">89.9% صحة ممتازة (3,820 شجرة)</div>
          </div>

          {/* Metric 2: Livestock */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <div className="text-xs text-emerald-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bold">الثروة الحيوانية</span>
            </div>
            <div className="text-lg sm:text-xl font-black mt-1">680 رأس</div>
            <div className="text-[10px] text-emerald-200">220 أبقار • 460 أغنام</div>
          </div>

          {/* Metric 3: Soil Moisture */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <div className="text-xs text-emerald-200 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-bold">رطوبة التربة</span>
            </div>
            <div className="text-lg sm:text-xl font-black mt-1">38.4%</div>
            <div className="text-[10px] text-emerald-200">شبكة مستشعرات TDR اللاسلكية</div>
          </div>

          {/* Metric 4: Traceability Batches */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
            <div className="text-xs text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-bold">دفعات التتبع الموثقة</span>
            </div>
            <div className="text-lg sm:text-xl font-black mt-1">2 دفعات نشطة</div>
            <div className="text-[10px] text-emerald-200">زيت زيتون بكر ولحم أولاد جلال</div>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME TOAST NOTIFICATIONS & ACTIVE ALERTS BAR */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-2xl p-4 sm:p-5 border border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold flex items-center gap-2">
                نظام الإشعارات والتنبيهات الميدانية (Toast Notifications System)
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono">
                  تنبيهات فورية
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                رصد آني لحالات الأشجار المصابة ومواعيد التلقيح البيطري القادمة لقطيع ميلة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onTriggerTreeAlert?.();
                setTimeout(() => onTriggerLivestockAlert?.(), 800);
              }}
              className="text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>إرسال إشعارات تجريبية الآن</span>
            </button>
          </div>
        </div>

        {/* Two Alert Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Alert 1: Diseased Tree */}
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 flex flex-col justify-between gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-rose-200">
                    تنبيه صحة نباتية: شجرة مصابة (عفن الأنثراكنوز)
                  </div>
                  <p className="text-[11px] text-rose-300/80 mt-0.5">
                    الشجرة <strong>{diseasedTreeSample.tagCode}</strong> ({diseasedTreeSample.variety}) بالقطعة {diseasedTreeSample.parcelZone} بحاجة لعزل ورش بيولوجي.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-rose-500/20 text-rose-200 px-2 py-0.5 rounded-full shrink-0 border border-rose-500/40">
                مصابة
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-rose-900/50">
              <button
                onClick={() => onSelectTree(diseasedTreeSample)}
                className="text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                معاينة الشجرة
              </button>
              <button
                onClick={onTriggerTreeAlert}
                className="text-[11px] text-rose-300 hover:text-white px-2 py-1 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>إطلاق تنبيه Toast</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Alert 2: Upcoming Vaccination */}
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 flex flex-col justify-between gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Syringe className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-amber-200">
                    تنبيه بيطري: موعد تطعيم قادم للقطيع
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">
                    البقرة <strong>{upcomingLivestockSample.nameOrAlias} ({upcomingLivestockSample.tagRfid})</strong> - مبرمج لها تلقيح كلوستريدي معزز قريباً.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full shrink-0 border border-amber-500/40">
                تلقيح قادم
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-amber-900/50">
              <button
                onClick={() => onSelectAnimal(upcomingLivestockSample)}
                className="text-[11px] font-bold bg-amber-600 hover:bg-amber-500 text-stone-950 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                فتح السجل البيطري
              </button>
              <button
                onClick={onTriggerLivestockAlert}
                className="text-[11px] text-amber-300 hover:text-white px-2 py-1 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>إطلاق تنبيه Toast</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 PREDICTIVE IRRIGATION & FAO-56 SCHEDULING BANNER */}
      <div className="bg-gradient-to-r from-[#0B3D25] via-[#0F5132] to-[#124B2E] text-white rounded-2xl p-4 sm:p-5 border border-emerald-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  نظام الري التنبؤي وحساب البخر-نتح المرجعي (FAO-56)
                </h3>
                <span className="text-[10px] font-bold bg-[#A3E635] text-[#0F5132] px-2 py-0.5 rounded-full">
                  جديد • حوض بني هارون
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                حساب آلي للاحتياج المائي لكل قطعة شجرية بناءً على مجسات رطوبة التربة الحية (FDR) وحرارة الطقس (24° م)
                ومعدل البخر المرجعي (4.6 مم/يوم)، مع جدولة دورات الري بالتقطير لترشيد استهلاك مياه سد بني هارون.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onNavigateToPredictiveIrrigation}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#91ce2b] text-[#0F5132] font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>فتح لوحة الري التنبؤي والجدولة الكاملة</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Parcel Status Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-emerald-800/60 text-xs">
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-emerald-200">بستان ألفا (الشملالي)</div>
            <div className="font-black text-white text-xs sm:text-sm mt-0.5">42.0% رطوبة</div>
            <div className="text-[10px] text-emerald-300 font-bold">مثالي • دورة بعد يومين</div>
          </div>
          <div className="bg-rose-950/60 border border-rose-500/50 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-rose-300">بستان بيتا (البيشولين)</div>
            <div className="font-black text-white text-xs sm:text-sm mt-0.5">24.2% رطوبة</div>
            <div className="text-[10px] text-rose-300 font-extrabold animate-pulse">🚨 عجز حرج • ري الليلة</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-emerald-200">بستان غاما (الأربيكينا)</div>
            <div className="font-black text-white text-xs sm:text-sm mt-0.5">39.5% رطوبة</div>
            <div className="text-[10px] text-emerald-300 font-bold">مثالي • مجدول الأربعاء</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-emerald-200">بستان الحمضيات (المالطي)</div>
            <div className="font-black text-white text-xs sm:text-sm mt-0.5">45.0% رطوبة</div>
            <div className="text-[10px] text-cyan-300 font-bold">سعة حقلية كافية</div>
          </div>
          <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-amber-300">مدرجات التين السلطاني</div>
            <div className="font-black text-white text-xs sm:text-sm mt-0.5">26.5% رطوبة</div>
            <div className="text-[10px] text-amber-300 font-bold">⚠️ اقتراب العتبة • غداً</div>
          </div>
        </div>
      </div>

      {/* 3. QUICK AI SCAN PROMPT BANNER */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#8B4513]/10 border border-[#8B4513]/20 flex items-center justify-center text-[#8B4513] shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                الفحص السريع بالذكاء الاصطناعي
              </h3>
              <span className="text-[10px] font-bold bg-[#8B4513] text-amber-50 px-2 py-0.5 rounded-full">
                الوحدة (أ)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              التقط صورة للورقة للكشف المبكر عن عين الطاووس، الأنثراكنوز، ونقص المغذيات مع توصيات المعالجة العضوية.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAiScanner}
          className="px-4 py-2.5 rounded-xl bg-[#8B4513] hover:bg-[#A0522D] text-white text-xs font-bold shadow flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>تشغيل ماسح الكاميرا الذكي</span>
        </button>
      </div>

      {/* 4. MODULE A: SMART ORCHARD & PLANT MANAGEMENT */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                الوحدة (أ): إدارة البستان الذكي وحقول الزيتون
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                4,250 شجرة
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              حقول الزيتون (شملالي عريق، بيشولين عالي الكثافة، أربيكينا) وبساتين الفاكهة بحوض ميلة
            </p>
          </div>

          {/* Health Breakdown Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setTreeHealthFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                treeHealthFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              الكل (4,250)
            </button>
            <button
              onClick={() => setTreeHealthFilter('healthy')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                treeHealthFilter === 'healthy'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              سليمة (3,820)
            </button>
            <button
              onClick={() => setTreeHealthFilter('needs_attention')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                treeHealthFilter === 'needs_attention'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              تحتاج سقي (320)
            </button>
            <button
              onClick={() => setTreeHealthFilter('diseased')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                treeHealthFilter === 'diseased'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              مصابة (110)
            </button>
          </div>
        </div>

        {/* Tree Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="ابحث عن شجرة برمز التتبع (مثال: SOL-TR-OLV-001) أو الصنف أو القطعة..."
            value={treeSearch}
            onChange={(e) => setTreeSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-4 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-600 text-right"
          />
        </div>

        {/* Tree Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTrees.map((tree) => {
            const badge = getHealthBadge(tree.healthStatus);
            return (
              <div
                key={tree.id}
                onClick={() => onSelectTree(tree)}
                className="bg-stone-50/70 hover:bg-emerald-50/30 border border-stone-200 hover:border-emerald-300 rounded-2xl p-4 transition-all cursor-pointer shadow-xs hover:shadow-md group text-right"
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                    {badge.text}
                  </span>

                  <div>
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {tree.tagCode}
                    </span>
                    <h4 className="font-extrabold text-sm text-stone-900 mt-1 group-hover:text-emerald-800 transition-colors">
                      {tree.variety}
                    </h4>
                    <div className="text-xs text-stone-500">{tree.parcelZone}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">العمر</span>
                    <span className="font-bold text-stone-800">{tree.ageYears} سنة</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">حالة الري</span>
                    <span className="font-bold text-blue-700">{getIrrigationText(tree.irrigationStatus)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">رطوبة التربة</span>
                    <span className="font-bold text-stone-800">{tree.soilMoisturePct}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-stone-400 group-hover:text-emerald-700 font-semibold pt-1">
                  <span>عرض السجل الزراعي الكامل</span>
                  <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MODULE B: LIVESTOCK MANAGEMENT SYSTEM (CATTLE & SHEEP) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                الوحدة (ب): تتبع الثروة الحيوانية (الأبقار والأغنام)
              </h2>
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                680 رأس
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              أطواق وحساسات RFID • منحنيات الوزن • جداول التلقيح • تتبع إنتاج الحليب واللحم
            </p>
          </div>

          {/* Species Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLivestockSpeciesFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                livestockSpeciesFilter === 'all'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              كامل القطيع (680)
            </button>
            <button
              onClick={() => setLivestockSpeciesFilter('cattle')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                livestockSpeciesFilter === 'cattle'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              الأبقار (220)
            </button>
            <button
              onClick={() => setLivestockSpeciesFilter('sheep')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                livestockSpeciesFilter === 'sheep'
                  ? 'bg-[#8B4513] text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              الأغنام (460)
            </button>
          </div>
        </div>

        {/* Animal Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="ابحث بالمعرف الرقمي RFID (مثال: RFID-CTL-9021) أو السلالة أو الاسم..."
            value={livestockSearch}
            onChange={(e) => setLivestockSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-4 py-2 text-xs text-stone-800 focus:outline-none focus:border-blue-600 text-right"
          />
        </div>

        {/* Livestock Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredLivestock.map((animal) => {
            const isCattle = animal.species === 'cattle';
            return (
              <div
                key={animal.id}
                onClick={() => onSelectAnimal(animal)}
                className="bg-stone-50/70 hover:bg-blue-50/30 border border-stone-200 hover:border-blue-300 rounded-2xl p-4 transition-all cursor-pointer shadow-xs hover:shadow-md group text-right"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {getConditionText(animal.healthCondition)}
                  </span>

                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded">
                          {animal.tagRfid}
                        </span>
                        <h4 className="font-extrabold text-sm text-stone-900 group-hover:text-blue-900">
                          {animal.nameOrAlias}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500">{animal.breed} • {animal.ageMonths} شهر</p>
                    </div>

                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isCattle ? 'bg-blue-100 text-[#1E3A8A]' : 'bg-amber-100 text-[#8B4513]'
                      }`}
                    >
                      {isCattle ? 'أبقار' : 'أغنام'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">الوزن الحالي</span>
                    <span className="font-bold text-stone-800">{animal.currentWeightKg} كغ</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">معدل الإنتاج</span>
                    <span className="font-bold text-blue-700">
                      {animal.currentYieldValue} {animal.yieldUnit === 'L/day' ? 'لتر/يوم' : animal.yieldUnit === 'g/day' ? 'غ/يوم' : animal.yieldUnit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">المرعى</span>
                    <span className="font-bold text-stone-800 truncate block">{animal.pastureZone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-stone-400 group-hover:text-blue-700 font-semibold pt-1">
                  <span>فتح الملف الصحي والبيطري RFID</span>
                  <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. MODULE C: TRACEABILITY & FARM-TO-FORK BANNER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <QrCode className="w-8 h-8 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg">الوحدة (ج): جواز السفر الرقمي وتتبع الجودة (Farm-to-Fork)</h3>
              <span className="text-[10px] font-bold bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full uppercase">
                رمز الاستجابة QR
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              توليد رموز QR مشفرة لكل دفعة (زيت زيتون بكر ممتاز #EVOO-2026-088 ولحوم أولاد جلال).
              يتيح للمستهلك والرقابة فحص تاريخ الجني، إحداثيات الحقل، نسبة الحموضة (0.18%)، والشهادات المخبرية.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTraceability}
          className="px-5 py-3 rounded-xl bg-white hover:bg-blue-50 text-[#1E3A8A] font-extrabold text-xs shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
          <span>فتح مولد QR وجواز السفر الرقمي</span>
        </button>
      </div>
    </div>
  );
};
