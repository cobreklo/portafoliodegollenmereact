import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Video, 
  Music, 
  Camera, 
  Film, 
  MessageSquare, 
  Library, 
  Mail 
} from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { playHoverSound } = useAudio();

  const navItems = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/reel", icon: Video, label: "Reel" },
    { to: "/videoclips", icon: Music, label: "Videoclips" },
    { to: "/fotografias", icon: Camera, label: "Fotografías" },
    { to: "/cortometrajes", icon: Film, label: "Cortometrajes" },
    { to: "/resenas", icon: MessageSquare, label: "Reseñas" },
    { to: "/musica", icon: Library, label: "Música" },
    { to: "/contacto", icon: Mail, label: "Contacto" },
  ];

  if (!isOpen) return null;

  return (
    <div 
      id="mobile-menu" 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        id="mobile-menu-panel" 
        className="absolute top-4 left-4 w-72 h-[calc(100%-2rem)] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(120,255,255,0.15)] p-6 flex flex-col gap-5 transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            onMouseEnter={() => playHoverSound()}
            className={({ isActive }) =>
              `w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-lg transition-all hover:bg-white/20 hover:shadow-[0_0_12px_rgba(150,255,255,0.35)] active:scale-95 flex items-center gap-3 ${
                isActive ? 'border-primary text-primary shadow-[0_0_12px_rgba(150,255,255,0.35)]' : ''
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
