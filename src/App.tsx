import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GlassPanel } from './components/ui/GlassPanel';
import { CRTOverlay } from './components/ui/CRTOverlay';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { useAudio } from './hooks/useAudio';

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

  // Global click sound effect
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
      <GlassPanel>
        <Header />
        <div className="flex flex-1 overflow-hidden">
        <Sidebar />
          <main className={`flex-1 relative overflow-y-auto scrollbar-hide ${isAdmin ? 'p-0' : 'p-6'}`}>
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
