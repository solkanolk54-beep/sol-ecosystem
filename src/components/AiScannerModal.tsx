import React, { useState } from 'react';
import { X, Camera, Sparkles, CheckCircle2, ShieldAlert, RefreshCw, FileText } from 'lucide-react';
import { DIAGNOSTIC_PRESETS } from '../data/mockData';
import { DiagnosticResult, Tree } from '../types';

interface AiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trees: Tree[];
  onAddTreatmentLog: (treeId: string, condition: string, treatment: string) => void;
}

export const AiScannerModal: React.FC<AiScannerModalProps> = ({
  isOpen,
  onClose,
  trees,
  onAddTreatmentLog,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [targetTreeId, setTargetTreeId] = useState<string>(trees[1]?.id || trees[0]?.id || '');
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPreset = DIAGNOSTIC_PRESETS[selectedPresetIndex];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDiagnosticResult(null);
    setLoggedSuccess(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      if (progress >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        setDiagnosticResult(currentPreset.result);
      } else {
        setScanProgress(progress);
      }
    }, 180);
  };

  const handleApplyTreatment = () => {
    if (!diagnosticResult || !targetTreeId) return;
    onAddTreatmentLog(
      targetTreeId,
      diagnosticResult.disease,
      diagnosticResult.recommendedTreatment.split('\n')[0] || diagnosticResult.recommendedTreatment
    );
    setLoggedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  const presetLabels = [
    { title: 'عينة 1: ورقة زيتون', desc: 'اشتباه مرض عين الطاووس' },
    { title: 'عينة 2: ثمرة زيتون', desc: 'اشتباه عفن الأنثراكنوز' },
    { title: 'عينة 3: غصن سليم', desc: 'عينات بستان ميلة المرجعية' },
  ];

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-sans text-right">
      <div className="bg-[#1A2E20] text-white w-full max-w-2xl rounded-2xl overflow-hidden border border-emerald-800 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F5132] border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                كاميرا الفحص والتشخيص بالذكاء الاصطناعي
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                  الوحدة (أ)
                </span>
              </h3>
              <p className="text-xs text-emerald-200">التعرف الفوري على أمراض أوراق وثمار الزيتون بحوض ميلة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Preset Selector */}
          <div>
            <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-2">
              اختر عينة للفحص المجهري والتحليل:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DIAGNOSTIC_PRESETS.map((_preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPresetIndex(idx);
                    setDiagnosticResult(null);
                    setLoggedSuccess(false);
                  }}
                  className={`p-2.5 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'border-emerald-400 bg-emerald-900/60 text-white shadow'
                      : 'border-emerald-800/60 bg-black/20 text-emerald-300 hover:bg-emerald-900/30'
                  }`}
                >
                  <div className="font-bold">{presetLabels[idx]?.title || `عينة ${idx + 1}`}</div>
                  <div className="text-[11px] opacity-80 truncate">{presetLabels[idx]?.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Viewfinder Preview */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border-2 border-emerald-600/60 flex items-center justify-center">
            {/* Visual Leaf Specimen Simulation */}
            <div className="absolute inset-0 flex items-center justify-center p-6 select-none pointer-events-none">
              {currentPreset.sampleType === 'peacock_spot' && (
                <div className="relative w-48 h-32 flex items-center justify-center">
                  <div className="w-40 h-16 bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 rounded-[50px/25px] transform -rotate-12 border border-emerald-600 shadow-lg relative overflow-hidden flex items-center justify-center">
                    <div className="absolute w-full h-0.5 bg-yellow-200/40"></div>
                    {/* Concentric Peacock Spots */}
                    <div className="w-6 h-6 rounded-full bg-yellow-400/80 border-2 border-amber-900 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-900"></div>
                    </div>
                    <div className="absolute right-8 top-3 w-5 h-5 rounded-full bg-yellow-400/80 border-2 border-amber-900 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-stone-900"></div>
                    </div>
                  </div>
                </div>
              )}

              {currentPreset.sampleType === 'anthracnose' && (
                <div className="relative flex items-center justify-center gap-3">
                  <div className="w-16 h-20 bg-gradient-to-b from-emerald-900 to-amber-950 rounded-[40px/50px] border border-amber-700/50 shadow-lg relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-amber-900/90 border border-orange-500/70 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    </div>
                  </div>
                  <div className="w-14 h-18 bg-gradient-to-b from-stone-800 to-amber-950 rounded-[35px/45px] border border-amber-800/50 shadow-lg relative flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-amber-950 border border-orange-600/70 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    </div>
                  </div>
                </div>
              )}

              {currentPreset.sampleType === 'healthy' && (
                <div className="relative w-48 h-32 flex items-center justify-center">
                  <div className="w-44 h-16 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 rounded-[50px/25px] transform -rotate-6 border border-emerald-300 shadow-xl relative overflow-hidden flex items-center justify-center">
                    <div className="absolute w-full h-0.5 bg-emerald-200/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Viewfinder Target Brackets */}
            <div className="absolute inset-8 border border-dashed border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

              {/* Scanning Laser Animation */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34D399] animate-bounce"></div>
              )}
            </div>

            {/* HUD Status Overlay */}
            <div className="absolute top-3 right-3 bg-black/70 px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>كاميرا 4K طيفية • تكبير مجهري 2X</span>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 rounded text-[11px] font-mono text-emerald-300 border border-emerald-800">
              حقل ميلة: القطعة ألفا
            </div>

            {/* Scanning Progress Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                <div className="text-sm font-bold text-white mb-2">جارٍ استخراج المعالم الطيفية وتحليل العينة بالذكاء الاصطناعي...</div>
                <div className="w-48 bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-emerald-300 font-mono mt-1">{scanProgress}%</div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          {!diagnosticResult && !isScanning && (
            <button
              onClick={handleStartScan}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-[#0F5132] hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>التقاط وتحليل العينة عبر نموذج الرؤية الحاسوبية</span>
            </button>
          )}

          {/* Analysis Result Card */}
          {diagnosticResult && (
            <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-white">{diagnosticResult.disease}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        diagnosticResult.severity === 'none'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : diagnosticResult.severity === 'severe'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {diagnosticResult.severity === 'none' ? 'سليمة تماماً' : `شدة الإصابة: ${diagnosticResult.severity}`}
                    </span>
                  </div>
                  <p className="text-xs italic text-emerald-300">{diagnosticResult.scientificName}</p>
                </div>

                <div className="text-left">
                  <div className="text-xs text-emerald-400 font-mono">دقة النموذج</div>
                  <div className="text-lg font-black text-emerald-300">
                    {(diagnosticResult.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="bg-black/30 p-2.5 rounded-lg border border-emerald-900/60 text-xs">
                <span className="font-semibold text-emerald-300">الأعراض المشخصة: </span>
                <span className="text-gray-200">{diagnosticResult.symptoms}</span>
              </div>

              {/* Recommended Treatment */}
              <div className="bg-[#0F5132]/60 p-3 rounded-lg border border-emerald-600/40 space-y-1 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>البروتوكول العلاجي الموصى به:</span>
                </div>
                <div className="text-gray-100 whitespace-pre-line pr-1">{diagnosticResult.recommendedTreatment}</div>
              </div>

              {/* Log to Tree action */}
              <div className="pt-2 border-t border-emerald-800 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                  <span className="text-xs text-emerald-300 whitespace-nowrap">ربط بالشجرة:</span>
                  <select
                    value={targetTreeId}
                    onChange={(e) => setTargetTreeId(e.target.value)}
                    className="w-full bg-black/40 border border-emerald-700 text-xs text-emerald-100 rounded-lg p-1.5 focus:outline-none focus:border-emerald-400 text-right"
                  >
                    {trees.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.tagCode} ({t.variety}) - {t.parcelZone}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleApplyTreatment}
                  disabled={loggedSuccess}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loggedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#8B4513] hover:bg-[#A0522D] text-amber-50 shadow'
                  }`}
                >
                  {loggedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم تسجيل المعالجة بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>تسجيل في السجل الزراعي للشجرة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
