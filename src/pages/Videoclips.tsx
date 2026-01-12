import React from 'react';
import { useFirestoreDoc } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { VideoCard } from '../components/media/VideoCard';

const Videoclips: React.FC = () => {
  const { data, loading, error } = useFirestoreDoc('contenido', 'videos');

  const items = data?.items || [];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="No se pudieron cargar los videoclips." />;
  if (!items || items.length === 0) return <div className="text-white text-center p-10">No hay videoclips disponibles.</div>;

  return (
    <div className="flex flex-col gap-6 animate-[centerExpand_0.6s_ease-out_forwards]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white drop-shadow-md border-none shadow-none bg-transparent p-0">
          Videoclips Musicales
        </h2>
        <span className="text-xs text-primary/70 uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-full">
          {items.length} Archivos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((video: any, index: number) => (
          <VideoCard 
            key={index}
            title={video.titulo}
            videoUrl={video.url}
            thumbnail={video.thumbnail}
            type={video.tipo || 'youtube'}
          />
        ))}
      </div>
    </div>
  );
};

export default Videoclips;