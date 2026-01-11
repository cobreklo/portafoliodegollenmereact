import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../services/firebase';

interface ReelItem {
  title: string;
  videoId: string;
  addedAt: string;
  oldFormat?: boolean;
}

export function ReelSection() {
  const [playlist, setPlaylist] = useState<ReelItem[]>([]);
  const [form, setForm] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'contenido', 'reel'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.playlist) setPlaylist(d.playlist);
        else if (d.videoId) setPlaylist([{ title: d.titulo || 'Video Principal', videoId: d.videoId, addedAt: '', oldFormat: true }]);
        else setPlaylist([]);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = form.url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) {
        alert('URL inválida de YouTube');
        return;
    }

    setLoading(true);
    try {
        const newVid = { title: form.title || 'Video', videoId, addedAt: new Date().toISOString() };
        await setDoc(doc(db, 'contenido', 'reel'), {
          playlist: arrayUnion(newVid)
        }, { merge: true });
        setForm({ title: '', url: '' });
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (v: ReelItem) => {
    if(!confirm('¿Eliminar del Reel?')) return;
    try {
        if (v.oldFormat) await updateDoc(doc(db, 'contenido', 'reel'), { videoId: null });
        else await updateDoc(doc(db, 'contenido', 'reel'), { playlist: arrayRemove(v) });
    } catch(e) { console.error(e); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <div className="lg:sticky lg:top-4">
        <form onSubmit={handleSubmit} className="bg-white/5 p-3 rounded-lg border border-white/10 shadow-lg">
          <h3 className="text-xs font-bold text-gray-300 mb-2 border-b border-white/10 pb-1 uppercase tracking-wider">Nuevo Reel/Playlist</h3>
          <div className="space-y-2">
            <input 
                placeholder="Título (Opcional)" 
                className="w-full bg-black/30 border border-gray-600 rounded px-2 h-8 text-xs text-white focus:border-purple-500 outline-none transition-colors" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
            />
            <input 
                placeholder="URL Youtube" 
                required 
                className="w-full bg-black/30 border border-gray-600 rounded px-2 h-8 text-xs text-white focus:border-purple-500 outline-none transition-colors" 
                value={form.url} 
                onChange={e => setForm({...form, url: e.target.value})} 
            />
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-8 rounded font-bold text-xs uppercase tracking-wide transition-all shadow disabled:opacity-50 mt-1"
            >
                {loading ? '...' : 'Añadir a Playlist'}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-2 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
        {playlist.map((v, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded hover:bg-white/10 border border-transparent hover:border-white/10 group">
             <div className="flex items-center gap-3 overflow-hidden">
                 <img src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`} className="w-12 h-9 object-cover rounded flex-shrink-0" alt="thumb" />
                 <span className="truncate text-xs text-gray-300 font-medium">{v.title}</span>
             </div>
             <button 
                onClick={() => handleDelete(v)} 
                className="text-red-400 hover:text-white w-6 h-6 flex items-center justify-center rounded hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
             >
                ✖
             </button>
          </div>
        ))}
        {playlist.length === 0 && <div className="text-center p-4 text-xs text-gray-500">Playlist vacía</div>}
      </div>
    </div>
  );
}
