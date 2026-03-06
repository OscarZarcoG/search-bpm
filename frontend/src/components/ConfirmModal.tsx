'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-500" />,
      button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    info: {
      icon: <AlertTriangle className="w-6 h-6 text-indigo-500" />,
      button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    }
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#131b2f] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden shadow-indigo-500/10 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl ${style.bg}`}>
              {style.icon}
            </div>
            <button 
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 rounded-xl"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-sm font-medium text-white transition-all rounded-xl shadow-lg ${style.button}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
