import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { GlassPanel } from '../components/ui/GlassPanel';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <GlassPanel className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
              Ingresar
            </button>
          </form>
        </GlassPanel>
      </div>
    );
  }

  // AGGRESSIVE REDESIGN: No Sidebar, Full Width, Vertical Layout
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm sticky top-4 z-50 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              CMS Portafolio
            </h1>
            <p className="text-xs text-gray-400 mt-1">Panel de Control Unificado</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-bold shadow-lg transition-all text-sm"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* SECTIONS GRID / STACK */}
        {/* We use a masonry-like grid or vertical stack to show everything at once but organized */}
        
        {/* 1. Inicio & Perfil */}
        <SectionContainer title="Inicio / Perfil" icon="🏠">
            <InicioConfig openWidget={openWidget} />
        </SectionContainer>

        {/* 2. Reseñas (High Priority) */}
        <SectionContainer title="Moderación de Reseñas" icon="💬">
            <ResenaManager />
        </SectionContainer>

        {/* 3. Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionContainer title="Música" icon="🎵">
                <MusicaManager openWidget={openWidget} />
            </SectionContainer>
            
            <SectionContainer title="Videoclips" icon="🎬">
                <VideoManager />
            </SectionContainer>
        </div>

        {/* 4. More Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionContainer title="Reel / Playlist" icon="📺">
                <ReelManager />
            </SectionContainer>

            <SectionContainer title="Cortometrajes" icon="🎥">
                <CortosManager />
            </SectionContainer>
        </div>

        {/* 5. Albums (Full Width) */}
        <SectionContainer title="Álbumes" icon="📷">
            <AlbumManager openWidget={openWidget} />
        </SectionContainer>

      </div>
    </div>
  );
}

// Wrapper for Sections
function SectionContainer({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) {
    return (
        <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-2xl font-bold text-white/90">{title}</h2>
            </div>
            {children}
        </div>
    );
}

// ------------------- SUB-COMPONENTS (Logic Preserved) -------------------

function InicioConfig({ openWidget }: { openWidget: any }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'web', 'inicio')).then(snap => {
      if (snap.exists()) setData(snap.data());
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'web', 'inicio'), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      alert('Cambios guardados');
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Título Principal</label>
          <input 
            className="w-full bg-black/30 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none" 
            value={data.tituloPrincipal || ''} 
            onChange={e => setData({...data, tituloPrincipal: e.target.value})}
          />
        </div>
        <div>
           <label className="block text-sm text-gray-400 mb-1">Título Perfil</label>
           <input 
                className="w-full bg-black/30 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none" 
                value={data.tituloPerfil || ''} 
                onChange={e => setData({...data, tituloPerfil: e.target.value})}
            />
        </div>
      </div>

      <div>
          <label className="block text-sm text-gray-400 mb-1">Subtítulo</label>
          <textarea 
            className="w-full bg-black/30 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none h-20" 
            value={data.subtituloPrincipal || ''} 
            onChange={e => setData({...data, subtituloPrincipal: e.target.value})}
          />
      </div>

      <div className="flex gap-4 items-start">
         <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Descripción Perfil</label>
            <textarea 
                className="w-full bg-black/30 border border-gray-600 rounded p-2 h-32 focus:border-blue-500 outline-none" 
                value={data.descripcionPerfil || ''} 
                onChange={e => setData({...data, descripcionPerfil: e.target.value})}
            />
         </div>
         <div className="w-1/3">
            <label className="block text-sm text-gray-400 mb-1">Foto Perfil</label>
            <div className="border border-dashed border-gray-600 rounded p-4 text-center hover:bg-white/5 transition-colors">
                {data.url_foto_perfil && <img src={data.url_foto_perfil} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />}
                <button type="button" onClick={() => openWidget('image', (url: string) => setData({...data, url_foto_perfil: url, fotoPerfil: url}))} className="text-blue-400 text-sm hover:underline">
                    {data.url_foto_perfil ? 'Cambiar Foto' : 'Subir Foto'}
                </button>
            </div>
         </div>
      </div>
      
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold">
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );
}

