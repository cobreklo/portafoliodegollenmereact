import React, { useEffect, useState } from 'react';
import { useFirestoreDoc } from '../hooks/useFirestore';

export default function Home() {
  const { data, loading, error } = useFirestoreDoc('web', 'inicio');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (data?.url_foto_perfil) {
      const img = new Image();
      img.src = data.url_foto_perfil;
      img.onload = () => {
          setTimeout(() => setShowProfile(true), 50);
      };
    }
  }, [data]);

  if (loading) return <div className="text-white p-6">Cargando...</div>;
  if (error) return <div className="text-red-500 p-6">Error cargando contenido. Ver consola.</div>;

  return (
    <div className="flex flex-col gap-8 animate-[centerExpand_0.6s_ease-out_forwards]">
      {/* Welcome Section */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-transparent border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -mr-20 -mt-20"></div>

        <h1 className="text-3xl font-bold mb-2 relative z-10 min-h-[1.5em] bg-transparent border-none shadow-none">
          {data?.tituloPrincipal || 'Cargando título...'}
        </h1>

        <p className="text-white/70 max-w-lg leading-relaxed relative z-10 min-h-[3em]">
          {data?.subtituloPrincipal || 'Cargando subtítulo...'}
        </p>
      </div>

      {/* About Section */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {data?.url_foto_perfil && (
            <img 
              src={data.url_foto_perfil}
              className={`w-28 h-28 rounded-full object-cover border border-white/20 transition-opacity duration-500 ${showProfile ? 'opacity-100' : 'opacity-0'}`}
              alt="Retrato"
              width="112" 
              height="112"
            />
          )}

          <div>
            <h2 className="text-2xl font-bold mb-2 min-h-[1.5em] bg-transparent border-none shadow-none">
              {data?.tituloPerfil || 'Sobre mí'}
            </h2>

            <p className="text-white/70 max-w-prose leading-relaxed min-h-[6em]">
              {data?.descripcionPerfil || 'Descripción...'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
