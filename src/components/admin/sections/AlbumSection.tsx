import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

interface AlbumSectionProps {
    openWidget: (resourceType: 'image' | 'video', callback: (url: string) => void, multiple?: boolean) => void;
}

export function AlbumSection({ openWidget }: AlbumSectionProps) {
    const [albums, setAlbums] = useState<any[]>([]);
    const [form, setForm] = useState({ titulo: '', portadaUrl: '' });
    const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            await addDoc(collection(db, 'albumes'), {
                ...form,
                fotos: [],
                createdAt: new Date().toISOString()
            });
            setForm({ titulo: '', portadaUrl: '' });
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleAddPhotos = () => {
        if(!selectedAlbumId) return alert('Selecciona un álbum abajo primero');
        openWidget('image', async (url: string) => {
            await updateDoc(doc(db, 'albumes', selectedAlbumId), {
                fotos: arrayUnion(url)
            });
        }, true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <div className="lg:sticky lg:top-4 space-y-4">
                {/* Create Album Form */}
                <div className="bg-white/5 p-3 rounded-lg border border-yellow-500/20 shadow-lg">
                    <h3 className="text-xs font-bold text-yellow-400 mb-2 border-b border-yellow-500/20 pb-1 uppercase tracking-wider">Crear Álbum</h3>
                    <form onSubmit={handleCreate} className="space-y-2">
                        <input 
                            placeholder="Título del Álbum" 
                            required 
                            className="w-full bg-black/30 border border-gray-600 rounded px-2 h-8 text-xs text-white focus:border-yellow-500 outline-none" 
                            value={form.titulo} 
                            onChange={e => setForm({...form, titulo: e.target.value})} 
                        />
                        <button 
                            type="button" 
                            onClick={() => openWidget('image', (url: string) => setForm({...form, portadaUrl: url}))} 
                            className={`w-full border h-8 rounded text-xs font-medium truncate ${form.portadaUrl ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 'border-gray-600 text-gray-400 hover:bg-white/5'}`}
                        >
                            {form.portadaUrl ? 'Portada Lista' : 'Seleccionar Portada'}
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-yellow-600 text-black h-8 rounded font-bold text-xs uppercase tracking-wide hover:bg-yellow-500 transition-colors"
                        >
                            {loading ? '...' : 'Crear'}
                        </button>
                    </form>
                </div>

                {/* Upload Action */}
                <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                     <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">Subir Fotos</h3>
                     <p className="text-[10px] text-gray-400 mb-2">Selecciona un álbum de la lista derecha para subir fotos.</p>
                     <select 
                        className="w-full bg-black/50 border border-gray-600 rounded h-8 text-xs text-white mb-2"
                        value={selectedAlbumId}
                        onChange={e => setSelectedAlbumId(e.target.value)}
                     >
                        <option value="">-- Seleccionar Álbum --</option>
                        {albums.map(a => <option key={a.id} value={a.id}>{a.titulo}</option>)}
                     </select>
                     <button 
                        onClick={handleAddPhotos} 
                        disabled={!selectedAlbumId}
                        className="w-full bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white h-8 rounded font-bold text-xs uppercase tracking-wide hover:bg-blue-500 transition-colors"
                     >
                        + Subir Fotos
                     </button>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
                {albums.map(a => (
                    <div key={a.id} className={`bg-white/5 p-3 rounded border transition-colors ${selectedAlbumId === a.id ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-white/10'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <img src={a.portadaUrl} className="w-10 h-10 object-cover rounded shadow-sm" alt="cover" />
                                <div>
                                    <span className="font-bold block text-sm text-white">{a.titulo}</span>
                                    <span className="text-[10px] text-gray-400">{a.fotos?.length || 0} fotos</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setSelectedAlbumId(a.id)}
                                    className={`text-xs px-2 py-1 rounded border ${selectedAlbumId === a.id ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-600 text-gray-400 hover:text-white'}`}
                                >
                                    {selectedAlbumId === a.id ? 'Seleccionado' : 'Seleccionar'}
                                </button>
                                <button 
                                    onClick={async () => {
                                        if(confirm('Eliminar álbum completo?')) await deleteDoc(doc(db, 'albumes', a.id));
                                    }} 
                                    className="text-red-400 hover:text-white px-2 py-1 rounded border border-red-500/30 hover:bg-red-600 text-xs transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        
                        {/* Photos Grid */}
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1">
                            {a.fotos && a.fotos.slice(0, 14).map((f: string, i: number) => (
                                <div key={i} className="relative group aspect-square">
                                    <img src={f} className="w-full h-full object-cover rounded border border-white/10" alt="" />
                                    <button 
                                        onClick={async () => await updateDoc(doc(db, 'albumes', a.id), { fotos: arrayRemove(f) })}
                                        className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-bl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                    >x</button>
                                </div>
                            ))}
                            {a.fotos && a.fotos.length > 14 && (
                                <div className="aspect-square flex items-center justify-center bg-white/10 rounded text-xs text-gray-400 border border-white/10">
                                    +{a.fotos.length - 14}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
