import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

interface ProfileSectionProps {
  openWidget: (resourceType: 'image' | 'video', callback: (url: string) => void, multiple?: boolean) => void;
}

export function ProfileSection({ openWidget }: ProfileSectionProps) {
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
      alert('Perfil actualizado correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white/5 p-3 rounded border border-white/10 text-xs">
      <div className="grid grid-cols-12 gap-3">
        
        <div className="col-span-12 md:col-span-9 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Título Principal</label>
              <input 
                className="w-full bg-black/30 border border-gray-600 rounded px-2 h-7 text-white focus:border-blue-500 outline-none transition-colors placeholder:text-gray-700" 
                value={data.tituloPrincipal || ''} 
                onChange={e => setData({...data, tituloPrincipal: e.target.value})}
                placeholder="Ej. Mi Portafolio"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Título Perfil</label>
              <input 
                className="w-full bg-black/30 border border-gray-600 rounded px-2 h-7 text-white focus:border-blue-500 outline-none transition-colors placeholder:text-gray-700" 
                value={data.tituloPerfil || ''} 
                onChange={e => setData({...data, tituloPerfil: e.target.value})}
                placeholder="Ej. Sobre Mí"
              />
            </div>
          </div>
          
          <div>
             <label className="block text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Subtítulo</label>
             <textarea 
               className="w-full bg-black/30 border border-gray-600 rounded p-2 h-10 text-white focus:border-blue-500 outline-none resize-none transition-colors placeholder:text-gray-700 leading-tight" 
               value={data.subtituloPrincipal || ''} 
               onChange={e => setData({...data, subtituloPrincipal: e.target.value})}
             />
          </div>

          <div>
             <label className="block text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Descripción Perfil</label>
             <textarea 
                 className="w-full bg-black/30 border border-gray-600 rounded p-2 h-16 text-white focus:border-blue-500 outline-none resize-none transition-colors placeholder:text-gray-700 leading-tight" 
                 value={data.descripcionPerfil || ''} 
                 onChange={e => setData({...data, descripcionPerfil: e.target.value})}
             />
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
           <div className="flex-1 border border-dashed border-gray-600 rounded p-2 flex flex-col items-center justify-center hover:bg-white/5 transition-colors bg-black/20 min-h-[100px]">
               {data.url_foto_perfil ? (
                 <img src={data.url_foto_perfil} alt="Perfil" className="w-16 h-16 rounded-full mb-1 object-cover border-2 border-white/20 shadow-lg" />
               ) : (
                 <div className="w-16 h-16 rounded-full bg-white/10 mb-1 flex items-center justify-center text-xl border border-white/10">👤</div>
               )}
               <button type="button" onClick={() => openWidget('image', (url: string) => setData({...data, url_foto_perfil: url, fotoPerfil: url}))} className="text-blue-400 text-[10px] hover:text-blue-300 font-medium uppercase tracking-wide">
                   {data.url_foto_perfil ? 'Cambiar' : 'Subir Foto'}
               </button>
           </div>
           
           <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-1 rounded font-bold h-7 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-[10px]">
             {loading ? '...' : 'Guardar Cambios'}
           </button>
        </div>
      </div>
    </form>
  );
}
