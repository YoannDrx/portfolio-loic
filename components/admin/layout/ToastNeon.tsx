'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { adminToast } from '@/lib/animations';
import { cn } from '@/lib/utils';

/* ============================================
   TYPES
   ============================================ */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastNeonProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

/* ============================================
   TOAST CONFIG
   ============================================ */

const toastConfig: Record<
  ToastType,
  {
    icon: typeof CheckCircle;
    bgClass: string;
    borderClass: string;
    glowClass: string;
    iconColor: string;
    progressColor: string;
  }
> = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    glowClass: 'shadow-[0_0_20px_rgba(92,228,98,0.3)]',
    iconColor: 'text-emerald-400',
    progressColor: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30',
    glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    iconColor: 'text-red-400',
    progressColor: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    glowClass: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    iconColor: 'text-amber-400',
    progressColor: 'bg-amber-500',
  },
  info: {
    icon: Info,
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    glowClass: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    iconColor: 'text-cyan-400',
    progressColor: 'bg-cyan-500',
  },
};

/* ============================================
   SINGLE TOAST COMPONENT
   ============================================ */

function ToastNeon({ toast, onDismiss }: ToastNeonProps) {
  const [progress, setProgress] = useState(100);
  const config = toastConfig[toast.type];
  const Icon = config.icon;
  const duration = toast.duration || 5000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, toast.id, onDismiss]);

  return (
    <motion.div
      layout
      variants={adminToast}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'relative overflow-hidden rounded-xl border backdrop-blur-xl',
        'min-w-[320px] max-w-[420px]',
        config.bgClass,
        config.borderClass,
        config.glowClass
      )}
    >
      {/* Main content */}
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm text-muted-foreground">{toast.message}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={cn(
                'mt-2 text-sm font-medium transition-colors',
                config.iconColor,
                'hover:brightness-125'
              )}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[var(--glass-active)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--glass-active)]">
        <motion.div
          className={cn('h-full', config.progressColor)}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

/* ============================================
   TOAST CONTAINER
   ============================================ */

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({
  toasts,
  onDismiss,
  position = 'bottom-right',
}: ToastContainerProps) {
  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-[var(--admin-z-toast)] flex flex-col gap-3',
        positionClasses[position]
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastNeon key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ============================================
   TOAST HOOK
   ============================================ */

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  const success = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, message, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, message, ...options });
  };

  return {
    toasts,
    addToast,
    dismissToast,
    dismissAll,
    success,
    error,
    warning,
    info,
  };
}

/* ============================================
   STANDALONE TOAST FUNCTIONS
   (For use outside React components)
   ============================================ */

// This will be connected to a global toast provider
let globalToastHandler: ReturnType<typeof useToast> | null = null;

export function setGlobalToastHandler(handler: ReturnType<typeof useToast>) {
  globalToastHandler = handler;
}

export const toast = {
  success: (title: string, message?: string) => {
    globalToastHandler?.success(title, message);
  },
  error: (title: string, message?: string) => {
    globalToastHandler?.error(title, message);
  },
  warning: (title: string, message?: string) => {
    globalToastHandler?.warning(title, message);
  },
  info: (title: string, message?: string) => {
    globalToastHandler?.info(title, message);
  },
};

/* ============================================
   EXPORTS
   ============================================ */

export { ToastNeon };
export default ToastContainer;
