import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useSearchParams, Link } from 'react-router-dom';

// Componentes Refactorizados
import { AdminLayout } from '../components/Admin/layout/AdminLayout';
import { SectionContainer } from '../components/Admin/ui/SectionContainer';
import { MusicSection } from '../components/Admin/sections/MusicSection';
import { VideoSection } from '../components/Admin/sections/VideoSection';
import { ProfileSection } from '../components/Admin/sections/ProfileSection';
import { ReelSection } from '../components/Admin/sections/ReelSection';
import { ShortsSection } from '../components/Admin/sections/ShortsSection';
import { AlbumSection } from '../components/Admin/sections/AlbumSection';
import { ReviewSection } from '../components/Admin/sections/ReviewSection';

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'inicio';

  // Nota: Ya no necesitamos inyectar clases globales porque el escalado 
  // está contenido estructuralmente en el AdminLayout (Stage/Window system).

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Error de autenticación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const openWidget = (resourceType: 'image' | 'video', callback: (url: string) => void, multiple = false) => {
    if (!window.cloudinary) {
      alert("Error: Cloudinary no está cargado. Recarga la página.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget({
      cloudName: 'do2y9icrt', 
      uploadPreset: 'portafolio_preset', 
      sources: ['local', 'url'],
      resourceType: resourceType,
      multiple: multiple,
      clientAllowedFormats: resourceType === 'video' ? ["mp3", "wav"] : ["png", "jpg", "jpeg", "gif", "webp"]
    }, (error: any, result: any) => { 
      if (!error && result && result.event === "success") { 
        callback(result.info.secure_url);
      }
    });
    widget.open();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Cargando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <GlassPanel className="p-8 w-full max-w-md border border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
              Ingresar
            </button>
            
            <Link to="/" className="block w-full text-center bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-2 px-4 rounded transition border border-white/10">
              Volver al Inicio
            </Link>
          </form>
        </GlassPanel>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={handleLogout}>
        <div className="animate-fade-in w-full h-full">
          {currentTab === 'inicio' && (
            <SectionContainer title="Inicio / Perfil" icon="🏠">
              <ProfileSection openWidget={openWidget} />
            </SectionContainer>
          )}

          {currentTab === 'resenas' && (
            <SectionContainer title="Moderación de Reseñas" icon="💬">
              <ReviewSection />
            </SectionContainer>
          )}

          {currentTab === 'musica' && (
            <SectionContainer title="Música" icon="🎵">
              <MusicSection openWidget={openWidget} />
            </SectionContainer>
          )}

          {currentTab === 'videos' && (
            <SectionContainer title="Videoclips" icon="🎬">
              <VideoSection openWidget={openWidget} />
            </SectionContainer>
          )}

          {currentTab === 'reel' && (
            <SectionContainer title="Reel / Playlist" icon="📺">
              <ReelSection />
            </SectionContainer>
          )}

          {currentTab === 'cortos' && (
            <SectionContainer title="Cortometrajes" icon="🎥">
              <ShortsSection />
            </SectionContainer>
          )}

          {currentTab === 'albumes' && (
            <SectionContainer title="Álbumes" icon="📷">
              <AlbumSection openWidget={openWidget} />
            </SectionContainer>
          )}
        </div>
    </AdminLayout>
  );
}
