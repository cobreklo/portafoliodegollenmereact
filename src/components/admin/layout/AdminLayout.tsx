import React, { useState } from 'react';
import { useSearchParams, NavLink, Link } from 'react-router-dom';
import { 
  Home, Video, Music, Film, MessageSquare, 
  Layout, Image, Menu, X, ArrowLeft
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'inicio';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const adminNavItems = [
    { tab: "inicio", icon: Home, label: "Inicio" },
    { tab: "resenas", icon: MessageSquare, label: "Reseñas" },
    { tab: "musica", icon: Music, label: "Música" },
    { tab: "videos", icon: Video, label: "Videos" },
    { tab: "reel", icon: Layout, label: "Reel" },
    { tab: "cortos", icon: Film, label: "Cortos" },
    { tab: "albumes", icon: Image, label: "Álbumes" },
  ];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center z-[9999]">
      <div 
        id="admin-window"
        className="relative origin-center bg-black text-white p-2 font-sans selection:bg-blue-500/30 text-xs md:text-sm overflow-hidden flex flex-col shadow-2xl"
        style={{
            width: '125vw',
            height: '125vh',
            transform: 'scale(0.8)',
        }}
      >
        <div className="flex-1 flex gap-2 min-h-0 relative">
            
            {/* MENU TOGGLE (Always Visible) */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="absolute top-3 left-3 z-[60] p-2 bg-zinc-800 rounded border border-white/20 text-white hover:bg-zinc-700 transition-colors"
            >
                {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            {/* OFF-CANVAS SIDEBAR (All Screens) */}
            <div className={`
                absolute z-50 h-full w-64 flex-none flex flex-col gap-1 bg-zinc-900/95 border-r border-white/10 p-2 rounded-l-lg transition-transform duration-300 shadow-2xl backdrop-blur-md
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center gap-2 px-2 py-3 mb-2 border-b border-white/10 mt-10">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="font-bold text-xs text-white tracking-wider">PANEL ADMIN</span>
                </div>
                
                {adminNavItems.map((item) => (
                    <NavLink
                        key={item.tab}
                        to={`/admin?tab=${item.tab}`}
                        onClick={() => setIsMenuOpen(false)}
                        className={() =>
                        `flex items-center gap-2 px-3 py-3 rounded transition-all text-sm font-medium ${
                            currentTab === item.tab 
                            ? 'bg-white/10 text-white border border-white/20 shadow-inner' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`
                        }
                    >
                        <item.icon size={16} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                <div className="mt-auto pt-2 border-t border-white/10 pb-4">
                    <Link 
                        to="/"
                        className="w-full flex items-center gap-2 px-3 py-3 rounded text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft size={16} />
                        <span>Volver al Inicio</span>
                    </Link>

                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3 py-3 rounded text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* OVERLAY (When menu is open) */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* MAIN CONTENT (Always Full Width) */}
            <div className="flex-1 flex flex-col gap-2 min-w-0 w-full h-full">
                 {/* Header Compacto (Padding Left for Button) */}
                <div className="flex-none flex justify-between items-center bg-zinc-900/90 px-4 py-2 rounded border border-white/10 backdrop-blur-md z-40 shadow-lg pl-14">
                    <div className="flex items-center gap-3">
                        <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        CMS Portafolio
                        </h1>
                        <div className="h-4 w-px bg-white/20 hidden md:block"></div>
                        <span className="hidden md:inline text-xs text-gray-500 uppercase tracking-wider">Panel de Control</span>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar rounded border border-white/5 bg-black/20 p-4">
                    {children}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
