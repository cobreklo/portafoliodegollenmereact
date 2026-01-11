import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlassPanel } from './components/ui/GlassPanel';
import { CRTOverlay } from './components/ui/CRTOverlay';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { useAudio } from './hooks/useAudio';

// Pages - using Default Imports as requested
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

  // Global click sound effect
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        // Cast to Element to use closest method safely
        const target = e.target as Element;
        
        // Don't play sound if clicking on a link (links might have their own sound or navigation)
        // Also check if target is valid
        if (target && target.closest && target.closest('a')) return;
        
        playClickSound();
    };
    
    // Use true for capture phase if needed, or bubble. Document click usually works on bubble.
    document.addEventListener('click', handleClick);
    
    return () => document.removeEventListener('click', handleClick);
  }, [playClickSound]);

  return (
      <GlassPanel>
        <Header />
        <div className="flex flex-1 overflow-hidden">
        <Sidebar />
          <main className="flex-1 p-6 relative overflow-y-auto scrollbar-hide">
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
