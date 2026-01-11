import React from 'react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Home, Video, Music, Camera, Film, MessageSquare, 
  Library, Mail, Layout, Image, LogOut
} from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

export const Sidebar: React.FC = () => {
  const { playHoverSound } = useAudio();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const isAdmin = location.pathname.startsWith('/admin');
  const currentTab = searchParams.get('tab') || 'inicio';

  // En modo Admin, renderizamos NULL para que el sidebar global no aparezca.
  // La navegación del Admin se moverá al interior del AdminLayout.
  if (isAdmin) return null;

  const publicNavItems = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/reel", icon: Video, label: "Reel Principal" },
    { to: "/videoclips", icon: Music, label: "Videoclips" },
    { to: "/fotografias", icon: Camera, label: "Fotografías" },
    { to: "/cortometrajes", icon: Film, label: "Cortometrajes" },
    { to: "/resenas", icon: MessageSquare, label: "Reseñas" },
    { to: "/musica", icon: Library, label: "Music Player" },
  ];

  return (
    <nav className="w-48 flex-none hidden md:flex flex-col gap-2 p-3 border-r border-white/10 bg-black/20 text-xs">
      <h2 className="text-[10px] font-bold text-white/50 uppercase tracking-wider px-2">
        Navegación
      </h2>

      {publicNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onMouseEnter={() => playHoverSound()}
            className={({ isActive }) =>
              `glossy-button py-2 rounded-lg px-3 flex items-center gap-2 transition-all ${
                isActive ? 'active' : ''
              }`
            }
          >
            <item.icon size={14} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

      <div className="mt-auto pt-2 border-t border-white/10">
          <NavLink
            to="/contacto"
            onMouseEnter={() => playHoverSound()}
            className={({ isActive }) =>
              `glossy-button py-2 rounded-lg px-3 flex items-center gap-2 transition-all ${
                isActive ? 'active' : ''
              }`
            }
          >
            <Mail size={14} />
            <span className="font-medium">Contacto</span>
          </NavLink>
      </div>
    </nav>
  );
};
