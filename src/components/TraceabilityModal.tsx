import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, Award, CheckCircle2, Copy, Check } from 'lucide-react';
import { TraceabilityBatch } from '../types';

interface TraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: TraceabilityBatch[];
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  isOpen,
  onClose,
  batches,
}) => {
  const [selectedBatchCode, setSelectedBatchCode] = useState<string>(batches[0]?.batchCode || 'EVOO-2026-088');
  const [activeView, setActiveView] = useState<'generator' | 'public_passport'>('generator');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentBatch = batches.find((b) => b.batchCode === selectedBatchCode) || batches[0];
  const publicUrl = `https://sol-ecosystem.dz/passport/${currentBatch.batchCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getQualityParamLabel = (key: string) => {
    switch (key) {
      case 'acidity':
        return 'نسبة الحموضة الحرة';
      case 'peroxide':
        return 'مؤشر البيروكسيد';
      case 'polyphenols':
        return 'البوليفينول ومضادات الأكسدة';
      case 'sensoryProfile':
        return 'الملف الحسي والتذوق';
      case 'grading':
        return 'تصنيف الجودة';
      case 'phLevel':
        return 'درجة الحموضة pH';
      case 'antibioticFree':
        return 'خلو من المضادات الحيوية';
      case 'pastureFedDays':
        return 'مدة الرعي الطبيعي';
      default:
        return key;
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 font-sans text-right">
      <div className="bg-white text-stone-900 w-full max-w-2xl rounded-2xl overflow-hidden border border-emerald-100 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <QrCode className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                جواز السفر الرقمي وتتبع الجودة (Farm-to-Fork)
                <span className="text-[10px] bg-blue-400/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono">
                  الوحدة (ج)
                </span>
              </h3>
              <p className="text-xs text-blue-200">مولد رمز الاستجابة السريعة QR المشفر وجواز سفر المستهلك والرقابة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveView('generator')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'generator'
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>مولد رمز QR للدفعة</span>
          </button>
          <button
            onClick={() => setActiveView('public_passport')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'public_passport'
                ? 'border-[#0F5132] text-[#0F5132]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>معاينة جواز السفر الرقمي للمستهلك</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Batch Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div>
              <label className="text-xs font-bold text-stone-600 block">اختر دفعة الإنتاج النشطة:</label>
              <span className="text-xs text-stone-500">اختر المحصول المعتمد لتوليد شهادة المنشأ</span>
            </div>
            <select
              value={selectedBatchCode}
              onChange={(e) => setSelectedBatchCode(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-blue-500 text-right"
            >
              {batches.map((b) => (
                <option key={b.batchCode} value={b.batchCode}>
                  [{b.batchCode}] {b.productName}
                </option>
              ))}
            </select>
          </div>

          {activeView === 'generator' ? (
            /* VIEW 1: QR CODE GENERATOR */
            <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl border border-stone-200">
              {/* Scalable SVG QR Code Simulation */}
              <div className="bg-white p-4 rounded-2xl shadow-md border border-stone-200 flex flex-col items-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-44 h-44 fill-[#0F5132]"
                  shapeRendering="crispEdges"
                >
                  {/* Outer Frame Top-Left */}
                  <rect x="5" y="5" width="28" height="28" fill="#0F5132" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="#0F5132" />

                  {/* Outer Frame Top-Right */}
                  <rect x="67" y="5" width="28" height="28" fill="#0F5132" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="#0F5132" />

                  {/* Outer Frame Bottom-Left */}
                  <rect x="5" y="67" width="28" height="28" fill="#0F5132" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="#0F5132" />

                  {/* Simulated Data Matrix Bits */}
                  <rect x="38" y="8" width="5" height="5" />
                  <rect x="48" y="12" width="6" height="5" />
                  <rect x="40" y="22" width="8" height="4" />
                  <rect x="54" y="24" width="5" height="5" />
                  <rect x="8" y="40" width="6" height="5" />
                  <rect x="20" y="44" width="7" height="6" />
                  <rect x="34" y="38" width="10" height="10" />
                  <rect x="48" y="42" width="6" height="6" />
                  <rect x="60" y="38" width="8" height="7" />
                  <rect x="75" y="44" width="12" height="5" />
                  <rect x="42" y="58" width="7" height="8" />
                  <rect x="56" y="55" width="6" height="6" />
                  <rect x="68" y="68" width="8" height="8" />
                  <rect x="82" y="72" width="7" height="7" />
                  <rect x="40" y="75" width="8" height="8" />
                  <rect x="55" y="80" width="8" height="8" />
                </svg>

                <div className="mt-3 text-center">
                  <span className="text-[11px] font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {currentBatch.batchCode}
                  </span>
                  <div className="text-[10px] text-stone-400 mt-1">رمز QR معتمد رقمياً ومحمي</div>
                </div>
              </div>

              {/* Batch Metadata & Share */}
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-extrabold text-base text-stone-900">{currentBatch.productName}</h4>
                  <p className="text-xs text-stone-500">{currentBatch.variety} • دفعة إنتاج المستثمرة</p>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
                  <div className="flex justify-between">
                    <span className="text-stone-400">تاريخ الجني:</span>
                    <span className="font-semibold">{currentBatch.harvestDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">التعبئة والمعالجة:</span>
                    <span className="font-semibold">{currentBatch.processingDate.split('(')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">حجم الدفعة:</span>
                    <span className="font-semibold">{currentBatch.quantity}</span>
                  </div>
                </div>

                {/* Direct Link Copier */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 w-full font-mono select-all text-left"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="نسخ الرابط"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setActiveView('public_passport')}
                    className="px-3 py-1.5 rounded-lg bg-[#0F5132] hover:bg-[#165B37] text-white text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    معاينة الجواز
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW 2: PUBLIC-FACING RESULT VIEW (CONSUMER PASSPORT) */
            <div className="bg-[#FAFDF9] border-2 border-emerald-700/30 rounded-2xl p-6 space-y-6 shadow-sm">
              {/* Trust Badge Header */}
              <div className="text-center space-y-1 border-b border-emerald-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>منظومة SOL الرقمية • شهادة منشأ وجودة أصلية</span>
                </div>
                <h3 className="font-black text-xl text-stone-900 pt-2">{currentBatch.productName}</h3>
                <p className="text-xs text-stone-600">
                  المنشأ: {currentBatch.origin} (خط العرض: {currentBatch.farmCoordinates.lat}، خط الطول: {currentBatch.farmCoordinates.lng})
                </p>
              </div>

              {/* Quality Parameters Cards */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#0F5132]" />
                  <span>معايير الجودة والتحاليل المخبرية المعتمدة</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(currentBatch.qualityParameters).map(([key, val]) => (
                    <div key={key} className="bg-white p-3 rounded-xl border border-emerald-200/60 shadow-xs">
                      <div className="text-[11px] text-stone-500">{getQualityParamLabel(key)}</div>
                      <div className="text-sm font-bold text-stone-800 mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Blockchain Seal */}
              <div className="bg-emerald-900 text-white rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>شهادات الاعتماد العضوي والجودة:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentBatch.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-800/80 border border-emerald-600/50 text-[11px] px-2.5 py-0.5 rounded-full text-emerald-100"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-emerald-800 text-[10px] font-mono text-emerald-300/80 truncate text-left">
                  الختم الرقمي المشفر: {currentBatch.blockchainTx}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
