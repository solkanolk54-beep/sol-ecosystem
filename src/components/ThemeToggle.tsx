import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'badge' | 'full';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'badge') {
    return (
      <button
        onClick={toggleTheme}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
          isDark
            ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border-emerald-700/60 shadow-inner'
            : 'bg-white/15 hover:bg-white/25 text-emerald-100 border-white/20'
        } ${className}`}
        title={isDark ? 'التبديل إلى النمط النهاري' : 'تفعيل نمط الفحص الميداني الليلي (حماية العين)'}
        aria-label="تبديل النمط الميداني الليلي"
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>النمط النهاري</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-cyan-200" />
            <span>النمط الليلي الميداني</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
        isDark
          ? 'bg-[#0E1C12] border-emerald-900/60 text-stone-200'
          : 'bg-stone-50 border-stone-200 text-stone-800'
      } ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
            isDark
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
          }`}>
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-extrabold text-xs">
              {isDark ? 'نمط الفحص الليلي الميداني (مفعل)' : 'النمط النهاري القياسي'}
            </div>
            <div className="text-[10px] text-stone-400">
              تقليل إجهاد العين أثناء تفقد البستان والحظائر ليلاً
            </div>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isDark ? 'bg-emerald-600' : 'bg-stone-300'
          }`}
          role="switch"
          aria-checked={isDark}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isDark ? '-translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  }

  // Default 'icon' button for Navbar
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all cursor-pointer border ${
        isDark
          ? 'bg-emerald-950/70 hover:bg-emerald-900/80 text-amber-300 border-emerald-800/80 shadow-inner'
          : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
      } ${className}`}
      title={isDark ? 'التبديل إلى النمط النهاري' : 'تفعيل نمط الفحص الميداني الليلي (حماية العين من التوهج)'}
      aria-label="تبديل مظهر الواجهة (نهاري / ليلي)"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-200" />
      )}
    </button>
  );
};
