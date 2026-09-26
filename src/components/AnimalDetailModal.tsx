import React, { useState } from 'react';
import { X, ShieldCheck, Calendar, Activity, Scale, HeartPulse, Stethoscope, Plus } from 'lucide-react';
import { LivestockAnimal } from '../types';

interface AnimalDetailModalProps {
  animal: LivestockAnimal | null;
  onClose: () => void;
  onLogWeight: (animalId: string, newWeight: number) => void;
}

export const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  animal,
  onClose,
  onLogWeight,
}) => {
  const [newWeightInput, setNewWeightInput] = useState('');
  const [isAddingWeight, setIsAddingWeight] = useState(false);

  if (!animal) return null;

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 0) {
      onLogWeight(animal.id, val);
      setNewWeightInput('');
      setIsAddingWeight(false);
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'healthy':
        return 'سليم وبصحة جيدة';
      case 'lactating':
        return 'مدرّة للحليب';
      case 'pregnant':
        return 'حامل ومتابعة بيطرياً';
      default:
        return condition;
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans text-right">
      <div className="bg-white text-stone-900 w-full max-w-xl rounded-2xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Activity className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{animal.nameOrAlias}</h3>
                <span className="text-xs font-mono bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
                  {animal.tagRfid}
                </span>
              </div>
              <p className="text-xs text-blue-200">
                {animal.breed} • {animal.species === 'cattle' ? 'أبقار' : 'أغنام'} ({animal.gender === 'female' ? 'أنثى' : 'ذكر'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                <span>الوزن الحالي</span>
              </div>
              <div className="text-lg font-black text-slate-900 mt-1">{animal.currentWeightKg} كغ</div>
              <div className="text-[10px] text-slate-400">العمر: {animal.ageMonths} شهر</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                <span>الحالة الصحية</span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1 text-emerald-700">
                {getConditionText(animal.healthCondition)}
              </div>
              <div className="text-[10px] text-slate-400">المرعى: {animal.pastureZone}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                <span>معدل الإنتاج</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1">
                {animal.currentYieldValue} {animal.yieldUnit === 'L/day' ? 'لتر/يوم' : animal.yieldUnit === 'g/day' ? 'غ/يوم' : animal.yieldUnit}
              </div>
              <div className="text-[10px] text-slate-400">قياس بيومتري دوري</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>تاريخ الولادة</span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">{animal.birthDate}</div>
              <div className="text-[10px] text-slate-400">سلالة نقية موثقة</div>
            </div>
          </div>

          {/* Feed Plan */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <div className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>خطة التغذية العضوية والحصص اليومية:</span>
            </div>
            <p className="text-xs text-stone-700 font-medium">{animal.feedPlan}</p>
          </div>

          {/* Weight History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>سجل أوزان الميزان الرقمي RFID</span>
              </h4>
              <button
                onClick={() => setIsAddingWeight(!isAddingWeight)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة وزن جديد</span>
              </button>
            </div>

            {isAddingWeight && (
              <form onSubmit={handleWeightSubmit} className="mb-3 flex items-center gap-2 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                <input
                  type="number"
                  step="0.5"
                  placeholder="أدخل الوزن بالكغ (مثال: 648)"
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="bg-white border border-blue-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 w-full focus:outline-none focus:border-blue-500 text-right"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer"
                >
                  حفظ في السجل
                </button>
              </form>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {animal.weightHistory.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-slate-400">{item.date}</div>
                  <div className="text-sm font-bold text-slate-800">{item.weightKg} كغ</div>
                  {idx > 0 && (
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      +{ (item.weightKg - animal.weightHistory[idx - 1].weightKg).toFixed(1) } كغ
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vaccination Schedule */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#1E3A8A]" />
              <span>الرعاية البيطرية وجدول التلقيحات</span>
            </h4>
            <div className="space-y-2">
              {animal.vaccinationSchedule.map((vac, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        vac.status === 'completed' ? 'text-emerald-600' : 'text-amber-500'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{vac.vaccine}</div>
                      <div className="text-[10px] text-slate-400">التاريخ المبرمج: {vac.date}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      vac.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vac.status === 'completed' ? 'مكتمل' : 'قادم'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
