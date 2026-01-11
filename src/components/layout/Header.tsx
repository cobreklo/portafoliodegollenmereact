import React, { useState } from 'react';
import { Menu, X, MonitorPlay } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { MobileMenu } from './MobileMenu';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { playHoverSound, playMinimizeSound, playNudgeSound } = useAudio();

  const handleMinimize = () => {
    playMinimizeSound();
    // Logic for minimize effect could be added here if we want to hide the window
  };

  const handleMaximize = () => {
    playNudgeSound();
    // Add 'is-nudging' class to glass-panel
    const panel = document.querySelector('.glass-panel');
    if (panel) {
        panel.classList.remove('is-nudging');
        void (panel as HTMLElement).offsetWidth; // trigger reflow
        panel.classList.add('is-nudging');
        setTimeout(() => {
            panel.classList.remove('is-nudging');
        }, 600);
    }
  };

  return (
    <>
      <header className="flex-none px-8 py-5 border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-gradient-to-br from-white/20 to-black/40 border border-white/30 flex items-center justify-center shadow-lg">
              <MonitorPlay className="text-[#0df2f2] drop-shadow-[0_0_10px_#0df2f2]" size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md !bg-none !border-none !shadow-none !p-0">Hugo Jaque</h1>
              <p className="text-xs text-primary font-medium tracking-widest uppercase opacity-80">Portafolio 2007</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            id="mobile-menu-btn"
            className="md:hidden w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center transition-all hover:shadow-[0_0_12px_rgba(120,255,255,0.5)] active:scale-90"
            onClick={() => setIsMobileMenuOpen(true)}
            onMouseEnter={() => playHoverSound()}
          >
            <Menu className="text-white" />
          </button>

          <div className="flex gap-3 hidden md:flex">
            <div 
                className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer window-control-minimize"
                onClick={handleMinimize}
            >
              <div className="w-3 h-1 bg-white/60"></div>
            </div>
            <div 
                className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer window-control-maximize"
                onClick={handleMaximize}
            >
              <div className="w-3 h-3 border-2 border-white/60"></div>
            </div>
            <div 
                className="w-8 h-8 rounded-md bg-red-500/80 border border-red-400 flex items-center justify-center hover:bg-red-500 cursor-pointer shadow-inner"
                onClick={() => window.open('https://www.instagram.com/degollenme/', '_blank')}
            >
              <X className="text-white" size={14} />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
