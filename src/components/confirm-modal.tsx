"use client";
import { AlertCircle, X } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ zIndex: 9999, minHeight: '100vh', minWidth: '100vw' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#ffe472' }}
            >
              <AlertCircle className="h-7 w-7" style={{ color: '#fc0055' }} />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-base text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all hover:border-gray-400"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-5 py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: '#fc0055',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e00050'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fc0055'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

