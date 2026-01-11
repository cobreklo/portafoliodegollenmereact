import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../services/firebase';

interface Song {
  id?: string;
  titulo: string;
  artista: string;
  url_audio: string;
  url_portada: string;
  cover?: any; 
}

interface MusicSectionProps {
  openWidget: (resourceType: 'image' | 'video', callback: (url: string) => void, multiple?: boolean) => void;
}

const getCoverUrl = (cover: any): string => {
  if (!cover) return '';
  if (typeof cover === 'string') return cover;
  if (typeof cover === 'object' && cover.secure_url) return cover.secure_url;
  return '';
};

export function MusicSection({ openWidget }: MusicSectionProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [form, setForm] = useState<Song>({ titulo: '', artista: '', url_audio: '', url_portada: '' });
  const [loading, setLoading] = useState(false);

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
    if (!form.url_audio || !form.url_portada) {
      alert('Sube audio y portada.');
      return;
    }
    
    setLoading(true);
    try {
      const newSong = { ...form, id: Date.now().toString() };
      await setDoc(doc(db, 'contenido', 'musica'), {
        listaCanciones: arrayUnion(newSong)
      }, { merge: true });
      setForm({ titulo: '', artista: '', url_audio: '', url_portada: '' });
    } catch (err) {
      console.error(err);
      alert('Error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (song: Song) => {
    if (!confirm(`¿Eliminar "${song.titulo}"?`)) return;
    try {
        await updateDoc(doc(db, 'contenido', 'musica'), { listaCanciones: arrayRemove(song) });
    } catch(e) { console.error(e); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start text-xs">
      <div className="lg:sticky lg:top-12">
        <form onSubmit={handleSubmit} className="bg-white/5 p-3 rounded border border-white/10 shadow-lg">
          <h3 className="font-bold text-gray-300 mb-2 border-b border-white/10 pb-1 uppercase tracking-wider">Nueva Canción</h3>
          <div className="space-y-2">
            <input 
              placeholder="Título" 
              required 
              className="w-full bg-black/30 border border-gray-600 rounded px-2 h-7 text-white focus:border-green-500 outline-none" 
              value={form.titulo} 
              onChange={e => setForm({...form, titulo: e.target.value})} 
            />
            <input 
              placeholder="Artista" 
              required 
              className="w-full bg-black/30 border border-gray-600 rounded px-2 h-7 text-white focus:border-green-500 outline-none" 
              value={form.artista} 
              onChange={e => setForm({...form, artista: e.target.value})} 
            />
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                onClick={() => openWidget('video', (url: string) => setForm({...form, url_audio: url}))} 
                className={`border h-7 rounded font-medium truncate ${form.url_audio ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-gray-600 text-gray-400 hover:bg-white/5'}`}
              >
                {form.url_audio ? 'Audio OK' : 'Subir MP3'}
              </button>
              <button 
                type="button" 
                onClick={() => openWidget('image', (url: string) => setForm({...form, url_portada: url}))} 
                className={`border h-7 rounded font-medium truncate ${form.url_portada ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-gray-600 text-gray-400 hover:bg-white/5'}`}
              >
                {form.url_portada ? 'Cover OK' : 'Subir Cover'}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white h-7 rounded font-bold uppercase tracking-wide transition-all mt-1">
              {loading ? '...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
        {songs.map((song, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded hover:bg-white/10 border border-transparent hover:border-white/10 group">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-none">
                 <img 
                   src={getCoverUrl(song.url_portada || song.cover)} 
                   alt={song.titulo}
                   className="w-full h-full rounded-full object-cover shadow-md bg-black/50" 
                 />
                 <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#18181b] rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-white/20 z-10"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="font-bold text-white leading-tight">{song.titulo}</span>
                <span className="text-[10px] text-gray-400">{song.artista}</span>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(song)} 
              className="text-red-400 hover:text-white p-1 rounded hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
            >
              ✖
            </button>
          </div>
        ))}
        {songs.length === 0 && <div className="text-center p-4 text-gray-500 border border-dashed border-white/10 rounded">Vacío</div>}
      </div>
    </div>
  );
}
