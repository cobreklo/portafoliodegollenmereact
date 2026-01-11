import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full text-primary gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium animate-pulse">Cargando contenido...</p>
    </div>
  );
};
