import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

interface ShortItem {
    id: string;
    titulo: string;
    videoId: string;
    fecha: string;
}

export function ShortsSection() {
    const [cortos, setCortos] = useState<ShortItem[]>([]);
    const [form, setForm] = useState({ titulo: '', url: '' });
    const [loading, setLoading] = useState(false);

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

        if (!videoId) {
            alert('URL inválida');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'cortometrajes'), {
                titulo: form.titulo,
                videoId,
                fecha: new Date().toISOString()
            });
            setForm({ titulo: '', url: '' });
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <div className="lg:sticky lg:top-4">
                <form onSubmit={handleSubmit} className="bg-white/5 p-3 rounded-lg border border-white/10 shadow-lg">
                    <h3 className="text-xs font-bold text-gray-300 mb-2 border-b border-white/10 pb-1 uppercase tracking-wider">Nuevo Corto</h3>
                    <div className="space-y-2">
                        <input 
                            placeholder="Título" 
                            required 
                            className="w-full bg-black/30 border border-gray-600 rounded px-2 h-8 text-xs text-white focus:border-cyan-500 outline-none" 
                            value={form.titulo} 
                            onChange={e => setForm({...form, titulo: e.target.value})} 
                        />
                        <input 
                            placeholder="URL Youtube" 
                            required 
                            className="w-full bg-black/30 border border-gray-600 rounded px-2 h-8 text-xs text-white focus:border-cyan-500 outline-none" 
                            value={form.url} 
                            onChange={e => setForm({...form, url: e.target.value})} 
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-8 rounded font-bold text-xs uppercase tracking-wide mt-1"
                        >
                            {loading ? '...' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-2 space-y-2 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
                {cortos.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-white/5 p-2 rounded hover:bg-white/10 border border-transparent hover:border-white/10 group">
                        <div className="flex items-center gap-3 overflow-hidden">
                             <img src={`https://img.youtube.com/vi/${c.videoId}/default.jpg`} className="w-12 h-9 object-cover rounded flex-shrink-0" alt="thumb" />
                             <span className="truncate text-xs text-gray-300 font-medium">{c.titulo}</span>
                        </div>
                        <button 
                            onClick={async () => {
                                if(confirm('Eliminar?')) await deleteDoc(doc(db, 'cortometrajes', c.id));
                            }} 
                            className="text-red-400 hover:text-white w-6 h-6 flex items-center justify-center rounded hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                            ✖
                        </button>
                    </div>
                ))}
                {cortos.length === 0 && <div className="text-center p-4 text-xs text-gray-500">No hay cortos.</div>}
            </div>
        </div>
    );
}
