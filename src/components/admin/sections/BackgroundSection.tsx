import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

export interface BackgroundSectionProps {
  openWidget: (resourceType: 'image' | 'video', callback: (url: string) => void, multiple?: boolean) => void;
}

export function BackgroundSection({ openWidget }: BackgroundSectionProps) {
  const [data, setData] = useState<{ backgroundImage?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'theme')).then(snap => {
      if (snap.exists()) setData(snap.data());
    });
  }, []);

  const handleReset = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar el fondo actual y volver al predeterminado (Longhorn)?')) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'theme'), { 
        backgroundImage: '' 
      }, { merge: true });
      setData({ backgroundImage: '' });
      alert('Fondo eliminado. Se usará el predeterminado.');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar fondo');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'theme'), { 
        backgroundImage: data.backgroundImage 
      }, { merge: true });
      alert('Fondo actualizado correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white/5 p-4 rounded-lg border border-white/10">
      <div className="flex flex-col gap-4">
        
        {/* Preview Area */}
        <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/20 relative group bg-black/50">
          {data.backgroundImage ? (
            <div 
              className="w-full h-full bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${data.backgroundImage})` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 flex-col gap-2">
                <span className="text-4xl">🖼️</span>
                <span className="text-sm">Sin fondo personalizado (Usando Longhorn)</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
             <button 
               type="button" 
               onClick={() => openWidget('image', (url: string) => setData({ backgroundImage: url }))}
               className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded border border-white/20 backdrop-blur-md transition-all transform hover:scale-105"
             >
               Cambiar Imagen de Fondo
             </button>
          </div>
        </div>

        {/* Info & Actions */}
        <div className="flex justify-between items-center gap-4">
            <p className="text-xs text-white/50 flex-1">
                Se recomienda una imagen de alta resolución (1920x1080 o superior).
            </p>
            
            <div className="flex gap-2">
              {data.backgroundImage && (
                <button 
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded font-bold transition-all shadow-lg disabled:opacity-50 text-xs uppercase tracking-wider"
                >
                  Borrar Fondo
                </button>
              )}
              
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wider"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
        </div>
      </div>
    </form>
  );
}
