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

export const Sidebar: React.FC = () => {
  const { playHoverSound } = useAudio();

  const navItems = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/reel", icon: Video, label: "Reel Principal" },
    { to: "/videoclips", icon: Music, label: "Videoclips" },
    { to: "/fotografias", icon: Camera, label: "Fotografías" },
    { to: "/cortometrajes", icon: Film, label: "Cortometrajes" },
    { to: "/resenas", icon: MessageSquare, label: "Reseñas" },
    { to: "/musica", icon: Library, label: "Music Player" },
  ];

  return (
    <nav className="w-64 flex-none hidden md:flex flex-col gap-4 p-6 border-r border-white/10 bg-black/20">
      <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">
        Navegación
      </h2>

      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onMouseEnter={() => playHoverSound()}
          className={({ isActive }) =>
            `glossy-button h-12 rounded-full px-6 flex items-center gap-3 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <item.icon size={20} />
          <span className="text-sm font-medium">{item.label}</span>
        </NavLink>
      ))}

      <div className="mt-auto pt-4 border-t border-white/10">
        <NavLink
          to="/contacto"
          onMouseEnter={() => playHoverSound()}
          className={({ isActive }) =>
            `glossy-button h-12 rounded-full px-6 flex items-center gap-3 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <Mail size={20} />
          <span className="text-sm font-medium">Contacto</span>
        </NavLink>
      </div>
    </nav>
  );
};
