import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  ChevronLeft,
  Trees,
  Activity,
  Bell
} from 'lucide-react';
import { ToastNotificationItem } from '../types';

interface ToastContainerProps {
  toasts: ToastNotificationItem[];
  onDismiss: (id: string) => void;
}

export const playNotificationSound = (type: 'danger' | 'warning' | 'info' | 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    if (type === 'danger') {
      // Urgent double tone
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.setValueAtTime(370, now + 0.12);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);
    } else if (type === 'warning') {
      // Gentle chime: 523Hz (C5) -> 659Hz (E5)
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.1);
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);
    } else {
      // Soft confirmation: 659Hz -> 880Hz
      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.setValueAtTime(880.0, now + 0.08);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.3);
    }
  } catch {
    // Audio autoplay restrictions or unsupported
  }
};

const SingleToast: React.FC<{
  toast: ToastNotificationItem;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 8000;
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const startProgress = progress;
    const remainingDuration = Math.max(0, (startProgress / 100) * duration);

    // Auto-dismiss after remaining duration
    const dismissTimer = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingDuration);

    // Smooth progress bar update
    const intervalMs = 50;
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.max(0, startProgress - (elapsed / duration) * 100);
      setProgress(newProgress);
    }, intervalMs);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progressTimer);
    };
  }, [duration, isPaused, onDismiss, toast.id]);

  const getTheme = () => {
    switch (toast.type) {
      case 'danger':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-[#1F1215]/95',
          text: 'text-rose-100',
          title: 'text-rose-300',
          badge: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
          iconBg: 'bg-rose-600/20 text-rose-400 border border-rose-500/40',
          bar: 'bg-rose-500',
          actionBtn: 'bg-rose-600 hover:bg-rose-500 text-white',
          Icon: AlertOctagon,
        };
      case 'warning':
        return {
          border: 'border-amber-500/50',
          bg: 'bg-[#1C170E]/95',
          text: 'text-amber-100',
          title: 'text-amber-300',
          badge: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
          iconBg: 'bg-amber-600/20 text-amber-400 border border-amber-500/40',
          bar: 'bg-amber-500',
          actionBtn: 'bg-amber-600 hover:bg-amber-500 text-stone-900 font-extrabold',
          Icon: AlertTriangle,
        };
      case 'success':
        return {
          border: 'border-emerald-500/50',
          bg: 'bg-[#0F1E15]/95',
          text: 'text-emerald-100',
          title: 'text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
          iconBg: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40',
          bar: 'bg-emerald-500',
          actionBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
          Icon: CheckCircle2,
        };
      default:
        return {
          border: 'border-blue-500/50',
          bg: 'bg-[#0F172A]/95',
          text: 'text-blue-100',
          title: 'text-blue-300',
          badge: 'bg-blue-500/20 text-blue-200 border border-blue-500/40',
          iconBg: 'bg-blue-600/20 text-blue-400 border border-blue-500/40',
          bar: 'bg-blue-500',
          actionBtn: 'bg-blue-600 hover:bg-blue-500 text-white',
          Icon: Info,
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.Icon;

  return (
    <div
      dir="rtl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto w-full relative rounded-2xl border ${theme.border} ${theme.bg} shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 transform translate-y-0 opacity-100 text-right font-sans`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Category / Alert Type Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg}`}>
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                  {toast.category === 'tree' ? (
                    <span className="inline-flex items-center gap-1">
                      <Trees className="w-3 h-3" />
                      الوحدة (أ): البستان
                    </span>
                  ) : toast.category === 'livestock' ? (
                    <span className="inline-flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      الوحدة (ب): البيطرة
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      النظام
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">{toast.timestamp}</span>
              </div>

              <h4 className={`text-sm font-extrabold tracking-tight ${theme.title}`}>
                {toast.title}
              </h4>

              <p className={`text-xs mt-1 leading-relaxed ${theme.text}`}>
                {toast.message}
              </p>

              {/* Action Button */}
              {toast.actionLabel && toast.onAction && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      onDismiss(toast.id);
                    }}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${theme.actionBtn}`}
                  >
                    <span>{toast.actionLabel}</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDismiss(toast.id)}
                    className="text-[11px] text-stone-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
                  >
                    تجاهل
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress countdown bar */}
      <div className="h-1 w-full bg-white/10">
        <div
          className={`h-full ${theme.bar} transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      dir="rtl"
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 left-4 sm:left-6 z-50 flex flex-col gap-2.5 max-w-[390px] sm:max-w-md w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
