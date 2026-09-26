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
  Sun
} from 'lucide-react';
import { Farm, Tree, LivestockAnimal, TraceabilityBatch } from '../types';

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
}) => {
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

  return (
    <div dir="rtl" className={`space-y-5 text-right font-sans ${isMobileSimulator ? 'p-3' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
      {/* 1. FARM OVERVIEW HERO CARD */}
      <div className="bg-gradient-to-br from-[#0F5132] via-[#14532D] to-[#166534] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-700/50 relative overflow-hidden">
        {/* Subtle decorative background curves */}
        <div className="absolute left-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Weather Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>{farm.weather}</span>
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

      {/* 2. QUICK AI SCAN PROMPT BANNER */}
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

      {/* 3. MODULE A: SMART ORCHARD & PLANT MANAGEMENT */}
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
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                treeHealthFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              الكل (4,250)
            </button>
            <button
              onClick={() => setTreeHealthFilter('healthy')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                treeHealthFilter === 'healthy'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              سليمة (3,820)
            </button>
            <button
              onClick={() => setTreeHealthFilter('needs_attention')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                treeHealthFilter === 'needs_attention'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              تحتاج سقي (320)
            </button>
            <button
              onClick={() => setTreeHealthFilter('diseased')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
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

      {/* 4. MODULE B: LIVESTOCK MANAGEMENT SYSTEM (CATTLE & SHEEP) */}
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
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                livestockSpeciesFilter === 'all'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              كامل القطيع (680)
            </button>
            <button
              onClick={() => setLivestockSpeciesFilter('cattle')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                livestockSpeciesFilter === 'cattle'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              الأبقار (220)
            </button>
            <button
              onClick={() => setLivestockSpeciesFilter('sheep')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
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

      {/* 5. MODULE C: TRACEABILITY & FARM-TO-FORK BANNER */}
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
