import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = "Ha ocurrido un error al cargar el contenido.", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full text-red-400 gap-4 p-6 bg-red-900/10 rounded-xl border border-red-500/20">
      <AlertTriangle size={48} className="opacity-80" />
      <p className="text-center font-medium">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors text-sm border border-red-500/30"
        >
          Intentar nuevamente
        </button>
      )}
    </div>
  );
};
