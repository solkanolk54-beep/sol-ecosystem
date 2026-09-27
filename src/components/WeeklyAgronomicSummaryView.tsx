import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  Copy,
  Trees,
  Activity,
  Droplets,
  Fuel,
  Sprout,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Award,
  ArrowUpRight,
  TrendingUp,
  Clock,
  MapPin,
  ChevronLeft,
  Filter,
  FileSpreadsheet,
  Edit3,
  Sliders,
  BarChart3,
  Table,
  CheckSquare,
  Square,
  Check,
  X,
  FileCheck
} from 'lucide-react';
import { Farm, Tree, LivestockAnimal, ResourceConsumptionLog, WeeklyAgronomicReport } from '../types';
import { HISTORICAL_WEEKLY_REPORTS, buildDynamicWeeklySummary } from '../data/weeklySummaryData';
import {
  downloadAgronomicAuditCsv,
  generateWeeklyAgronomicAuditCsv,
  getViewFilterArabicLabel,
  AgronomicViewFilter
} from '../utils/agronomicAuditCsv';

interface WeeklyAgronomicSummaryViewProps {
  farm: Farm;
  trees: Tree[];
  livestock: LivestockAnimal[];
  consumptionLogs: ResourceConsumptionLog[];
  onSelectTree?: (tree: Tree) => void;
  onSelectAnimal?: (animal: LivestockAnimal) => void;
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'danger') => void;
}