function MusicaManager({ openWidget }: { openWidget: any }) {
  const [songs, setSongs] = useState<any[]>([]);
  const [form, setForm] = useState({ titulo: '', artista: '', url_audio: '', url_portada: '' });

  useEffect(() => {
    return onSnapshot(doc(db, 'contenido', 'musica'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setSongs(d.listaCanciones || d.items || []);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url_audio || !form.url_portada) return alert('Sube el audio y la portada primero');
    
    const newSong = { ...form, id: Date.now().toString() };
    await setDoc(doc(db, 'contenido', 'musica'), {
      listaCanciones: arrayUnion(newSong)
    }, { merge: true });
    setForm({ titulo: '', artista: '', url_audio: '', url_portada: '' });
    alert('Canción agregada');
  };

  const handleDelete = async (song: any) => {
    if (!confirm('¿Eliminar canción?')) return;
    try {
        await updateDoc(doc(db, 'contenido', 'musica'), { listaCanciones: arrayRemove(song) });
    } catch(e) {}
    try {
        await updateDoc(doc(db, 'contenido', 'musica'), { items: arrayRemove(song) });
    } catch(e) {}
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 bg-white/5 p-4 rounded border border-white/10">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input placeholder="Título" required className="bg-black/30 border border-gray-600 rounded p-2" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
          <input placeholder="Artista" required className="bg-black/30 border border-gray-600 rounded p-2" value={form.artista} onChange={e => setForm({...form, artista: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button type="button" onClick={() => openWidget('video', (url: string) => setForm({...form, url_audio: url}))} className={`border p-2 rounded text-sm ${form.url_audio ? 'border-green-500 text-green-400' : 'border-gray-500 text-gray-400'}`}>
            {form.url_audio ? 'MP3 Cargado' : 'Subir MP3'}
          </button>
          <button type="button" onClick={() => openWidget('image', (url: string) => setForm({...form, url_portada: url}))} className={`border p-2 rounded text-sm ${form.url_portada ? 'border-green-500 text-green-400' : 'border-gray-500 text-gray-400'}`}>
            {form.url_portada ? 'Cover Cargado' : 'Subir Cover'}
          </button>
        </div>
        <button type="submit" className="w-full bg-green-600 py-2 rounded font-bold hover:bg-green-700">Agregar Canción</button>
      </form>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {songs.map((song, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <img src={song.url_portada || song.cover} className="w-10 h-10 object-cover rounded" />
              <div>
                <div className="font-bold text-sm">{song.titulo}</div>
                <div className="text-xs text-gray-400">{song.artista}</div>
              </div>
            </div>
            <button onClick={() => handleDelete(song)} className="text-red-400 hover:text-red-300 p-2">✖</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoManager() {
  const [videos, setVideos] = useState<any[]>([]);
  const [form, setForm] = useState({ titulo: '', url: '' });

  useEffect(() => {
    return onSnapshot(doc(db, 'contenido', 'videos'), (snap) => {
      if (snap.exists()) setVideos(snap.data().items || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDoc(doc(db, 'contenido', 'videos'), {
      items: arrayUnion({ ...form, fecha: new Date().toISOString() })
    }, { merge: true });
    setForm({ titulo: '', url: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
        <input placeholder="Título" required className="bg-black/30 border border-gray-600 rounded p-2" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
        <div className="flex gap-2">
            <input placeholder="URL Youtube/Vimeo" required className="flex-1 bg-black/30 border border-gray-600 rounded p-2" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
            <button type="submit" className="bg-red-600 px-4 rounded font-bold hover:bg-red-700">Agregar</button>
        </div>
      </form>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {videos.map((v, i) => (
          <li key={i} className="flex justify-between items-center bg-white/5 p-2 rounded hover:bg-white/10">
            <span className="truncate flex-1 pr-4">{v.titulo}</span>
            <button onClick={async () => {
              if(confirm('Eliminar?')) await updateDoc(doc(db, 'contenido', 'videos'), { items: arrayRemove(v) });
            }} className="text-red-400 hover:text-red-300">✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReelManager() {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', url: '' });

  useEffect(() => {
    return onSnapshot(doc(db, 'contenido', 'reel'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.playlist) setPlaylist(d.playlist);
        else if (d.videoId) setPlaylist([{ title: d.titulo, videoId: d.videoId, oldFormat: true }]);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = form.url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) return alert('URL inválida');

    const newVid = { title: form.title || 'Video', videoId, addedAt: new Date().toISOString() };
    await setDoc(doc(db, 'contenido', 'reel'), {
      playlist: arrayUnion(newVid)
    }, { merge: true });
    setForm({ title: '', url: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 bg-white/5 p-4 rounded">
        <div className="grid gap-3">
            <input placeholder="Título (Opcional)" className="bg-black/30 border border-gray-600 rounded p-2" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <div className="flex gap-2">
                <input placeholder="URL Youtube" required className="flex-1 bg-black/30 border border-gray-600 rounded p-2" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
                <button type="submit" className="bg-purple-600 px-4 rounded font-bold hover:bg-purple-700">Añadir</button>
            </div>
        </div>
      </form>
      <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {playlist.map((v, i) => (
          <li key={i} className="flex items-center justify-between bg-white/5 p-2 rounded">
             <div className="flex items-center gap-3">
                 <img src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`} className="w-12 h-9 object-cover rounded" />
                 <span className="truncate max-w-[150px]">{v.title}</span>
             </div>
             <button onClick={async () => {
               if(confirm('Eliminar?')) {
                   if (v.oldFormat) await updateDoc(doc(db, 'contenido', 'reel'), { videoId: null });
                   else await updateDoc(doc(db, 'contenido', 'reel'), { playlist: arrayRemove(v) });
               }
             }} className="text-red-400">✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CortosManager() {
    const [cortos, setCortos] = useState<any[]>([]);
    const [form, setForm] = useState({ titulo: '', url: '' });

    useEffect(() => {
        return onSnapshot(collection(db, 'cortometrajes'), (snap) => {
            const list: any[] = [];
            snap.forEach(d => list.push({id: d.id, ...d.data()}));
            setCortos(list);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = form.url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;

        if (!videoId) return alert('URL inválida');

        await addDoc(collection(db, 'cortometrajes'), {
            titulo: form.titulo,
            videoId,
            fecha: new Date().toISOString()
        });
        setForm({ titulo: '', url: '' });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
                <input placeholder="Título" required className="bg-black/30 border border-gray-600 rounded p-2" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
                <div className="flex gap-2">
                    <input placeholder="URL Youtube" required className="flex-1 bg-black/30 border border-gray-600 rounded p-2" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
                    <button type="submit" className="bg-cyan-600 px-4 rounded font-bold hover:bg-cyan-700">Agregar</button>
                </div>
            </form>
            <div className="grid gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                {cortos.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span>{c.titulo}</span>
                        <button onClick={async () => {
                            if(confirm('Eliminar?')) await deleteDoc(doc(db, 'cortometrajes', c.id));
                        }} className="text-red-400">✖</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AlbumManager({ openWidget }: { openWidget: any }) {
    const [albums, setAlbums] = useState<any[]>([]);
    const [form, setForm] = useState({ titulo: '', portadaUrl: '' });
    const [selectedAlbum, setSelectedAlbum] = useState<string>('');

    useEffect(() => {
        return onSnapshot(collection(db, 'albumes'), (snap) => {
            const list: any[] = [];
            snap.forEach(d => list.push({id: d.id, ...d.data()}));
            setAlbums(list);
        });
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!form.titulo || !form.portadaUrl) return alert('Completa los campos');
        await addDoc(collection(db, 'albumes'), {
            ...form,
            fotos: [],
            createdAt: new Date().toISOString()
        });
        setForm({ titulo: '', portadaUrl: '' });
    };

    const handleAddPhotos = () => {
        if(!selectedAlbum) return alert('Selecciona un álbum');
        openWidget('image', async (url: string) => {
            await updateDoc(doc(db, 'albumes', selectedAlbum), {
                fotos: arrayUnion(url)
            });
            alert('Foto agregada');
        }, true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Controls */}
            <div className="space-y-6">
                {/* Create */}
                <div className="p-4 border border-yellow-500/30 rounded bg-yellow-500/5">
                    <h4 className="font-bold mb-3 text-yellow-400">Crear Nuevo Álbum</h4>
                    <form onSubmit={handleCreate} className="space-y-3">
                        <input placeholder="Título del Álbum" required className="w-full bg-black/30 border border-gray-600 rounded p-2" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
                        <button type="button" onClick={() => openWidget('image', (url: string) => setForm({...form, portadaUrl: url}))} className="w-full border border-gray-500 p-2 rounded text-gray-300 hover:bg-white/5 text-sm">
                            {form.portadaUrl ? 'Portada Lista' : 'Seleccionar Portada'}
                        </button>
                        <button type="submit" className="w-full bg-yellow-600 text-black font-bold py-2 rounded hover:bg-yellow-500">Crear Álbum</button>
                    </form>
                </div>

                {/* Manage Photos */}
                <div>
                     <h4 className="font-bold mb-2 text-gray-300">Subir Fotos a Álbum</h4>
                     <div className="flex gap-2">
                         <select className="flex-1 bg-black/30 border border-gray-600 rounded p-2" value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)}>
                             <option value="">Selecciona un álbum...</option>
                             {albums.map(a => <option key={a.id} value={a.id}>{a.titulo}</option>)}
                         </select>
                         <button onClick={handleAddPhotos} className="bg-blue-600 px-4 rounded font-bold hover:bg-blue-700">Subir</button>
                     </div>
                </div>
            </div>

            {/* Right Col: List */}
            <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {albums.map(a => (
                    <div key={a.id} className="bg-white/5 p-4 rounded border border-white/10">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <img src={a.portadaUrl} className="w-12 h-12 object-cover rounded" />
                                <div>
                                    <span className="font-bold block">{a.titulo}</span>
                                    <span className="text-xs text-gray-400">{a.fotos?.length || 0} fotos</span>
                                </div>
                            </div>
                            <button onClick={async () => {
                                if(confirm('Eliminar álbum completo?')) await deleteDoc(doc(db, 'albumes', a.id));
                            }} className="text-red-400 hover:text-red-300 text-sm border border-red-500/30 px-3 py-1 rounded">Eliminar Álbum</button>
                        </div>
                        {/* Photos preview */}
                        <div className="flex flex-wrap gap-2">
                            {a.fotos && a.fotos.slice(0, 10).map((f: string, i: number) => (
                                <div key={i} className="relative group w-12 h-12">
                                    <img src={f} className="w-full h-full object-cover rounded border border-white/20" />
                                    <button 
                                        onClick={async () => await updateDoc(doc(db, 'albumes', a.id), { fotos: arrayRemove(f) })}
                                        className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] opacity-0 group-hover:opacity-100"
                                    >x</button>
                                </div>
                            ))}
                            {a.fotos && a.fotos.length > 10 && (
                                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded text-xs text-gray-400">
                                    +{a.fotos.length - 10}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ResenaManager() {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'resenas'), orderBy('fecha', 'desc'));
        return onSnapshot(q, (snap) => {
            const list: any[] = [];
            snap.forEach(d => list.push({id: d.id, ...d.data()}));
            setReviews(list);
        });
    }, []);

    const toggleApprove = async (r: any) => {
        await updateDoc(doc(db, 'resenas', r.id), { aprobado: !r.aprobado });
    };

    const toggleVerify = async (r: any) => {
        await updateDoc(doc(db, 'resenas', r.id), { verificado: !r.verificado });
    };

    const deleteReview = async (id: string) => {
        if(confirm('Eliminar reseña?')) await deleteDoc(doc(db, 'resenas', id));
    };

    return (
        <div className="grid gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {reviews.map(r => (
                <div key={r.id} className={`p-4 rounded border transition-all ${r.aprobado ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold flex items-center gap-2">
                                {r.nombre || 'Anónimo'} 
                                {r.verificado && <span className="text-blue-400 text-xs border border-blue-400 rounded px-1">VERIFICADO</span>}
                            </h4>
                            <p className="text-sm text-gray-400">{new Date(r.fecha?.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => toggleVerify(r)} className="text-xs border border-blue-500 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/10">
                                {r.verificado ? 'Quitar Verif.' : 'Verificar'}
                            </button>
                            <button onClick={() => toggleApprove(r)} className={`text-xs border px-3 py-1 rounded hover:opacity-80 ${r.aprobado ? 'border-yellow-500 text-yellow-400' : 'border-green-500 text-green-400'}`}>
                                {r.aprobado ? 'Ocultar' : 'Aprobar'}
                            </button>
                            <button onClick={() => deleteReview(r.id)} className="text-xs border border-red-500 text-red-400 px-3 py-1 rounded hover:bg-red-500/10">Eliminar</button>
                        </div>
                    </div>
                    <p className="italic text-gray-300">"{r.mensaje}"</p>
                </div>
            ))}
        </div>
    );
}
