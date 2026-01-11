import React from 'react';

interface SectionContainerProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ title, icon, children, className = "" }: SectionContainerProps) {
  return (
    <div className={`glass-panel p-6 rounded-xl border border-white/10 bg-black/40 ${className}`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold text-white/90">{title}</h2>
      </div>
      {children}
    </div>
  );
}
