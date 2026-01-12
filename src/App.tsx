import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GlassPanel } from './components/ui/GlassPanel';
import { CRTOverlay } from './components/ui/CRTOverlay';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { useAudio } from './hooks/useAudio';
import { useFirestoreDoc } from './hooks/useFirestore';

// Pages
import Home from './pages/Home';
import Reel from './pages/Reel';
import Videoclips from './pages/Videoclips';
import Fotografias from './pages/Fotografias';
import Cortometrajes from './pages/Cortometrajes';
import Resenas from './pages/Resenas';
import Musica from './pages/Musica';
import Contacto from './pages/Contacto';
import Admin from './pages/Admin';
import Login from './pages/Login';

const AppContent = () => {
  const { playClickSound } = useAudio();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isMusic = location.pathname === '/musica';
  const isFullPage = isAdmin || isMusic;
  
  // 1. Cargar fondo dinámico desde Firebase
  const { data: themeData } = useFirestoreDoc('settings', 'theme');

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        const target = e.target as Element;
        if (target && target.closest && target.closest('a')) return;
        playClickSound();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [playClickSound]);

  return (
    // CONTENEDOR MAESTRO: Ocupa el 100% de #root
    <div className="relative w-full h-full overflow-hidden">
      
      {/* CAPA 1: FONDO DINÁMICO (Z=0) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 pointer-events-none" 
        style={{ 
           // Si hay imagen en BD, la usa. Si no, es transparente y se ve el CSS global (longhorn)
           backgroundImage: themeData?.backgroundImage 
             ? `url(${themeData.backgroundImage})` 
             : undefined
        }} 
      />

      {/* CAPA 2: CONTENIDO PRINCIPAL (Z=10) */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-auto">
         {/* GlassPanel ahora es hijo flex para ocupar el espacio restante */}
         <GlassPanel className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
               <Sidebar />
               <main className={`flex-1 relative overflow-y-auto scrollbar-hide ${isFullPage ? 'p-0' : 'p-6'}`}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/reel" element={<Reel />} />
                    <Route path="/videoclips" element={<Videoclips />} />
                    <Route path="/fotografias" element={<Fotografias />} />
                    <Route path="/cortometrajes" element={<Cortometrajes />} />
                    <Route path="/resenas" element={<Resenas />} />
                    <Route path="/musica" element={<Musica />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
               </main>
            </div>
         </GlassPanel>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <CRTOverlay />
      <AppContent />
    </Router>
  )
}

export default App;