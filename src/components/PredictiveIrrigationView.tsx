import React, { useState, useMemo } from 'react';
import {
  Droplets,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Gauge,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Layers,
  Zap,
  Play,
  RotateCcw,
  Sliders,
  ChevronLeft,
  Info,
  Waves,
  ShieldCheck,
  Check,
  Flame,
  CloudLightning
} from 'lucide-react';
import { Tree, Farm, ParcelIrrigationMetrics, WeatherCondition } from '../types';
import { LiveWeatherData, buildWeatherConditionFromLive } from '../services/weatherService';
import {
  calculateParcelIrrigation,
  WEATHER_PRESETS,
  DEFAULT_WEATHER_MILA
} from '../utils/irrigationEngine';

interface PredictiveIrrigationViewProps {
  farm: Farm;
  trees: Tree[];
  onIrrigateParcel: (parcelId: string, treeIds: string[]) => void;
  onSelectTree?: (tree: Tree) => void;
  onOpenAiScanner?: () => void;
  onShowToast: (title: string, message: string, type: 'success' | 'warning' | 'info' | 'danger') => void;
  liveWeather?: LiveWeatherData | null;
}

export const PredictiveIrrigationView: React.FC<PredictiveIrrigationViewProps> = ({
  farm,
  trees,
  onIrrigateParcel,
  onSelectTree,
  onShowToast,
  liveWeather
}) => {
  // State for interactive weather scenario simulation
  const [selectedPresetId, setSelectedPresetId] = useState<string>('current_normal');
  const [thresholdOffset, setThresholdOffset] = useState<number>(0);
  const [selectedParcelId, setSelectedParcelId] = useState<string>('all');
  const [approvedParcels, setApprovedParcels] = useState<Record<string, boolean>>({});

  // Active weather condition based on selected scenario
  const currentWeather: WeatherCondition = useMemo(() => {
    if (selectedPresetId === 'current_normal') {
      if (liveWeather) {
        return buildWeatherConditionFromLive(liveWeather, DEFAULT_WEATHER_MILA);
      }
      return DEFAULT_WEATHER_MILA;
    }
    const preset = WEATHER_PRESETS.find((p) => p.id === selectedPresetId);
    return preset ? preset.weather : DEFAULT_WEATHER_MILA;
  }, [selectedPresetId, liveWeather]);

  // Recalculate predictive metrics dynamically
  const parcelMetrics: ParcelIrrigationMetrics[] = useMemo(() => {
    return calculateParcelIrrigation(trees, currentWeather, thresholdOffset);
  }, [trees, currentWeather, thresholdOffset]);

  // Filtered parcels
  const displayedParcels = useMemo(() => {
    if (selectedParcelId === 'all') return parcelMetrics;
    return parcelMetrics.filter((p) => p.id === selectedParcelId);
  }, [parcelMetrics, selectedParcelId]);

  // Totals for top telemetry
  const summary = useMemo(() => {
    const criticalCount = parcelMetrics.filter((p) => p.urgency === 'critical').length;
    const warningCount = parcelMetrics.filter((p) => p.urgency === 'warning').length;
    const totalVolumeM3 = parcelMetrics.reduce((acc, p) => acc + p.suggestedCycle.waterVolumeM3, 0);
    const totalEnergySavingsKwh = parcelMetrics.reduce((acc, p) => acc + p.suggestedCycle.savingsKwh, 0);

    return {
      criticalCount,
      warningCount,
      totalVolumeM3: +totalVolumeM3.toFixed(1),
      totalEnergySavingsKwh: +totalEnergySavingsKwh.toFixed(1)
    };
  }, [parcelMetrics]);

  // Handle single parcel irrigation execution
  const handleExecuteCycle = (parcel: ParcelIrrigationMetrics) => {
    onIrrigateParcel(parcel.id, parcel.treeIds);
    setApprovedParcels((prev) => ({ ...prev, [parcel.id]: true }));
    onShowToast(
      '💧 تم تشغيل شبكة الري بالتقطير بنجاح',
      `تم تفعيل صمام السقي الذكي لـ (${parcel.arabicName}) لضخ ${parcel.suggestedCycle.waterVolumeM3} م³ وموازنة رطوبة التربة إلى السعة الحقلية المثالية.`,
      'success'
    );
  };

  // Handle approving all suggested schedules
  const handleApproveAll = () => {
    const newApproved: Record<string, boolean> = {};
    parcelMetrics.forEach((p) => {
      newApproved[p.id] = true;
    });
    setApprovedParcels(newApproved);
    onShowToast(
      '✅ تم اعتماد الجدولة التنبؤية لكامل المستثمرة',
      `تمت مزامنة مواعيد الري لجميع القطع الخمس مع مضخات الطاقة الشمسية بحوض سد بني هارون وفق حسابات البخر-نتح FAO-56.`,
      'success'
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F4F6F0] text-stone-900 pb-16 font-sans">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-b from-[#0B3D25] via-[#0F5132] to-[#124B2E] text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Kicker */}
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold mb-3">
            <span>منظومة SOL الرقمية</span>
            <span aria-hidden="true">/</span>
            <span>المستثمرة الفلاحية الذكية بميلة</span>
            <span aria-hidden="true">/</span>
            <span className="text-white">نظام الري التنبؤي وحساب البخر-نتح (FAO-56)</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  الري التنبؤي والجدولة الذكية للقطع
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  حوض سد بني هارون • خوارزمية FAO-56
                </span>
              </div>
              <p className="text-sm text-emerald-100/90 mt-2 max-w-3xl leading-relaxed">
                حساب آلي للاحتياج المائي لكل قطعة شجرية اعتماداً على قراءات مجسات رطوبة التربة الحية
                (FDR) وبيانات الطقس الآنية ومعدل البخر-نتح المرجعي ($ET_0$) لترشيد استهلاك المياه
                والطاقة الشمسية.
              </p>
            </div>

            {/* Quick Master Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleApproveAll}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#91ce2b] text-[#0F5132] font-extrabold text-sm shadow-lg shadow-black/20 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                اعتماد الجدولة الذكية للجميع
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
                <span>حالات الإجهاد المائي الحرج</span>
                <AlertTriangle className={`w-4 h-4 ${summary.criticalCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
              </div>
              <div className="text-2xl font-black text-white">
                {summary.criticalCount} <span className="text-xs font-normal text-emerald-200">قطعة</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-1">تتطلب ضخاً فورياً للري بالتقطير</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
                <span>إجمالي الحصة المائية المقترحة</span>
                <Droplets className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-2xl font-black text-white">
                {summary.totalVolumeM3} <span className="text-xs font-normal text-emerald-200">م³</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-1">موزعة على دورات التقطير الصباحية</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
                <span>توفير طاقة الضخ الشمسي</span>
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-2xl font-black text-white">
                {summary.totalEnergySavingsKwh} <span className="text-xs font-normal text-emerald-200">ك.و.سا</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-1">تفادي ساعات الذروة والضخ بالجاذبية</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
                <span>معدل البخر-نتح المرجعي</span>
                <Gauge className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-2xl font-black text-white">
                {currentWeather.et0MmDay} <span className="text-xs font-normal text-emerald-200">مم/يوم</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-1">حساب مؤشر Penman-Monteith</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Weather & Simulation Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-200/80 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-stone-100">
            {/* Live Weather Station Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                <Sun className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-stone-900">
                    محطة الرصد الجوي الميدانية (حوض ميلة)
                  </h2>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    متصل حي ومباشر
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {currentWeather.stationName} • {currentWeather.conditionArabic}
                </p>
              </div>
            </div>

            {/* Current Weather Indicators */}
            <div className="flex items-center gap-4 flex-wrap text-xs text-stone-600">
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <span>الحرارة:</span>
                <span className="font-extrabold text-stone-900">{currentWeather.currentTempC}° م</span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                <Droplets className="w-4 h-4 text-cyan-500" />
                <span>الرطوبة:</span>
                <span className="font-extrabold text-stone-900">{currentWeather.humidityPct}%</span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                <Wind className="w-4 h-4 text-sky-500" />
                <span>الرياح:</span>
                <span className="font-extrabold text-stone-900">{currentWeather.windSpeedKmh} كم/سا ({currentWeather.windDirection})</span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                <CloudRain className="w-4 h-4 text-indigo-500" />
                <span>الأمطار المتوقعة:</span>
                <span className="font-extrabold text-stone-900">{currentWeather.expectedRainfallMm} مم</span>
              </div>
            </div>
          </div>

          {/* Interactive Scenario Simulation Controls */}
          <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-stone-400" />
                محاكاة تأثير الطقس:
              </span>
              {WEATHER_PRESETS.map((preset) => {
                const isActive = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      onShowToast(
                        '🔄 تم تطبيق سيناريو الطقس',
                        `تم تحديث حسابات البخر-نتح وجداول الري وفق سيناريو (${preset.name}).`,
                        'info'
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#0F5132] text-white border-[#0F5132] shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {preset.id === 'heatwave_sirocco' && <Flame className="w-3 h-3 inline-block ml-1 text-amber-300" />}
                    {preset.id === 'rain_storm' && <CloudLightning className="w-3 h-3 inline-block ml-1 text-cyan-300" />}
                    {preset.id === 'current_normal' && <Sun className="w-3 h-3 inline-block ml-1 text-amber-500" />}
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Threshold Adjuster Slider */}
            <div className="flex items-center gap-3 text-xs bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 self-start md:self-auto">
              <span className="text-stone-500 font-medium">معامل حساسية العتبة:</span>
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={thresholdOffset}
                onChange={(e) => setThresholdOffset(Number(e.target.value))}
                className="w-24 accent-[#0F5132] cursor-pointer"
              />
              <span className="font-mono font-bold text-stone-800">
                {thresholdOffset > 0 ? `+${thresholdOffset}%` : `${thresholdOffset}%`}
              </span>
              {thresholdOffset !== 0 && (
                <button
                  onClick={() => setThresholdOffset(0)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  title="إعادة ضبط"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 5-Day Forecast Strip */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="text-[11px] font-bold text-stone-400 mb-2">توقعات البخر-نتح والأمطار للأيام الخمسة القادمة (حوض بني هارون):</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {currentWeather.forecast5Days.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    idx === 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-stone-50/60 border-stone-200/70'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-800">{day.dayName}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{day.date}</div>
                  <div className="flex items-center justify-center gap-1 my-2">
                    {day.icon === 'sun' && <Sun className="w-5 h-5 text-amber-500" />}
                    {day.icon === 'wind' && <Wind className="w-5 h-5 text-orange-500" />}
                    {day.icon === 'rain' && <CloudRain className="w-5 h-5 text-cyan-600" />}
                    {day.icon === 'cloud' && <Droplets className="w-5 h-5 text-stone-500" />}
                    <span className="text-sm font-black text-stone-900">{day.maxTempC}°</span>
                    <span className="text-xs text-stone-400">/ {day.minTempC}°</span>
                  </div>
                  <div className="text-[11px] font-medium text-stone-600">
                    البخر: <span className="font-bold text-stone-900">{day.et0MmDay} مم</span>
                  </div>
                  {day.expectedRainMm > 0 ? (
                    <div className="text-[10px] font-bold text-cyan-700 bg-cyan-100/60 rounded px-1.5 py-0.5 mt-1">
                      أمطار: {day.expectedRainMm} مم
                    </div>
                  ) : (
                    <div className="text-[10px] text-stone-400 mt-1">جاف</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              مصفوفة القطع الشجرية والجدولة التنبؤية
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              5 قطع رئيسية مجهزة بشبكات الري بالتنقيط المتصلة بمحطة سد بني هارون
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setSelectedParcelId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedParcelId === 'all'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جميع القطع ({parcelMetrics.length})
            </button>
            {parcelMetrics.map((p) => {
              const isCrit = p.urgency === 'critical';
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedParcelId(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedParcelId === p.id
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isCrit && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                  <span>{p.name.split(' ')[1] || p.arabicName.split(' ')[2]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Parcel Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {displayedParcels.map((parcel) => {
            const isCritical = parcel.urgency === 'critical';
            const isWarning = parcel.urgency === 'warning';
            const isOptimal = parcel.urgency === 'optimal';
            const isExcess = parcel.urgency === 'excess';
            const isApproved = approvedParcels[parcel.id];

            // Moisture status color
            const statusConfig = isCritical
              ? {
                  badge: 'bg-rose-100 text-rose-800 border-rose-200',
                  badgeText: '🚨 إجهاد مائي حرج - ري فوري مطلوب',
                  border: 'border-rose-300 ring-2 ring-rose-500/20',
                  gaugeColor: 'bg-rose-500',
                  gaugeBg: 'bg-rose-100',
                  btnStyle: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                }
              : isWarning
              ? {
                  badge: 'bg-amber-100 text-amber-800 border-amber-200',
                  badgeText: '⚠️ اقتراب عتبة الإجهاد - مجدول قريباً',
                  border: 'border-amber-300',
                  gaugeColor: 'bg-amber-500',
                  gaugeBg: 'bg-amber-100',
                  btnStyle: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                }
              : isExcess
              ? {
                  badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                  badgeText: '💧 رطوبة كافية / أمطار - تأجيل الري',
                  border: 'border-cyan-300',
                  gaugeColor: 'bg-cyan-500',
                  gaugeBg: 'bg-cyan-100',
                  btnStyle: 'bg-cyan-700 hover:bg-cyan-600 text-white'
                }
              : {
                  badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  badgeText: '✅ رطوبة متوازنة ضمن السعة الحقلية',
                  border: 'border-emerald-200',
                  gaugeColor: 'bg-emerald-500',
                  gaugeBg: 'bg-emerald-100',
                  btnStyle: 'bg-[#0F5132] hover:bg-[#14603c] text-white'
                };

            return (
              <div
                key={parcel.id}
                className={`bg-white rounded-3xl p-6 shadow-md border ${statusConfig.border} transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar: Title & Urgency */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusConfig.badge}`}>
                          {statusConfig.badgeText}
                        </span>
                        <span className="text-xs text-stone-400">
                          {parcel.areaHectares} هكتار • {parcel.treeCount} شجرة
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-stone-900 leading-snug">
                        {parcel.arabicName}
                      </h3>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">
                        {parcel.name} • {parcel.variety}
                      </p>
                    </div>

                    {/* Quick FAO-56 Kc Badge */}
                    <div className="text-center px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 shrink-0">
                      <div className="text-[10px] text-stone-400 font-bold">معامل المحصول</div>
                      <div className="text-sm font-mono font-black text-stone-800">
                        Kc = {parcel.cropCoefficientKc}
                      </div>
                    </div>
                  </div>

                  {/* Soil Moisture Gauge vs Field Capacity */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 mb-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-stone-700 flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-cyan-600" />
                        رطوبة التربة الحالية (مجسات FDR 30-60 سم):
                      </span>
                      <span className="text-base font-black text-stone-900 font-mono">
                        {parcel.currentMoisturePct}%
                      </span>
                    </div>

                    {/* Progress Bar with Threshold Markers */}
                    <div className="relative w-full h-4 rounded-full bg-stone-200 overflow-hidden mb-2">
                      {/* Critical Threshold Zone Marker */}
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-rose-200/70 border-r border-rose-400 z-10"
                        style={{ width: `${(parcel.criticalThresholdPct / 50) * 100}%` }}
                        title={`عتبة الإجهاد الحرج (${parcel.criticalThresholdPct}%)`}
                      />
                      {/* Current Moisture Level Bar */}
                      <div
                        className={`h-full ${statusConfig.gaugeColor} transition-all duration-700 rounded-full relative z-20`}
                        style={{ width: `${Math.min(100, (parcel.currentMoisturePct / 50) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>نقطة الذبول: {parcel.wiltingPointPct}%</span>
                      <span className="font-bold text-rose-700">عتبة الإجهاد MAD: {parcel.criticalThresholdPct}%</span>
                      <span className="font-bold text-emerald-700">السعة الحقلية FC: {parcel.fieldCapacityPct}%</span>
                    </div>
                  </div>

                  {/* Scientific Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-5">
                    <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                      <div className="text-[10px] text-stone-500">البخر-نتح للمحصول</div>
                      <div className="text-sm font-extrabold text-stone-800 font-mono mt-0.5">
                        {parcel.etCropMmDay} <span className="text-[10px] font-normal text-stone-500">مم/ي</span>
                      </div>
                      <div className="text-[9px] text-stone-400">ETc = ET0 × Kc</div>
                    </div>

                    <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                      <div className="text-[10px] text-stone-500">الاستنزاف اليومي</div>
                      <div className="text-sm font-extrabold text-stone-800 font-mono mt-0.5">
                        -{parcel.dailyMoistureDropPct}% <span className="text-[10px] font-normal text-stone-500">/يوم</span>
                      </div>
                      <div className="text-[9px] text-stone-400">معدل الفقد</div>
                    </div>

                    <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                      <div className="text-[10px] text-stone-500">الوقت حتى الإجهاد</div>
                      <div className={`text-sm font-extrabold font-mono mt-0.5 ${isCritical ? 'text-rose-600' : 'text-stone-800'}`}>
                        {parcel.hoursUntilCritical === 0 ? 'مستنزف الآن' : `${parcel.hoursUntilCritical} ساعة`}
                      </div>
                      <div className="text-[9px] text-stone-400">توقيت الأمان</div>
                    </div>
                  </div>

                  {/* Suggested Irrigation Cycle Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-emerald-900 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        الجدولة التنبؤية المقترحة:
                      </span>
                      <span className="text-[11px] text-emerald-700 font-mono">
                        {parcel.suggestedCycle.scheduledDate}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-emerald-950 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>النافذة الزمنية:</span>
                        <span className="font-bold">{parcel.suggestedCycle.scheduledTimeWindow}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                        <span>الحصة المائية:</span>
                        <span className="font-extrabold font-mono">{parcel.suggestedCycle.waterVolumeM3} م³</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                        <span>المدة المقدرة:</span>
                        <span className="font-bold">{parcel.suggestedCycle.durationMinutes} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>توفير الطاقة:</span>
                        <span className="font-bold font-mono">+{parcel.suggestedCycle.savingsKwh} ك.و.سا</span>
                      </div>
                    </div>

                    {/* Agronomic Justification */}
                    <div className="text-[11px] leading-relaxed text-emerald-900/90 pt-2 border-t border-emerald-200/60 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{parcel.suggestedCycle.agronomicJustification}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
                  <div className="text-xs text-stone-500">
                    حالة الصمام: <span className="font-bold text-stone-800 font-mono">{parcel.valveStatus === 'running' ? 'يعمل الآن' : isApproved ? 'مجدول ومؤكد' : 'جاهز للتشغيل'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExecuteCycle(parcel)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${statusConfig.btnStyle}`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>تشغيل دورة الري المقترحة الآن</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 7-Day Visual Irrigation Scheduling Grid */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200/80 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0F5132]" />
                مخطط الجدولة الأسبوعي للري التنبؤي (حوض بني هارون)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                مزامنة تلقائية مع ساعات ضخ الطاقة الشمسية لتفادي أوقات الذروة وتقليل التبخر
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-rose-500" /> دورة عاجلة
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#0F5132]" /> دورة مجدولة
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-cyan-400" /> إيقاف / أمطار
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="pb-3 pr-2 font-bold min-w-[180px]">القطعة الشجرية</th>
                  <th className="pb-3 text-center min-w-[110px]">اليوم (السبت)</th>
                  <th className="pb-3 text-center min-w-[110px]">الأحد</th>
                  <th className="pb-3 text-center min-w-[110px]">الإثنين</th>
                  <th className="pb-3 text-center min-w-[110px]">الثلاثاء</th>
                  <th className="pb-3 text-center min-w-[110px]">الأربعاء</th>
                  <th className="pb-3 text-center min-w-[110px]">الخميس</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {parcelMetrics.map((p) => {
                  const isCrit = p.urgency === 'critical';
                  const isRainy = currentWeather.expectedRainfallMm >= 10;
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 pr-2 font-bold text-stone-800">
                        <div>{p.arabicName.split(' - ')[0]}</div>
                        <span className="text-[10px] text-stone-400 font-normal">{p.variety.split(' ')[0]}</span>
                      </td>

                      {/* Saturday */}
                      <td className="py-3.5 text-center">
                        {isCrit ? (
                          <div className="inline-block p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-[11px]">
                            21:00 م ({p.suggestedCycle.waterVolumeM3} م³)
                          </div>
                        ) : (
                          <span className="text-stone-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Sunday */}
                      <td className="py-3.5 text-center">
                        {!isCrit && p.urgency === 'warning' ? (
                          <div className="inline-block p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[11px]">
                            05:30 ص ({p.suggestedCycle.waterVolumeM3} م³)
                          </div>
                        ) : (
                          <span className="text-stone-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Monday */}
                      <td className="py-3.5 text-center">
                        {p.id === 'parcel-alpha' || p.id === 'parcel-citrus' ? (
                          <div className="inline-block p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5132] font-bold text-[11px]">
                            05:00 ص (12.4 م³)
                          </div>
                        ) : (
                          <span className="text-stone-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Tuesday (Rain forecasted) */}
                      <td className="py-3.5 text-center">
                        {isRainy || currentWeather.forecast5Days[3].rainProbPct > 50 ? (
                          <div className="inline-block p-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold text-[10px]">
                            🌧️ توفير أمطار (تأجيل)
                          </div>
                        ) : (
                          <span className="text-stone-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Wednesday */}
                      <td className="py-3.5 text-center">
                        {p.id === 'parcel-gamma' ? (
                          <div className="inline-block p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5132] font-bold text-[11px]">
                            06:00 ص (14.2 م³)
                          </div>
                        ) : (
                          <span className="text-stone-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Thursday */}
                      <td className="py-3.5 text-center">
                        {p.id === 'parcel-fig' ? (
                          <div className="inline-block p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5132] font-bold text-[11px]">
                            05:30 ص (6.8 م³)
                          </div>
                        ) : (
                          <span className="text-stone-300 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agronomic Technical Reference & FAO-56 Methodology */}
        <div className="bg-[#1C170E] text-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                المعايير الهندسية لخوارزمية الري التنبؤي SOL (FAO-56 Penman-Monteith)
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                تعتمد المنظومة على قياس مباشر لرطوبة التربة عبر مجسات السعة الكهربائية (FDR Probes)
                بأعماق 30 سم و 60 سم في التربة الطميية الفيضية لحوض ميلة. يتم دمج هذه البيانات مع نموذج
                البخر-نتح المرجعي ($ET_0$) ومعامل المحصول ($K_c$) لكل صنف لتحديد نقطة الإجهاد المسموح به
                (Management Allowed Depletion - MAD) عند نسبة 50% من الماء المتاح. يتم توجيه الصمامات الذكية
                للري ليلاً أو في الصباح الباكر للاستفادة القصوى من مياه سد بني هارون وتفادي الفواقد التبخيرية
                التي تصل إلى 28% في فترات الظهيرة.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-amber-900/50 text-xs">
                <div>
                  <span className="text-amber-400 font-bold block">مجسات الرطوبة:</span>
                  <span className="text-stone-300">أجهزة FDR بالسعة الكهربائية متصلة ببروتوكول LoRaWAN</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block">مصدر الإمداد:</span>
                  <span className="text-stone-300">مآخذ سد بني هارون + طاقة كهرومائية وشمسية</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block">معدل التوفير المحقق:</span>
                  <span className="text-stone-300">32% في المياه و 24% في تكلفة الطاقة سنوياً</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
