import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../services/firebase';

interface VideoItem {
  titulo: string;
  url: string;
  thumbnail?: string;
  fecha?: string;
}

interface VideoSectionProps {
  openWidget: (resourceType: 'image' | 'video', callback: (url: string) => void, multiple?: boolean) => void;
}

export function VideoSection({ openWidget }: VideoSectionProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [form, setForm] = useState<VideoItem>({ titulo: '', url: '', thumbnail: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'contenido', 'videos'), (snap) => {
      if (snap.exists()) setVideos(snap.data().items || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.url) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, 'contenido', 'videos'), {
        items: arrayUnion({ ...form, fecha: new Date().toISOString() })
      }, { merge: true });
      setForm({ titulo: '', url: '', thumbnail: '' });
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Error al guardar el video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (v: VideoItem) => {
    if(confirm('¿Eliminar video?')) {
        try {
            await updateDoc(doc(db, 'contenido', 'videos'), { items: arrayRemove(v) });
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start text-xs">
      <div className="lg:sticky lg:top-12">
        <form onSubmit={handleSubmit} className="bg-white/5 p-3 rounded border border-white/10 shadow-lg">
          <h3 className="font-bold text-gray-300 mb-2 border-b border-white/10 pb-1 uppercase tracking-wider">Nuevo Video</h3>
          <div className="space-y-2">
            <input 
                placeholder="Título del Video" 
                required 
                className="w-full bg-black/30 border border-gray-600 rounded px-2 h-7 text-white focus:border-red-500 outline-none transition-colors placeholder:text-gray-500" 
                value={form.titulo} 
                onChange={e => setForm({...form, titulo: e.target.value})} 
            />
            <input 
                placeholder="URL Youtube/Vimeo" 
                required 
                className="w-full bg-black/30 border border-gray-600 rounded px-2 h-7 text-white focus:border-red-500 outline-none transition-colors placeholder:text-gray-500" 
                value={form.url} 
                onChange={e => setForm({...form, url: e.target.value})} 
            />
            
            <div className="flex gap-2">
                <input 
                    placeholder="URL Miniatura (Opcional)" 
                    className="flex-1 bg-black/30 border border-gray-600 rounded px-2 h-7 text-white focus:border-red-500 outline-none transition-colors placeholder:text-gray-500" 
                    value={form.thumbnail || ''} 
                    onChange={e => setForm({...form, thumbnail: e.target.value})} 
                />
                <button 
                    type="button"
                    onClick={() => openWidget('image', (url) => setForm({...form, thumbnail: url}))}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 rounded h-7 text-xs border border-white/10"
                >
                    Subir
                </button>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white h-7 rounded font-bold uppercase tracking-wide transition-all shadow disabled:opacity-50 mt-1"
            >
                {loading ? '...' : 'Agregar Video'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
        {videos.map((v, i) => (
          <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 group">
            <div className="flex flex-col overflow-hidden">
                <span className="truncate font-bold text-gray-200">{v.titulo}</span>
                <span className="truncate text-[10px] text-gray-500">{v.url}</span>
            </div>
            <button 
                onClick={() => handleDelete(v)} 
                className="text-red-400 hover:text-white w-5 h-5 flex items-center justify-center rounded hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                title="Eliminar"
            >
                ✖
            </button>
          </div>
        ))}
        {videos.length === 0 && (
            <div className="text-center p-4 border border-dashed border-white/10 rounded text-gray-500">
                No hay videos.
            </div>
        )}
      </div>
    </div>
  );
}
