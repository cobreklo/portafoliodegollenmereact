import React from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

const Cortometrajes: React.FC = () => {
  const { data: items, loading, error } = useFirestoreCollection('cortometrajes');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="No se pudieron cargar los cortometrajes." />;
  
  if (!items || items.length === 0) return <div className="text-white text-center p-10">No hay cortometrajes disponibles por el momento.</div>;

  return (
    <div className="flex flex-col gap-8 animate-[centerExpand_0.6s_ease-out_forwards]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white drop-shadow-md border-none shadow-none bg-transparent p-0">
          Cortometrajes
        </h2>
      </div>

      <div className="flex flex-col gap-12">
        {items.map((short: any, index: number) => {
          // Construct embed URL if videoId exists, otherwise use url if present
          const videoSrc = short.videoId 
            ? `https://www.youtube.com/embed/${short.videoId}` 
            : short.url;

          return (
            <div key={index} className="flex flex-col md:flex-row gap-6 bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
              {/* Video Facade/Container */}
              <div className="w-full md:w-2/3 aspect-video bg-black rounded-xl overflow-hidden relative group">
                 <iframe 
                   src={videoSrc} 
                   title={short.titulo}
                   className="w-full h-full"
                   allow="autoplay; fullscreen"
                   loading="lazy"
                 ></iframe>
              </div>

              {/* Info */}
              <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                <h3 className="text-2xl font-bold text-primary">{short.titulo}</h3>
                <div className="h-1 w-20 bg-primary/50 rounded-full"></div>
                <p className="text-white/80 leading-relaxed text-sm">
                  {short.descripcion || "Sin descripción disponible."}
                </p>
                {short.fecha && (
                  <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-white/60 w-fit">
                    Fecha: {new Date(short.fecha).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cortometrajes;