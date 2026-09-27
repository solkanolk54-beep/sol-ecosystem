import React, { useState, useMemo } from 'react';
import {
  Fuel,
  Droplets,
  Sprout,
  Tractor,
  Gauge,
  Calendar,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  BarChart3,
  Trees,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  X,
  ShieldCheck,
  Zap,
  Wrench,
  UserCheck
} from 'lucide-react';
import {
  Farm,
  Tree,
  FarmMachinery,
  ResourceConsumptionLog,
  OrchardParcelStatus
} from '../types';

interface ResourceConsumptionViewProps {
  farm: Farm;
  trees: Tree[];
  machinery: FarmMachinery[];
  consumptionLogs: ResourceConsumptionLog[];
  onAddConsumptionLog: (log: Omit<ResourceConsumptionLog, 'id'>) => void;
  onUpdateMachineryStatus?: (machineryId: string, status: FarmMachinery['status'], assignedParcel?: string) => void;
  onSelectTree?: (tree: Tree) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'warning' | 'info' | 'danger') => void;
}

export const ResourceConsumptionView: React.FC<ResourceConsumptionViewProps> = ({
  farm,
  trees,
  machinery,
  consumptionLogs,
  onAddConsumptionLog,
  onUpdateMachineryStatus,
  onSelectTree,
  onShowToast
}) => {
  // Filters & View State
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '14d' | 'all'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'water' | 'fertilizer' | 'diesel'>('all');
  const [selectedParcelFilter, setSelectedParcelFilter] = useState<string>('all');
  const [selectedMachineryFilter, setSelectedMachineryFilter] = useState<string>('all');
  const [activeHoverDate, setActiveHoverDate] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Log Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    machineryId: machinery[0]?.id || '',
    parcelZone: 'Grove Alpha (Ancient Centenarians)',
    activityType: 'رش وقائي لمستحضر حيوي',
    waterM3: '12.0',
    fertilizerKg: '25.0',
    dieselLiters: '22.5',
    operatingHours: '3.5',
    operator: 'عمر بوقرة',
    notes: ''
  });

  // Filtered Logs by Date Range
  const daysLimit = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '14d' ? 14 : 30;

  const filteredLogs = useMemo(() => {
    let logs = [...consumptionLogs].sort((a, b) => b.date.localeCompare(a.date));

    // Get unique dates sorted descending
    const uniqueDates = Array.from(new Set(logs.map((l) => l.date))).slice(0, daysLimit);
    logs = logs.filter((l) => uniqueDates.includes(l.date));

    if (selectedParcelFilter !== 'all') {
      logs = logs.filter((l) => l.parcelZone.includes(selectedParcelFilter));
    }
    if (selectedMachineryFilter !== 'all') {
      logs = logs.filter((l) => l.machineryId === selectedMachineryFilter);
    }
    return logs;
  }, [consumptionLogs, daysLimit, selectedParcelFilter, selectedMachineryFilter]);

  // Aggregate daily data for bar chart
  const dailyAggregates = useMemo(() => {
    const map = new Map<
      string,
      {
        date: string;
        dayName: string;
        waterM3: number;
        fertilizerKg: number;
        dieselLiters: number;
        totalHours: number;
        costDzd: number;
        logCount: number;
      }
    >();

    // Prepare calendar days in order
    const sortedDesc = Array.from(new Set(filteredLogs.map((l) => l.date))).sort();

    sortedDesc.forEach((d) => {
      const dateObj = new Date(d);
      const dayName = dateObj.toLocaleDateString('ar-DZ', { weekday: 'short', day: 'numeric', month: 'numeric' });
      map.set(d, {
        date: d,
        dayName,
        waterM3: 0,
        fertilizerKg: 0,
        dieselLiters: 0,
        totalHours: 0,
        costDzd: 0,
        logCount: 0
      });
    });

    filteredLogs.forEach((log) => {
      const entry = map.get(log.date);
      if (entry) {
        entry.waterM3 += Number(log.waterM3) || 0;
        entry.fertilizerKg += Number(log.fertilizerKg) || 0;
        entry.dieselLiters += Number(log.dieselLiters) || 0;
        entry.totalHours += Number(log.operatingHours) || 0;
        entry.costDzd += Number(log.costDzd) || 0;
        entry.logCount += 1;
      }
    });

    return Array.from(map.values()).map((item) => ({
      ...item,
      waterM3: +item.waterM3.toFixed(1),
      fertilizerKg: +item.fertilizerKg.toFixed(1),
      dieselLiters: +item.dieselLiters.toFixed(1),
      totalHours: +item.totalHours.toFixed(1)
    }));
  }, [filteredLogs]);

  // Max values for chart scaling
  const maxWater = useMemo(() => Math.max(...dailyAggregates.map((d) => d.waterM3), 10), [dailyAggregates]);
  const maxFertilizer = useMemo(() => Math.max(...dailyAggregates.map((d) => d.fertilizerKg), 10), [dailyAggregates]);
  const maxDiesel = useMemo(() => Math.max(...dailyAggregates.map((d) => d.dieselLiters), 10), [dailyAggregates]);

  // Combined max for normalized single-axis viewing
  const overallMax = Math.max(maxWater, maxFertilizer, maxDiesel);

  // Overall Totals for the current selection
  const totals = useMemo(() => {
    return filteredLogs.reduce(
      (acc, log) => {
        acc.water += Number(log.waterM3) || 0;
        acc.fertilizer += Number(log.fertilizerKg) || 0;
        acc.diesel += Number(log.dieselLiters) || 0;
        acc.hours += Number(log.operatingHours) || 0;
        acc.cost += Number(log.costDzd) || 0;
        return acc;
      },
      { water: 0, fertilizer: 0, diesel: 0, hours: 0, cost: 0 }
    );
  }, [filteredLogs]);

  // Today's summary
  const todayDateStr = '2026-09-27';
  const todayLogs = useMemo(() => consumptionLogs.filter((l) => l.date === todayDateStr), [consumptionLogs]);
  const todayTotals = useMemo(() => {
    return todayLogs.reduce(
      (acc, log) => {
        acc.water += Number(log.waterM3) || 0;
        acc.fertilizer += Number(log.fertilizerKg) || 0;
        acc.diesel += Number(log.dieselLiters) || 0;
        acc.hours += Number(log.operatingHours) || 0;
        return acc;
      },
      { water: 0, fertilizer: 0, diesel: 0, hours: 0 }
    );
  }, [todayLogs]);

  // Orchard Status by Parcel alongside the resource consumption
  const orchardParcels: OrchardParcelStatus[] = useMemo(() => {
    const parcelsConfig = [
      {
        id: 'parcel-alpha',
        name: 'Grove Alpha (Ancient Centenarians)',
        arabicName: 'قطعة ألفا (الزيتون المعمر التراثي)',
        species: 'زيتون شملالي عريق',
        totalTrees: 1850,
        soilType: 'تربة طميية فيضية حمراء'
      },
      {
        id: 'parcel-beta',
        name: 'Grove Beta (Modern High-Yield)',
        arabicName: 'قطعة بيتا (الزيتون المكثف الحديث)',
        species: 'زيتون بيشولين عالي الإنتاجية',
        totalTrees: 1200,
        soilType: 'تربة متوسطية خصبة'
      },
      {
        id: 'parcel-gamma',
        name: 'Grove Gamma (Hedgerow)',
        arabicName: 'قطعة غاما (أسيجة أربيكينا الفائقة الكثافة)',
        species: 'زيتون أربيكينا (Arbequina)',
        totalTrees: 850,
        soilType: 'تربة رملية طميية جيدة التصريف'
      },
      {
        id: 'parcel-citrus',
        name: 'Citrus Orchard South Valley',
        arabicName: 'بستان الحمضيات والبرتقال المالطي',
        species: 'برتقال مالطي معصور (Blood Orange)',
        totalTrees: 250,
        soilType: 'تربة طينية رطبة غنية'
      },
      {
        id: 'parcel-fig',
        name: 'Fig Plantation West Terrace',
        arabicName: 'حقل التين المدرج الغربي',
        species: 'تين المونة المجفف',
        totalTrees: 100,
        soilType: 'مدرجات صخرية كلسية'
      }
    ];

    return parcelsConfig.map((p) => {
      // Find trees in this parcel
      const parcelTrees = trees.filter(
        (t) =>
          t.parcelZone.includes(p.name) ||
          t.parcelZone.includes(p.id.replace('parcel-', '')) ||
          (p.id === 'parcel-alpha' && t.parcelZone.includes('Alpha')) ||
          (p.id === 'parcel-beta' && t.parcelZone.includes('Beta')) ||
          (p.id === 'parcel-gamma' && t.parcelZone.includes('Gamma')) ||
          (p.id === 'parcel-citrus' && t.species.includes('Citrus')) ||
          (p.id === 'parcel-fig' && t.species.includes('Fig'))
      );

      const total = parcelTrees.length > 0 ? parcelTrees.length : 1;
      const healthy = parcelTrees.filter((t) => t.healthStatus === 'healthy').length;
      const needsAttn = parcelTrees.filter((t) => t.healthStatus === 'needs_attention').length;
      const diseased = parcelTrees.filter((t) => t.healthStatus === 'diseased').length;

      const avgSoil =
        parcelTrees.length > 0
          ? +(parcelTrees.reduce((acc, t) => acc + t.soilMoisturePct, 0) / parcelTrees.length).toFixed(1)
          : 38.5;

      const healthScore = Math.round((healthy / total) * 100);

      // Recent resource usage for this parcel
      const parcelLogs = consumptionLogs.filter(
        (l) => l.parcelZone.includes(p.name) || l.parcelZone.includes(p.arabicName) || (p.id === 'parcel-alpha' && l.parcelZone.includes('Alpha')) || (p.id === 'parcel-beta' && l.parcelZone.includes('Beta')) || (p.id === 'parcel-gamma' && l.parcelZone.includes('Gamma')) || (p.id === 'parcel-citrus' && l.parcelZone.includes('Citrus')) || (p.id === 'parcel-fig' && l.parcelZone.includes('Fig'))
      );

      const waterSum = parcelLogs.reduce((acc, l) => acc + (Number(l.waterM3) || 0), 0);
      const fertSum = parcelLogs.reduce((acc, l) => acc + (Number(l.fertilizerKg) || 0), 0);
      const dieselSum = parcelLogs.reduce((acc, l) => acc + (Number(l.dieselLiters) || 0), 0);

      // Active machinery on this parcel
      const activeMch = machinery
        .filter((m) => m.status === 'operating' && (m.assignedParcel.includes(p.name) || m.assignedParcel.includes('All Parcels')))
        .map((m) => m.name);

      let irrigationStatus: 'optimal' | 'deficit' | 'overirrigated' | 'scheduled' = 'optimal';
      if (avgSoil < 30) irrigationStatus = 'deficit';
      else if (avgSoil > 46) irrigationStatus = 'overirrigated';

      return {
        parcelId: p.id,
        parcelName: p.name,
        arabicName: p.arabicName,
        species: p.species,
        totalTrees: p.totalTrees,
        healthyTrees: healthy || Math.round(p.totalTrees * 0.9),
        needsAttentionTrees: needsAttn || Math.round(p.totalTrees * 0.08),
        diseasedTrees: diseased || Math.round(p.totalTrees * 0.02),
        avgSoilMoisturePct: avgSoil,
        irrigationStatus,
        lastWaterAppliedM3: +waterSum.toFixed(1),
        lastFertilizerAppliedKg: +fertSum.toFixed(1),
        recentDieselUsageLiters: +dieselSum.toFixed(1),
        activeMachinery: activeMch,
        healthScorePct: healthScore || 92
      };
    });
  }, [trees, consumptionLogs, machinery]);

  // Machinery fleet consumption summary
  const machineryConsumption = useMemo(() => {
    return machinery.map((mch) => {
      const logs = consumptionLogs.filter((l) => l.machineryId === mch.id);
      const dieselTotal = logs.reduce((acc, l) => acc + (Number(l.dieselLiters) || 0), 0);
      const waterTotal = logs.reduce((acc, l) => acc + (Number(l.waterM3) || 0), 0);
      const fertTotal = logs.reduce((acc, l) => acc + (Number(l.fertilizerKg) || 0), 0);
      const hoursTotal = logs.reduce((acc, l) => acc + (Number(l.operatingHours) || 0), 0);

      return {
        ...mch,
        totalDiesel: +dieselTotal.toFixed(1),
        totalWater: +waterTotal.toFixed(1),
        totalFertilizer: +fertTotal.toFixed(1),
        loggedHours: +hoursTotal.toFixed(1)
      };
    });
  }, [machinery, consumptionLogs]);

  // Submit new log
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMachine = machinery.find((m) => m.id === formData.machineryId);
    const machineryName = targetMachine ? targetMachine.name : 'آلية فلاحية';

    const diesel = parseFloat(formData.dieselLiters) || 0;
    const water = parseFloat(formData.waterM3) || 0;
    const fertilizer = parseFloat(formData.fertilizerKg) || 0;
    const hours = parseFloat(formData.operatingHours) || 1;
    const efficiency = hours > 0 ? +(diesel / hours).toFixed(2) : 8.0;
    const cost = Math.round(diesel * 50); // ~50 DZD/L standard subsidized agri-diesel

    onAddConsumptionLog({
      date: formData.date,
      machineryId: formData.machineryId,
      machineryName,
      parcelZone: formData.parcelZone,
      activityType: formData.activityType,
      waterM3: water,
      fertilizerKg: fertilizer,
      dieselLiters: diesel,
      operatingHours: hours,
      fuelEfficiencyLitersPerHour: efficiency,
      costDzd: cost,
      operator: formData.operator,
      notes: formData.notes
    });

    setIsLogModalOpen(false);
    onShowToast(
      '✅ تم تسجيل استهلاك الآلة بنجاح',
      `تم إدراج ${diesel} لتر ديزل و ${water} م³ ماء و ${fertilizer} كغ سماد للآلة (${machineryName}) بالقطعة ${formData.parcelZone}.`,
      'success'
    );
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <Gauge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>منظومة الحوكمة البيئية والإنتاجية • وحدة تتبع الموارد والآلات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              مراقبة استهلاك الموارد وحالة البستان
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
              تتبع الاستهلاك اليومي لـ <strong>مياه الري (م³)</strong>، <strong>الأسمدة والمغذيات (كغ)</strong>، و <strong>وقود الديزل (لتر)</strong> لأسطول الآلات الفلاحية بمستثمرة ميلة، مع المراقبة المتزامنة لمؤشرات رطوبة وصحة أشجار الزيتون في كل قطعة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl text-sm shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل استهلاك عملية فلاحية</span>
            </button>
          </div>
        </div>

        {/* 4 Live Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-200/80 dark:border-stone-800">
          {/* Water Metric */}
          <div className="bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/70 dark:border-cyan-800/50 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300">مياه السقي والرذاذ اليوم</span>
              <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-950 dark:text-cyan-100">
                {todayTotals.water.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400">متر مكعب (م³)</span>
            </div>
            <p className="text-[11px] text-cyan-800/80 dark:text-cyan-400/80 mt-1 flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>وفر 18% بفضل جدولة الري الليلي</span>
            </p>
          </div>

          {/* Fertilizer Metric */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">الأسمدة والمغذيات اليوم</span>
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-950 dark:text-emerald-100">
                {todayTotals.fertilizer.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">كيلوغرام (كغ)</span>
            </div>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>NPK ذائب + مستخلصات عضوية</span>
            </p>
          </div>

          {/* Diesel Metric */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">وقود الديزل اليوم</span>
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                <Fuel className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-950 dark:text-amber-100">
                {todayTotals.diesel.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">لتر (L)</span>
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>{todayTotals.hours.toFixed(1)} ساعة تشغيل للمعدات</span>
            </p>
          </div>

          {/* Machinery Fleet Status */}
          <div className="bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">جاهزية أسطول الآلات</span>
              <div className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                <Tractor className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {machinery.filter((m) => m.status === 'operating').length} / {machinery.length}
              </span>
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">آليات في الميدان</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>1 صيانة وقائية • 1 في وضع الانتظار</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Bar Chart Module ALONGSIDE Orchard Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Bar Chart & Historical Trends (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs transition-colors">
            {/* Chart Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    مخطط الاستهلاك اليومي المقارن
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    عرض بياني متزامن للأعمدة: ماء (م³)، سماد (كغ)، ديزل (لتر)
                  </p>
                </div>
              </div>

              {/* Timeframe & Metric Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Time Range */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
                  <button
                    onClick={() => setSelectedTimeframe('7d')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      selectedTimeframe === '7d'
                        ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    7 أيام
                  </button>
                  <button
                    onClick={() => setSelectedTimeframe('14d')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      selectedTimeframe === '14d'
                        ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    14 يوماً
                  </button>
                  <button
                    onClick={() => setSelectedTimeframe('all')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      selectedTimeframe === 'all'
                        ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    الشهر
                  </button>
                </div>

                {/* Metric Focus Filter */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
                  <button
                    onClick={() => setSelectedMetric('all')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      selectedMetric === 'all'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white font-bold shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setSelectedMetric('water')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      selectedMetric === 'water'
                        ? 'bg-cyan-500 text-white font-bold shadow-xs'
                        : 'text-cyan-700 dark:text-cyan-400'
                    }`}
                  >
                    ماء
                  </button>
                  <button
                    onClick={() => setSelectedMetric('fertilizer')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      selectedMetric === 'fertilizer'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    سماد
                  </button>
                  <button
                    onClick={() => setSelectedMetric('diesel')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      selectedMetric === 'diesel'
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    ديزل
                  </button>
                </div>
              </div>
            </div>

            {/* Legend & Summary Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-2 text-xs">
              <div className="flex items-center gap-4">
                {(selectedMetric === 'all' || selectedMetric === 'water') && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-cyan-500 shadow-xs"></span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">مياه الري (م³)</span>
                  </div>
                )}
                {(selectedMetric === 'all' || selectedMetric === 'fertilizer') && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 shadow-xs"></span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">سماد ومغذيات (كغ)</span>
                  </div>
                )}
                {(selectedMetric === 'all' || selectedMetric === 'diesel') && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-amber-500 shadow-xs"></span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">وقود الديزل (لتر)</span>
                  </div>
                )}
              </div>

              <div className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                المجموع: {totals.water.toFixed(0)} م³ ماء • {totals.fertilizer.toFixed(0)} كغ سماد • {totals.diesel.toFixed(0)} ل ديزل
              </div>
            </div>

            {/* Interactive SVG Bar Chart */}
            <div className="mt-4 relative bg-stone-50/70 dark:bg-stone-950/40 border border-stone-200/80 dark:border-stone-800 rounded-xl p-4 sm:p-6 overflow-x-auto">
              <div className="min-w-[500px]">
                {/* SVG Chart Graphic */}
                <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 border-b border-stone-300 dark:border-stone-700 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
                    <div className="border-b border-dashed border-stone-400 w-full"></div>
                    <div className="border-b border-dashed border-stone-400 w-full"></div>
                    <div className="border-b border-dashed border-stone-400 w-full"></div>
                    <div className="border-b border-dashed border-stone-400 w-full"></div>
                  </div>

                  {dailyAggregates.map((day) => {
                    const isHovered = activeHoverDate === day.date;
                    // Heights percentage relative to each metric's max or overall
                    const waterHeight = Math.max(8, (day.waterM3 / (selectedMetric === 'all' ? overallMax : maxWater)) * 100);
                    const fertHeight = Math.max(8, (day.fertilizerKg / (selectedMetric === 'all' ? overallMax : maxFertilizer)) * 100);
                    const dieselHeight = Math.max(8, (day.dieselLiters / (selectedMetric === 'all' ? overallMax : maxDiesel)) * 100);

                    return (
                      <div
                        key={day.date}
                        onMouseEnter={() => setActiveHoverDate(day.date)}
                        onMouseLeave={() => setActiveHoverDate(null)}
                        className={`flex-1 flex flex-col items-center h-full justify-end cursor-pointer group transition-transform ${
                          isHovered ? 'scale-105' : ''
                        }`}
                      >
                        {/* Hover Tooltip Popup */}
                        {isHovered && (
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30 bg-stone-900/95 dark:bg-black/95 text-white text-[11px] p-2.5 rounded-xl shadow-xl border border-stone-700 min-w-[200px] pointer-events-none backdrop-blur-xs">
                            <div className="font-bold border-b border-stone-700 pb-1 mb-1.5 flex justify-between text-emerald-400">
                              <span>{day.dayName} ({day.date})</span>
                              <span>{day.logCount} عمليات</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-cyan-300">
                                <span>💧 المياه المستهلكة:</span>
                                <span className="font-bold">{day.waterM3} م³</span>
                              </div>
                              <div className="flex justify-between text-emerald-300">
                                <span>🌿 الأسمدة المطبقة:</span>
                                <span className="font-bold">{day.fertilizerKg} كغ</span>
                              </div>
                              <div className="flex justify-between text-amber-300">
                                <span>⛽ وقود الديزل:</span>
                                <span className="font-bold">{day.dieselLiters} لتر</span>
                              </div>
                              <div className="flex justify-between text-stone-300 pt-1 border-t border-stone-800">
                                <span>⏱️ ساعات التشغيل:</span>
                                <span className="font-bold">{day.totalHours} س</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bar Group */}
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-1">
                          {/* Water Bar */}
                          {(selectedMetric === 'all' || selectedMetric === 'water') && (
                            <div
                              style={{ height: `${Math.min(100, waterHeight)}%` }}
                              className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                                isHovered ? 'bg-cyan-400 shadow-md ring-2 ring-cyan-300' : 'bg-cyan-500'
                              }`}
                              title={`ماء: ${day.waterM3} م³`}
                            ></div>
                          )}

                          {/* Fertilizer Bar */}
                          {(selectedMetric === 'all' || selectedMetric === 'fertilizer') && (
                            <div
                              style={{ height: `${Math.min(100, fertHeight)}%` }}
                              className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                                isHovered ? 'bg-emerald-400 shadow-md ring-2 ring-emerald-300' : 'bg-emerald-500'
                              }`}
                              title={`سماد: ${day.fertilizerKg} كغ`}
                            ></div>
                          )}

                          {/* Diesel Bar */}
                          {(selectedMetric === 'all' || selectedMetric === 'diesel') && (
                            <div
                              style={{ height: `${Math.min(100, dieselHeight)}%` }}
                              className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                                isHovered ? 'bg-amber-400 shadow-md ring-2 ring-amber-300' : 'bg-amber-500'
                              }`}
                              title={`ديزل: ${day.dieselLiters} لتر`}
                            ></div>
                          )}
                        </div>

                        {/* Day Label */}
                        <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400 mt-2 truncate w-full text-center">
                          {day.dayName.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart Footnote / Dynamic Insight */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 border-t border-stone-200/60 dark:border-stone-800">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    الرسم البياني يوضح الارتباط المباشر بين ساعات استخدام الجرارات وكمية الديزل المحروق ومردودية عمليات الرش والتسميد.
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  معدل الاستهلاك: {(totals.diesel / (totals.hours || 1)).toFixed(2)} لتر/ساعة
                </span>
              </div>
            </div>

            {/* Machinery Fleet Breakdown Mini Bar Chart */}
            <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Tractor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>توزيع استهلاك الوقود حسب الآلة الفلاحية</span>
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  إجمالي الديزل: {totals.diesel.toFixed(0)} لتر
                </span>
              </div>

              <div className="space-y-3">
                {machineryConsumption.map((mch) => {
                  const pct = totals.diesel > 0 ? (mch.totalDiesel / totals.diesel) * 100 : 0;
                  return (
                    <div key={mch.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{mch.name}</span>
                          <span className="text-[11px] text-stone-500 font-mono">({mch.model})</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-stone-600 dark:text-stone-400">{mch.loggedHours} س عمل</span>
                          <span className="font-bold text-amber-700 dark:text-amber-400">{mch.totalDiesel} لتر</span>
                          <span className="text-stone-400">({pct.toFixed(0)}%)</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden flex">
                        <div
                          style={{ width: `${Math.min(100, pct)}%` }}
                          className="bg-amber-500 rounded-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Operations Log Table */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  سجل العمليات والاستهلاك الميداني الأخير
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                عرض {filteredLogs.length} سجلات ميدانية
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400">
                    <th className="py-2.5 px-3 font-semibold">التاريخ</th>
                    <th className="py-2.5 px-3 font-semibold">الآلة الفلاحية</th>
                    <th className="py-2.5 px-3 font-semibold">القطعة المستهدفة</th>
                    <th className="py-2.5 px-3 font-semibold">نوع النشاط</th>
                    <th className="py-2.5 px-3 font-semibold text-cyan-700 dark:text-cyan-400">ماء (م³)</th>
                    <th className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">سماد (كغ)</th>
                    <th className="py-2.5 px-3 font-semibold text-amber-700 dark:text-amber-400">ديزل (ل)</th>
                    <th className="py-2.5 px-3 font-semibold">السائق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {filteredLogs.slice(0, 7).map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">{log.date}</td>
                      <td className="py-2.5 px-3 font-semibold whitespace-nowrap">{log.machineryName}</td>
                      <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400 whitespace-nowrap">{log.parcelZone}</td>
                      <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">{log.activityType}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-700 dark:text-cyan-400 whitespace-nowrap">
                        {log.waterM3 > 0 ? `${log.waterM3} م³` : '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        {log.fertilizerKg > 0 ? `${log.fertilizerKg} كغ` : '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                        {log.dieselLiters} ل
                      </td>
                      <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">{log.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: ALONGSIDE ORCHARD STATUS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Orchard Status Overview Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Trees className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    حالة البستان والأشجار الحالية
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    مؤشرات حيوية متصلة بالموارد المطبقة في كل قطعة
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {farm.totalTrees} شجرة
              </span>
            </div>

            {/* Farm-wide Health Gauge summary */}
            <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200/60 dark:border-stone-800 text-center">
              <div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">سليمة ومثمرة</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {farm.healthyTrees}
                </span>
                <span className="text-[10px] text-emerald-700 block font-mono">
                  {((farm.healthyTrees / farm.totalTrees) * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">تحت العناية والري</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {farm.needsAttentionTrees}
                </span>
                <span className="text-[10px] text-amber-700 block font-mono">
                  {((farm.needsAttentionTrees / farm.totalTrees) * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">تحت العلاج الحيوي</span>
                <span className="text-lg font-black text-red-600 dark:text-red-400">
                  {farm.diseasedTrees}
                </span>
                <span className="text-[10px] text-red-700 block font-mono">
                  {((farm.diseasedTrees / farm.totalTrees) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Parcel Cards List with Live Resource Impact */}
            <div className="space-y-4 mt-5">
              {orchardParcels.map((parcel) => {
                const isOptimal = parcel.irrigationStatus === 'optimal';
                const isDeficit = parcel.irrigationStatus === 'deficit';

                return (
                  <div
                    key={parcel.parcelId}
                    className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/60 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-3"
                  >
                    {/* Header: Name and Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {parcel.arabicName}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {parcel.species} • {parcel.totalTrees} شجرة
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isOptimal
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                            : isDeficit
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                            : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-300'
                        }`}
                      >
                        {isOptimal ? 'رطوبة مثالية' : isDeficit ? 'عجز مائي طفيف' : 'ري مبرمج'}
                      </span>
                    </div>

                    {/* Soil Moisture & Health Bar */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white dark:bg-stone-800 p-2 rounded-lg border border-stone-200/60 dark:border-stone-700">
                        <span className="text-stone-500 dark:text-stone-400 block text-[10px]">رطوبة التربة</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-sm font-black text-stone-900 dark:text-stone-100">
                            {parcel.avgSoilMoisturePct}%
                          </span>
                          <span className="text-[10px] text-stone-400">/ 45% سعة حقلية</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-stone-800 p-2 rounded-lg border border-stone-200/60 dark:border-stone-700">
                        <span className="text-stone-500 dark:text-stone-400 block text-[10px]">مؤشر صحة القطعة</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {parcel.healthScorePct}%
                          </span>
                          <span className="text-[10px] text-emerald-500">سليمة</span>
                        </div>
                      </div>
                    </div>

                    {/* Resources Consumed on this parcel */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-300">
                        <span>إجمالي الموارد الموجهة لهذه القطعة:</span>
                        <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                          {parcel.recentDieselUsageLiters} لتر ديزل
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-600 dark:text-stone-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-cyan-500" />
                          <span>مياه: {parcel.lastWaterAppliedM3} م³</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Sprout className="w-3 h-3 text-emerald-500" />
                          <span>سماد: {parcel.lastFertilizerAppliedKg} كغ</span>
                        </span>
                      </div>
                    </div>

                    {/* Active Machinery on Site */}
                    {parcel.activeMachinery.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                        <Tractor className="w-3.5 h-3.5 text-emerald-600" />
                        <span>آلات نشطة الآن بالقطعة:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {parcel.activeMachinery.join('، ')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fleet Status Roster */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Tractor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>حالة أسطول الآلات الفلاحية ومستويات الوقود</span>
              </h3>
              <span className="text-xs text-stone-500">{machinery.length} آليات</span>
            </div>

            <div className="space-y-3">
              {machinery.map((mch) => {
                const isOp = mch.status === 'operating';
                const isMaint = mch.status === 'maintenance';

                return (
                  <div
                    key={mch.id}
                    className="p-3 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100">{mch.name}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isOp
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isMaint
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {isOp ? 'في العمل الميداني' : isMaint ? 'صيانة دورية' : 'في المستودع'}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
                        <span>السائق: {mch.currentOperator}</span>
                        <span>•</span>
                        <span>{mch.assignedParcel.split('(')[0]}</span>
                      </div>
                    </div>

                    <div className="text-left font-mono">
                      <div className="flex items-center gap-1 text-stone-800 dark:text-stone-200 font-bold">
                        <Fuel className="w-3.5 h-3.5 text-amber-500" />
                        <span>{mch.currentFuelLevelPct}%</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block">
                        {(mch.fuelCapacityLiters * (mch.currentFuelLevelPct / 100)).toFixed(0)} لتر
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Log New Consumption Record */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  تسجيل استهلاك عملية فلاحية جديدة
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                {/* Machinery Select */}
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">الآلة الفلاحية</label>
                  <select
                    value={formData.machineryId}
                    onChange={(e) => setFormData({ ...formData, machineryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {machinery.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.model})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Parcel */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">القطعة الفلاحية</label>
                <select
                  value={formData.parcelZone}
                  onChange={(e) => setFormData({ ...formData, parcelZone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Grove Alpha (Ancient Centenarians)">قطعة ألفا (الزيتون المعمر التراثي)</option>
                  <option value="Grove Beta (Modern High-Yield)">قطعة بيتا (الزيتون المكثف الحديث)</option>
                  <option value="Grove Gamma (Hedgerow)">قطعة غاما (أسيجة أربيكينا الفائقة الكثافة)</option>
                  <option value="Citrus Orchard South Valley">بستان الحمضيات والبرتقال المالطي</option>
                  <option value="Fig Plantation West Terrace">حقل التين المدرج الغربي</option>
                  <option value="Central Fertigation Hub (All Parcels)">شبكة التسميد والضخ المركزية</option>
                </select>
              </div>

              {/* Activity Description */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">طبيعة النشاط الميداني</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حرث سطحي، رش وقائي عضوي، تسميد بالتنقيط..."
                  value={formData.activityType}
                  onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Metrics: Water, Fertilizer, Diesel */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-cyan-700 dark:text-cyan-400 font-semibold mb-1">مياه (م³)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.waterM3}
                    onChange={(e) => setFormData({ ...formData, waterM3: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 dark:text-emerald-400 font-semibold mb-1">سماد (كغ)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={formData.fertilizerKg}
                    onChange={(e) => setFormData({ ...formData, fertilizerKg: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-amber-700 dark:text-amber-400 font-semibold mb-1">ديزل (لتر)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={formData.dieselLiters}
                    onChange={(e) => setFormData({ ...formData, dieselLiters: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              {/* Operating hours & Operator */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">ساعات التشغيل</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">اسم المشغل / السائق</label>
                  <input
                    type="text"
                    required
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  حفظ وتسجيل في المنظومة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
