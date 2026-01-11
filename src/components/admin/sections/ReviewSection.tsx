import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

export function ReviewSection() {
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
        <div className="grid gap-2 pr-2">
            {reviews.map(r => (
                <div key={r.id} className={`p-2 rounded border transition-all ${r.aprobado ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <div className="min-w-0 flex-1 mr-2">
                            <h4 className="font-bold flex items-center gap-2 text-xs text-white truncate">
                                {r.nombre || 'Anónimo'} 
                                {r.verificado && <span className="text-[9px] text-blue-400 border border-blue-400 rounded px-1 uppercase tracking-wider flex-shrink-0">Verificado</span>}
                            </h4>
                            <p className="text-[9px] text-gray-400">{r.fecha?.seconds ? new Date(r.fecha.seconds * 1000).toLocaleDateString() : 'Sin fecha'}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <button 
                                onClick={() => toggleVerify(r)} 
                                className={`text-[9px] border px-2 py-0.5 rounded transition-colors whitespace-nowrap ${r.verificado ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-gray-600 text-gray-500 hover:border-blue-500 hover:text-blue-400'}`}
                            >
                                {r.verificado ? 'OK' : 'Verif.'}
                            </button>
                            <button 
                                onClick={() => toggleApprove(r)} 
                                className={`text-[9px] border px-2 py-0.5 rounded transition-colors whitespace-nowrap ${r.aprobado ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/10'}`}
                            >
                                {r.aprobado ? 'Vis.' : 'Ocu.'}
                            </button>
                            <button onClick={() => deleteReview(r.id)} className="text-[9px] border border-red-500 text-red-400 px-2 py-0.5 rounded hover:bg-red-500/10">X</button>
                        </div>
                    </div>
                    <p className="italic text-[11px] text-gray-300 bg-black/20 p-1.5 rounded line-clamp-2 hover:line-clamp-none transition-all">"{r.mensaje}"</p>
                </div>
            ))}
            {reviews.length === 0 && <div className="text-center text-gray-500 text-xs py-4">No hay reseñas.</div>}
        </div>
    );
}