export const WeeklyAgronomicSummaryView: React.FC<WeeklyAgronomicSummaryViewProps> = ({
  farm,
  trees,
  livestock,
  consumptionLogs,
  onSelectTree: _onSelectTree,
  onSelectAnimal: _onSelectAnimal,
  onShowToast
}) => {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [activeSectionFilter, setActiveSectionFilter] = useState<'all' | 'trees' | 'livestock' | 'resources' | 'actions'>('all');
  const [customAgronomistNotes, setCustomAgronomistNotes] = useState<string>('');
  const [isNotesEditing, setIsNotesEditing] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [auditScope, setAuditScope] = useState<'current' | 'all'>('current');
  const [includeChartSeries, setIncludeChartSeries] = useState<boolean>(true);
  const [includeDetailedLedgers, setIncludeDetailedLedgers] = useState<boolean>(true);
  const [includePhytosanitary, setIncludePhytosanitary] = useState<boolean>(true);
  const [includeActionDirectives, setIncludeActionDirectives] = useState<boolean>(true);
  const [includeAuditSignoff, setIncludeAuditSignoff] = useState<boolean>(true);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Generate dynamic report for selected week
  const report: WeeklyAgronomicReport =
    selectedWeekIndex === 0
      ? buildDynamicWeeklySummary(farm, trees, livestock, consumptionLogs, 0)
      : HISTORICAL_WEEKLY_REPORTS[selectedWeekIndex] || HISTORICAL_WEEKLY_REPORTS[0];

  // Helper: Trigger Print dialog for PDF generation
  const handlePrintPdf = () => {
    window.print();
    onShowToast?.(
      'جاهز للطباعة أو الحفظ كـ PDF',
      'اختر "حفظ بتنسيق PDF" من نافذة الطباعة المنبثقة لتحميل التقرير الكامل.',
      'info'
    );
  };

  // Helper: Download JSON export
  const handleDownloadJson = () => {
    const dataToExport = {
      ...report,
      customAgronomistObservations: customAgronomistNotes || undefined,
      exportedAt: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${report.reportId}_AgriSummary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onShowToast?.(
      'تم تحميل التقرير الرقمي (JSON)',
      `تم تصدير وثيقة التقرير الزراعي ${report.reportId} بصيغة JSON المعيارية.`,
      'success'
    );
  };

  // Helper: Direct One-Click CSV Audit Export for Current View
  const handleDownloadCsv = (filterOverride?: AgronomicViewFilter) => {
    const filterToUse = filterOverride ?? activeSectionFilter;
    const result = downloadAgronomicAuditCsv(report, {
      viewFilter: filterToUse,
      includeChartSeries: true,
      includeDetailedLedgers: true,
      includePhytosanitary: true,
      includeActionDirectives: true,
      includeAuditSignoff: true,
      customNotes: customAgronomistNotes
    });

    const filterName = getViewFilterArabicLabel(filterToUse);
    onShowToast?.(
      'تم تصدير ملف التدقيق الفلاحي (CSV)',
      `تم تنزيل بيانات ومخططات (${filterName}) بنجاح للتدقيق المهني (${result.rowCount} سطر).`,
      'success'
    );
  };

  // Helper: Custom Audit Modal Export
  const handleAuditModalExport = () => {
    const filterToUse: AgronomicViewFilter = auditScope === 'current' ? activeSectionFilter : 'all';
    const result = downloadAgronomicAuditCsv(report, {
      viewFilter: filterToUse,
      includeChartSeries,
      includeDetailedLedgers,
      includePhytosanitary,
      includeActionDirectives,
      includeAuditSignoff,
      customNotes: customAgronomistNotes
    });

    setIsAuditModalOpen(false);
    const filterName = getViewFilterArabicLabel(filterToUse);
    onShowToast?.(
      'تم إنشاء وتنزيل وثيقة التدقيق (CSV)',
      `تم تصدير ${result.fileName} بنجاح (${result.sectionsCount} أقسام رقابية و${result.rowCount} سطر).`,
      'success'
    );
  };

  // Helper: Copy CSV text to Clipboard for immediate paste into Excel / Sheets
  const handleCopyAuditCsv = async () => {
    const filterToUse: AgronomicViewFilter = auditScope === 'current' ? activeSectionFilter : 'all';
    const result = generateWeeklyAgronomicAuditCsv(report, {
      viewFilter: filterToUse,
      includeChartSeries,
      includeDetailedLedgers,
      includePhytosanitary,
      includeActionDirectives,
      includeAuditSignoff,
      customNotes: customAgronomistNotes
    });

    try {
      await navigator.clipboard.writeText(result.csvContent);
      onShowToast?.(
        'تم نسخ جدول CSV للحافظة',
        `تم نسخ ${result.rowCount} سطر من بيانات ومخططات التدقيق للّصق في برامج الجداول الإلكترونية.`,
        'success'
      );
    } catch {
      onShowToast?.('تنبيه', 'تعذر النسخ التلقائي للجدول.', 'warning');
    }
  };

  // Helper: Copy executive briefing to clipboard
  const handleCopySummary = async () => {
    const summaryText = `📋 *التقرير الزراعي الأسبوعي الآلي - منظومة SOL الرقمية*
🏛 المستثمرة: ${report.estateName} (ميلة، حوض بني هارون)
📅 الأسبوع: ${report.weekNumber} (${report.startDate} إلى ${report.endDate})
🎖 التقييم العام: ${report.overallAgronomicScore}/100 - ${report.overallRatingLabel}

🌿 *1. صحة الأشجار:*
- إجمالي الأشجار: ${report.treeHealthSection.totalTrees} شجرة (نسبة الصحة العامة: ${report.treeHealthSection.overallHealthPct}%)
- الأشجار السليمة: ${report.treeHealthSection.healthyCount} | تحت العناية: ${report.treeHealthSection.needsAttentionCount} | المصابة: ${report.treeHealthSection.diseasedCount}
- متوسط مؤشر الخضرة (NDVI): ${report.treeHealthSection.avgNdviScore}

🐑 *2. الثروة الحيوانية:*
- إجمالي الرؤوس: ${report.livestockSection.totalLivestock} (أبقار: ${report.livestockSection.cattleCount}، أغنام: ${report.livestockSection.sheepCount})
- معدل النمو اليومي: +${report.livestockSection.avgDailyGainGrams} غ/يوم
- الزيادة الأسبوعية الإجمالية: +${report.livestockSection.totalFlockGainKg} كغ
- إنتاج الحليب اليومي: ${report.livestockSection.dailyMilkYieldLiters} لتر/يوم

💧 *3. كفاءة الموارد:*
- مياه الري المستهلكة: ${report.resourceEfficiencySection.totalWaterM3} م³ (وفر مباشر 28.5% مقارنة بالمعيار)
- الديزل الفلاحي: ${report.resourceEfficiencySection.totalDieselLiters} لتر (${report.resourceEfficiencySection.totalOperatingHours} ساعة تشغيل)
- الأسمدة: ${report.resourceEfficiencySection.totalFertilizerKg} كغ تسميد عضوي ومعدني دقيق

✍ *المشرف الفني:* ${report.supervisingAgronomist.name}
رمز التحقق الرقمي: ${report.supervisingAgronomist.digitalSignatureHash.substring(0, 24)}...`;

    try {
      await navigator.clipboard.writeText(summaryText);
      onShowToast?.(
        'تم نسخ الملخص التنفيذي',
        'تم نسخ ملخص التقرير الميداني بنجاح للمشاركة عبر WhatsApp أو البريد الإلكتروني.',
        'success'
      );
    } catch {
      onShowToast?.('تنبيه', 'تعذر النسخ التلقائي للحافظة.', 'warning');
    }
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* 1. TOP INTERACTIVE TOOLBAR (HIDDEN ON PRINT) */}
      <div className="print:hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0F5132]/10 text-[#0F5132] dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center border border-[#0F5132]/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  التقرير الزراعي الأسبوعي الآلي
                </h1>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Automated Weekly Agronomic Summary
                </span>
                <span className="text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-md">
                  {report.reportId}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                تجميع آلي شامل لبيانات صحة الأشجار، تغيرات أوزان المواشي، ومؤشرات كفاءة الموارد مع إمكانية التصدير كـ PDF وCSV.
              </p>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#13653f] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              title="طباعة التقرير أو حفظه كـ PDF عبر متصفح الويب"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>

            {/* Split Audit CSV Export Button */}
            <div className="flex items-center rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shadow-xs overflow-hidden">
              <button
                onClick={() => handleDownloadCsv()}
                className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-extrabold transition-all cursor-pointer"
                title={`تصدير بيانات ومخططات التدقيق للعرض الحالي [${getViewFilterArabicLabel(activeSectionFilter)}] كملف CSV`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>تصدير تدقيق العرض (CSV)</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold mr-1">
                  {activeSectionFilter === 'all'
                    ? 'الكل'
                    : activeSectionFilter === 'trees'
                    ? 'الأشجار'
                    : activeSectionFilter === 'livestock'
                    ? 'المواشي'
                    : activeSectionFilter === 'resources'
                    ? 'الموارد'
                    : 'التوصيات'}
                </span>
              </button>
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="px-2.5 py-2.5 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border-r border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                title="فتح خيارات تصدير التدقيق المهني والمخططات المتقدمة"
              >
                <Sliders className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
              </button>
            </div>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold border border-stone-300 dark:border-stone-700 transition-all cursor-pointer"
              title="تنزيل ملف بيانات JSON"
            >
              <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>تحميل JSON</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold border border-stone-300 dark:border-stone-700 transition-all cursor-pointer"
              title="نسخ ملخص سريع للحافظة"
            >
              <Share2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>نسخ الملخص</span>
            </button>
          </div>
        </div>

        {/* Toolbar Controls: Week Selector & Section Tabs */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Week Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0F5132] dark:text-emerald-400" />
              فترة التقرير:
            </span>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              <button
                onClick={() => setSelectedWeekIndex(0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedWeekIndex === 0
                    ? 'bg-white dark:bg-stone-900 text-[#0F5132] dark:text-emerald-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                الأسبوع 39 الحالي (21-27 سبتمبر 2026)
              </button>
              <button
                onClick={() => setSelectedWeekIndex(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedWeekIndex === 1
                    ? 'bg-white dark:bg-stone-900 text-[#0F5132] dark:text-emerald-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                الأسبوع 38 المنصرم (14-20 سبتمبر 2026)
              </button>
            </div>
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveSectionFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSectionFilter === 'all'
                  ? 'bg-[#0F5132] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              التقرير المتكامل (الكل)
            </button>
            <button
              onClick={() => setActiveSectionFilter('trees')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeSectionFilter === 'trees'
                  ? 'bg-[#0F5132] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Trees className="w-3.5 h-3.5" />
              <span>صحة الأشجار</span>
            </button>
            <button
              onClick={() => setActiveSectionFilter('livestock')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeSectionFilter === 'livestock'
                  ? 'bg-[#0F5132] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>أوزان المواشي</span>
            </button>
            <button
              onClick={() => setActiveSectionFilter('resources')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeSectionFilter === 'resources'
                  ? 'bg-[#0F5132] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>كفاءة الموارد</span>
            </button>
            <button
              onClick={() => setActiveSectionFilter('actions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeSectionFilter === 'actions'
                  ? 'bg-[#0F5132] text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>توصيات المهندس</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN REPORT CANVAS (PDF-STYLE DOCUMENT LAYOUT) */}
      <div
        ref={printAreaRef}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0 print:m-0 print:text-black print:bg-white"
        id="weekly-agronomic-report-document"
      >
        {/* DOCUMENT HEADER (OFFICIAL AGRONOMIC AUDIT STYLING) */}
        <div className="border-b-2 border-stone-900 dark:border-stone-700 pb-6 print:border-stone-900">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            {/* Algerian AgriTech Republic Header */}
            <div>
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest print:text-stone-600">
                الجمهورية الجزائرية الديمقراطية الشعبية • وزارة الفلاحة والتنمية الريفية
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1 print:text-stone-950">
                {report.estateName}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1 mt-0.5 print:text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-[#0F5132] dark:text-emerald-400 print:text-black" />
                <span>{report.estateRegion} • المساحة الإجمالية: {report.estateHectares} هكتار</span>
              </p>
            </div>

            {/* Official Audit Stamp & QR Code representation */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-left bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 print:border-stone-300">
                <div className="text-[10px] font-mono text-stone-500 uppercase">وثيقة معتمدة • DOC-AUDIT</div>
                <div className="text-xs font-black font-mono text-[#0F5132] dark:text-emerald-400 print:text-stone-900">
                  {report.reportId}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  تاريخ الإصدار: {report.generatedDate}
                </div>
              </div>

              {/* Verified Seal Badge */}
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#0F5132] dark:border-emerald-500 flex flex-col items-center justify-center text-center p-1 bg-emerald-50 dark:bg-emerald-950/40 rotate-6 print:rotate-0 print:border-stone-900">
                <Award className="w-4 h-4 text-[#0F5132] dark:text-emerald-400 print:text-black" />
                <span className="text-[8px] font-black text-[#0F5132] dark:text-emerald-300 print:text-black uppercase">
                  معتمد
                </span>
                <span className="text-[7px] text-emerald-700 dark:text-emerald-400 print:text-black">
                  SOL 2026
                </span>
              </div>
            </div>
          </div>

          {/* Date Range & Metadata Banner */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-800/40 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs print:bg-stone-100 print:border-stone-300">
            <div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">الفترة الزمنية:</span>
              <strong className="text-stone-900 dark:text-white font-extrabold print:text-black">
                {report.startDate} إلى {report.endDate}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">رقم الأسبوع الزراعي:</span>
              <strong className="text-[#0F5132] dark:text-emerald-400 font-extrabold print:text-black">
                الأسبوع {report.weekNumber} (سنة {report.year})
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">المهندس المشرف:</span>
              <strong className="text-stone-900 dark:text-white font-extrabold print:text-black">
                د. سليم بن عثمان
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">مؤشر البخر المرجعي (ET₀):</span>
              <strong className="text-stone-900 dark:text-white font-extrabold print:text-black">
                {report.weatherSummary.et0ReferenceMm} مم/يوم • {report.weatherSummary.avgTemperatureC}° م
              </strong>
            </div>
          </div>
        </div>

        {/* 1. EXECUTIVE KPI SUMMARY & SCORECARD */}
        {(activeSectionFilter === 'all' || activeSectionFilter === 'actions') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2 print:text-black">
                <span className="w-2.5 h-6 rounded-md bg-[#0F5132] print:bg-black inline-block"></span>
                <span>الملخص التنفيذي ومؤشر الأداء الزراعي الشامل</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">المؤشر العام:</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800 print:border-black print:text-black">
                  {report.overallAgronomicScore}/100 • {report.overallRatingLabel}
                </span>
              </div>
            </div>

            {/* 4 Pillars Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: Tree Health Index */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl print:border-stone-300 print:bg-stone-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                    <Trees className="w-3.5 h-3.5" />
                    <span>صحة الأشجار</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
                    {report.treeHealthSection.healthyCount} سليمة
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-2 print:text-black">
                  {report.treeHealthSection.overallHealthPct}%
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                  <span>مؤشر الخضرة NDVI:</span>
                  <strong>{report.treeHealthSection.avgNdviScore}</strong>
                </div>
              </div>

              {/* Card 2: Livestock Growth */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl print:border-stone-300 print:bg-stone-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>نمو القطيع (ADG)</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900 px-2 py-0.5 rounded-full">
                    +{report.livestockSection.totalFlockGainKg} كغ أسبوعياً
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-2 print:text-black flex items-center gap-1">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>+{report.livestockSection.avgDailyGainGrams}</span>
                  <span className="text-xs font-normal text-amber-700">غ/يوم</span>
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                  حالة جسمانية BCS: <strong>{report.livestockSection.avgBcsScore}/5.0</strong>
                </div>
              </div>

              {/* Card 3: Water Efficiency */}
              <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/60 p-4 rounded-2xl print:border-stone-300 print:bg-stone-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-800 dark:text-cyan-300 font-bold flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>ترشيد مياه الري</span>
                  </span>
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900 px-2 py-0.5 rounded-full">
                    FAO-56
                  </span>
                </div>
                <div className="text-2xl font-black text-cyan-950 dark:text-cyan-100 mt-2 print:text-black">
                  {report.resourceEfficiencySection.totalWaterM3} م³
                </div>
                <div className="text-[11px] text-cyan-700 dark:text-cyan-400 mt-0.5">
                  وفر مباشر: <strong>116 م³ (28.5% ترشيد)</strong>
                </div>
              </div>

              {/* Card 4: Fuel & Fleet Efficiency */}
              <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-2xl print:border-stone-300 print:bg-stone-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-700 dark:text-stone-300 font-bold flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" />
                    <span>ديزل الآلات</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    {report.resourceEfficiencySection.totalOperatingHours} س تشغيل
                  </span>
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-2 print:text-black">
                  {report.resourceEfficiencySection.totalDieselLiters} لتر
                </div>
                <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                  معدل كفاءة: <strong>4.71 لتر/ساعة</strong>
                </div>
              </div>
            </div>

            {/* Agronomic Executive Narrative */}
            <div className="bg-stone-50 dark:bg-stone-800/40 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed print:bg-stone-50 print:border-stone-300 print:text-black">
              <strong className="block text-stone-900 dark:text-white font-extrabold mb-1 print:text-black">
                تشخيص المهندس الزراعي العام للأسبوع:
              </strong>
              <p>{report.executiveSummary}</p>
            </div>
          </div>
        )}

        {/* 2. TREE HEALTH & ORCHARD SECTION */}
        {(activeSectionFilter === 'all' || activeSectionFilter === 'trees') && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800 print:border-stone-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2 print:text-black">
                <span className="w-2.5 h-6 rounded-md bg-emerald-600 print:bg-black inline-block"></span>
                <span>1. صحة الأشجار والغطاء النباتي (Tree Health Telemetry)</span>
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    سليمة: {report.treeHealthSection.healthyCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    عناية: {report.treeHealthSection.needsAttentionCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    مصابة: {report.treeHealthSection.diseasedCount}
                  </span>
                </div>
                <button
                  onClick={() => handleDownloadCsv('trees')}
                  className="print:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                  title="تصدير بيانات ومخططات الأشجار كـ CSV للتدقيق المهني"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>تصدير تدقيق الأشجار (CSV)</span>
                </button>
              </div>
            </div>

            {/* Health Distribution Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${(report.treeHealthSection.healthyCount / report.treeHealthSection.totalTrees) * 100}%` }}
                className="bg-emerald-500 h-full"
                title="سليمة"
              ></div>
              <div
                style={{ width: `${(report.treeHealthSection.needsAttentionCount / report.treeHealthSection.totalTrees) * 100}%` }}
                className="bg-amber-500 h-full"
                title="تحتاج عناية"
              ></div>
              <div
                style={{ width: `${(report.treeHealthSection.diseasedCount / report.treeHealthSection.totalTrees) * 100}%` }}
                className="bg-rose-500 h-full"
                title="مصابة"
              ></div>
            </div>

            {/* Parcels Agronomic Breakdown Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 print:border-stone-300">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 print:bg-stone-100 print:text-black">
                  <tr>
                    <th className="py-2.5 px-3 font-extrabold">القطعة / البستان</th>
                    <th className="py-2.5 px-3 font-extrabold">الصنف والشجيرات</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">الصحة %</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">مؤشر NDVI</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">رطوبة التربة</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">الري المطبق</th>
                    <th className="py-2.5 px-3 font-extrabold">التدخلات والوقاية النباتية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300 print:divide-stone-200 print:text-black">
                  {report.treeHealthSection.parcels.map((parcel) => (
                    <tr key={parcel.parcelId} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      <td className="py-2.5 px-3 font-black text-stone-900 dark:text-white print:text-black">
                        {parcel.arabicName}
                        <span className="block text-[10px] text-stone-400 font-mono">{parcel.parcelName}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div>{parcel.cropVariety}</div>
                        <span className="text-[10px] text-stone-500">{parcel.treeCount} شجرة</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-black px-2 py-0.5 rounded-full text-[11px] ${
                            parcel.healthScorePct >= 90
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : parcel.healthScorePct >= 80
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {parcel.healthScorePct}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {parcel.ndviVigorIndex}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-bold ${
                            parcel.avgSoilMoisturePct < 25
                              ? 'text-rose-600 dark:text-rose-400 font-black'
                              : 'text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {parcel.avgSoilMoisturePct}%
                        </span>
                        {parcel.waterDeficitM3 > 0 && (
                          <span className="block text-[9px] text-rose-500 font-extrabold">
                            عجز: {parcel.waterDeficitM3} م³
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        {parcel.waterAppliedM3} م³
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
                        {parcel.activeTreatments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phytosanitary Interventions Sub-card */}
            <div className="bg-stone-50 dark:bg-stone-800/30 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs print:border-stone-300">
              <strong className="text-stone-900 dark:text-white font-extrabold flex items-center gap-1.5 print:text-black">
                <ShieldCheck className="w-4 h-4 text-[#0F5132] dark:text-emerald-400" />
                <span>سجل التدخلات والمعالجات الفيتوصحية المعتمدة خلال الأسبوع:</span>
              </strong>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                {report.treeHealthSection.phytosanitaryInterventions.map((phyto) => (
                  <div
                    key={phyto.id}
                    className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 print:border-stone-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-stone-900 dark:text-white">{phyto.parcelZone}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                        {phyto.date}
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-700 dark:text-rose-400 font-bold">
                      الهدف: {phyto.targetPathogen}
                    </div>
                    <div className="text-[11px] text-stone-600 dark:text-stone-300">
                      المادة: {phyto.treatmentProduct} ({phyto.dosage})
                    </div>
                    <div className="text-[10px] text-stone-400 mt-1">
                      {phyto.agronomistApproval}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. LIVESTOCK WEIGHT CHANGES & HERD PERFORMANCE */}
        {(activeSectionFilter === 'all' || activeSectionFilter === 'livestock') && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800 print:border-stone-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2 print:text-black">
                <span className="w-2.5 h-6 rounded-md bg-amber-600 print:bg-black inline-block"></span>
                <span>2. تطور أوزان وصحة الثروة الحيوانية (Livestock Growth & BCS)</span>
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <span>إجمالي الرؤوس: <strong>{report.livestockSection.totalLivestock}</strong></span>
                  <span>•</span>
                  <span>حليب الأبقار: <strong>{report.livestockSection.dailyMilkYieldLiters} لتر/يوم</strong></span>
                  <span>•</span>
                  <span>الامتثال البيطري: <strong className="text-emerald-600">100%</strong></span>
                </div>
                <button
                  onClick={() => handleDownloadCsv('livestock')}
                  className="print:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                  title="تصدير سجلات أوزان المواشي والنمو اليومي كـ CSV للتدقيق المهني"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>تصدير تدقيق المواشي (CSV)</span>
                </button>
              </div>
            </div>

            {/* Individual Animal Weigh-in Ledger */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 print:border-stone-300">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 print:bg-stone-100 print:text-black">
                  <tr>
                    <th className="py-2.5 px-3 font-extrabold">الرمز والاسم (RFID)</th>
                    <th className="py-2.5 px-3 font-extrabold">النوع والسلالة</th>
                    <th className="py-2.5 px-3 font-extrabold">المرعى / الحظيرة</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">الوزن السابق</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">الوزن الحالي</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">التغير الأسبوعي</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">معدل النمو (ADG)</th>
                    <th className="py-2.5 px-3 font-extrabold text-center">BCS</th>
                    <th className="py-2.5 px-3 font-extrabold">الحالة والإنتاجية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300 print:divide-stone-200 print:text-black">
                  {report.livestockSection.animals.map((animal) => (
                    <tr key={animal.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      <td className="py-2.5 px-3 font-bold text-stone-900 dark:text-white print:text-black">
                        <div>{animal.nameOrAlias}</div>
                        <span className="text-[10px] text-stone-400 font-mono">{animal.tagRfid}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold">
                          {animal.species === 'cattle' ? 'أبقار' : 'أغنام'}
                        </span>
                        <div className="text-[10px] text-stone-500">{animal.breed}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-stone-600 dark:text-stone-400">
                        {animal.pastureZone}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {animal.previousWeightKg} كغ
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black text-stone-900 dark:text-white print:text-black">
                        {animal.currentWeightKg} كغ
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-black bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>+{animal.weightChangeKg} كغ</span>
                          <span className="text-[9px] font-normal text-stone-500">
                            (+{animal.weightChangePct}%)
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#0F5132] dark:text-emerald-400">
                        +{animal.adgGramsDay} غ/يوم
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-black">
                        {animal.bodyConditionScore}
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        <div className="font-semibold text-stone-800 dark:text-stone-200">
                          {animal.healthCondition}
                        </div>
                        {animal.yieldInfo && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            {animal.yieldInfo}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feed & Pasture Efficiency Notes */}
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed print:bg-stone-50 print:border-stone-300 print:text-black">
              <strong className="block font-black mb-1">
                كفاءة التحويل الغذائي ومراعي التلال الشرقية والسهوب:
              </strong>
              <p>{report.livestockSection.feedEfficiencySummary}</p>
            </div>
          </div>
        )}

        {/* 4. RESOURCE EFFICIENCY & MACHINERY CONSUMPTION */}
        {(activeSectionFilter === 'all' || activeSectionFilter === 'resources') && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800 print:border-stone-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2 print:text-black">
                <span className="w-2.5 h-6 rounded-md bg-cyan-600 print:bg-black inline-block"></span>
                <span>3. كفاءة استهلاك الموارد المزرعية والآلات (Resource Efficiency)</span>
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-3">
                  <span>مؤشر الكفاءة: <strong className="text-emerald-600">{report.resourceEfficiencySection.overallEfficiencyIndex}%</strong></span>
                  <span>•</span>
                  <span>تكلفة الأسبوع: <strong>{report.resourceEfficiencySection.totalOperatingCostDzd.toLocaleString()} دج</strong></span>
                  <span>•</span>
                  <span>خفض الكربون: <strong>{report.resourceEfficiencySection.carbonOffsetKgCo2} كغ CO₂-eq</strong></span>
                </div>
                <button
                  onClick={() => handleDownloadCsv('resources')}
                  className="print:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 text-[11px] font-bold border border-cyan-200 dark:border-cyan-800 transition-colors cursor-pointer"
                  title="تصدير بيانات ترشيد الموارد ومعايير FAO-56 كـ CSV للتدقيق المهني"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>تصدير تدقيق الموارد (CSV)</span>
                </button>
              </div>
            </div>

            {/* 3 Metrics Deep-Dive Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {report.resourceEfficiencySection.metrics.map((metric) => (
                <div
                  key={metric.resourceType}
                  className="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5 text-xs print:border-stone-300 print:bg-stone-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
                      {metric.resourceType === 'water' && <Droplets className="w-4 h-4 text-cyan-600" />}
                      {metric.resourceType === 'fertilizer' && <Sprout className="w-4 h-4 text-emerald-600" />}
                      {metric.resourceType === 'diesel' && <Fuel className="w-4 h-4 text-amber-600" />}
                      <span>{metric.nameArabic}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      كفاءة {metric.efficiencyPct}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-stone-500 block">المستهلك الفعلي:</span>
                      <div className="text-xl font-black text-stone-900 dark:text-white print:text-black">
                        {metric.totalConsumed} {metric.unit}
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-stone-500 block">المعيار الإقليمي:</span>
                      <div className="text-sm font-bold text-stone-600 dark:text-stone-400">
                        {metric.targetBenchmark} {metric.unit}
                      </div>
                    </div>
                  </div>

                  {/* Progress vs Benchmark Bar */}
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (metric.totalConsumed / metric.targetBenchmark) * 100)}%` }}
                      className={`h-full ${
                        metric.resourceType === 'water'
                          ? 'bg-cyan-500'
                          : metric.resourceType === 'fertilizer'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    ></div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 border-t border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {metric.savingsVsBaseline} {metric.savingsUnit}
                    </span>
                    <span>{metric.costDzd.toLocaleString()} دج</span>
                  </div>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                    {metric.statusNote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AGRONOMIC ACTION PLAN & IMMEDIATE DIRECTIVES */}
        {(activeSectionFilter === 'all' || activeSectionFilter === 'actions') && (
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800 print:border-stone-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2 print:text-black">
                <span className="w-2.5 h-6 rounded-md bg-purple-600 print:bg-black inline-block"></span>
                <span>4. التدخلات المبرمجة وتوصيات المهندس للأسبوع القادم</span>
              </h3>
              <button
                onClick={() => handleDownloadCsv('actions')}
                className="print:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                title="تصدير خطة التدخلات والتوصيات الفلاحية كـ CSV للتدقيق المهني"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>تصدير خطة التوصيات (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.actionItems.map((action) => (
                <div
                  key={action.id}
                  className="p-4 rounded-2xl border bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 flex flex-col justify-between gap-2.5 text-xs print:border-stone-300 print:bg-stone-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          action.priority === 'high'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : action.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {action.priority === 'high' ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <strong className="text-stone-900 dark:text-white font-extrabold block text-xs print:text-black">
                          {action.title}
                        </strong>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400">
                          الهدف: {action.targetParcelOrSector}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        action.priority === 'high'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                      }`}
                    >
                      {action.priority === 'high' ? 'أولوية قصوى' : 'أولوية متوسطة'}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    {action.description}
                  </p>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-[10px] text-stone-500">
                    <span>المكلف: <strong>{action.assignedEngineer}</strong></span>
                    <span>الموعد الأقصى: <strong className="font-mono text-stone-800 dark:text-stone-200">{action.deadlineDate}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Notes Section (Editable by Field Agronomist) */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs print:border-stone-300">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5 print:text-black">
                  <Edit3 className="w-4 h-4 text-[#0F5132] dark:text-emerald-400" />
                  <span>ملاحظات وإضافات المهندس الزراعي الحقلية (تظهر في النسخة المطبوعة):</span>
                </span>
                <button
                  onClick={() => setIsNotesEditing(!isNotesEditing)}
                  className="print:hidden text-[11px] text-[#0F5132] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  {isNotesEditing ? 'إغلاق المحرر' : 'تعديل الملاحظات'}
                </button>
              </div>

              {isNotesEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={customAgronomistNotes}
                    onChange={(e) => setCustomAgronomistNotes(e.target.value)}
                    placeholder="أدخل أي ملاحظات ميدانية إضافية مثل: فحص صمامات الري في القطاع الشرقي، تقرير فحص مخبري للتربة، ملاحظات الطقس..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0F5132] outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsNotesEditing(false);
                        onShowToast?.('تم حفظ الملاحظات', 'تم تضمين ملاحظاتك الحقلية في مسودة التقرير.', 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0F5132] text-white font-bold text-xs cursor-pointer"
                    >
                      تثبيت الملاحظات في التقرير
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 italic">
                  {customAgronomistNotes ||
                    'لم يتم تدوين ملاحظات استثنائية إضافية لهذا الأسبوع. المنظومة تعمل وفق الجدول الزراعي المعتمد لحوض بني هارون.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. OFFICIAL AGRONOMIC CERTIFICATION & SIGNATURE BLOCK */}
        <div className="border-t-2 border-stone-900 dark:border-stone-700 pt-6 mt-8 print:border-stone-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-600 dark:text-stone-400 print:text-black">
            {/* Column 1: Agronomist Signature */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">توقيع ومصادقة المهندس الزراعي:</span>
              <div className="font-black text-stone-900 dark:text-white text-sm print:text-black">
                {report.supervisingAgronomist.name}
              </div>
              <div className="text-[11px] text-stone-500">
                {report.supervisingAgronomist.title}
              </div>
              <div className="text-[10px] font-mono text-stone-500">
                رقم الاعتماد: {report.supervisingAgronomist.licenseNumber}
              </div>
              <div className="pt-2">
                <div className="w-36 h-10 border border-stone-300 dark:border-stone-700 rounded-lg flex items-center justify-center text-[10px] text-stone-400 font-serif italic print:border-black">
                  [Signé électroniquement]
                </div>
              </div>
            </div>

            {/* Column 2: Digital Security & Verification Hash */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">التوثيق الرقمي والبلوكشين:</span>
              <div className="text-[10px] font-mono break-all bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg border border-stone-200 dark:border-stone-700 print:border-stone-300">
                {report.supervisingAgronomist.digitalSignatureHash}
              </div>
              <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>شهادة تدقيق زراعي رقمية موثقة بسجل SOL الوطني</span>
              </div>
            </div>

            {/* Column 3: Official Seal Representation */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-center print:border-stone-300">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-700 dark:border-emerald-500 flex flex-col items-center justify-center p-1 print:border-black">
                <Sprout className="w-5 h-5 text-emerald-700 dark:text-emerald-400 print:text-black" />
                <span className="text-[8px] font-black tracking-tight text-stone-900 dark:text-white print:text-black">
                  مستثمرة ميلة
                </span>
                <span className="text-[7px] text-emerald-800 dark:text-emerald-300 print:text-black">
                  AgriTech 2026
                </span>
              </div>
              <span className="text-[9px] text-stone-500 font-bold mt-1.5">
                خاتم التدقيق الفلاحي الرسمي
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROFESSIONAL AUDIT CSV EXPORT MODAL */}
      {isAuditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <span>تصدير بيانات ومخططات التدقيق الفلاحي (CSV)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Professional Audit
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    توليد ملف CSV معتمد وفق المعايير الرقابية يدمج سلاسل الرسوم البيانية ومؤشرات الأداء التجميعية.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-stone-900 dark:text-white block">
                1. تحديد نطاق التدقيق المطلوب للتصدير:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option A: Current View Only */}
                <div
                  onClick={() => setAuditScope('current')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    auditScope === 'current'
                      ? 'border-[#0F5132] bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-[#0F5132]/30'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#0F5132] dark:text-emerald-400" />
                      <span>بيانات ومخططات العرض الحالي</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {activeSectionFilter === 'all'
                        ? 'التقرير الشامل'
                        : activeSectionFilter === 'trees'
                        ? 'صحة الأشجار'
                        : activeSectionFilter === 'livestock'
                        ? 'أوزان المواشي'
                        : activeSectionFilter === 'resources'
                        ? 'كفاءة الموارد'
                        : 'التوصيات'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 leading-tight">
                    يصدر الجداول والرسوم البيانية المفلترة حالياً في الشاشة ({getViewFilterArabicLabel(activeSectionFilter)}).
                  </p>
                </div>

                {/* Option B: Full Master Audit */}
                <div
                  onClick={() => setAuditScope('all')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    auditScope === 'all'
                      ? 'border-[#0F5132] bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-[#0F5132]/30'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#0F5132] dark:text-emerald-400" />
                      <span>التدقيق الزراعي الشامل المتكامل</span>
                    </span>
                    <span className="text-[10px] bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-bold">
                      5 أقسام كاملة
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 leading-tight">
                    سجل شامل يضم صحة الأشجار، أوزان المواشي، كفاءة الموارد، خطة التدخلات، ومصادقة البلوكشين.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkboxes: Audit Components */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-stone-900 dark:text-white block">
                2. المكونات الرقابية والمخططات المضمنة:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeChartSeries}
                    onChange={(e) => setIncludeChartSeries(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      جداول الرسوم البيانية وسلاسل التوزيع
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDetailedLedgers}
                    onChange={(e) => setIncludeDetailedLedgers(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      السجلات والمصفوفات الميدانية المفصلة
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePhytosanitary}
                    onChange={(e) => setIncludePhytosanitary(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      سجل التدخلات الفيتوصحية والبيطرية
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAuditSignoff}
                    onChange={(e) => setIncludeAuditSignoff(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      إقرار المصادقة القانونية والتوقيع الرقمي
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Audit Certificate Box & File Preview */}
            <div className="bg-stone-50 dark:bg-stone-800/40 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300">
                <span>تنسيق الترميز: <strong>UTF-8 BOM (متوافق مع Microsoft Excel العربي)</strong></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">معتمد رسمياً SOL-AUDIT</span>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                بصمة التوثيق: <span className="font-mono text-[10px]">{report.supervisingAgronomist.digitalSignatureHash.substring(0, 32)}...</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={handleCopyAuditCsv}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4 text-stone-500" />
                <span>نسخ جدول CSV للحافظة</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAuditModalExport}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#13653f] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>تنزيل ملف CSV المعتمد الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-SPECIFIC CSS RULES INJECTED SAFELY */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          header, nav, .print\\:hidden {
            display: none !important;
          }
          #weekly-agronomic-report-document {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
};
