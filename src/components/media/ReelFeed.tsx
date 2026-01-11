import React, { useEffect, useRef, useState } from 'react';
import { useFirestoreDoc } from '../../hooks/useFirestore';

export const ReelFeed: React.FC = () => {
  const { data, loading } = useFirestoreDoc('contenido', 'reel');
  const containerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      if (data.playlist && Array.isArray(data.playlist)) {
        setVideos(data.playlist);
      } else if (data.videoId) {
        setVideos([{ videoId: data.videoId, title: data.titulo }]);
      }
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const iframe = entry.target as HTMLIFrameElement;
        // Check if iframe is loaded/ready to avoid errors? 
        // postMessage is safe even if not ready usually, but best practice is wait.
        // For simplicity 1:1 migration:
        if (entry.isIntersecting) {
          iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
          iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      });
    }, { threshold: 0.6 });

    const iframes = containerRef.current?.querySelectorAll('iframe');
    iframes?.forEach((iframe) => observer.observe(iframe));

    return () => observer.disconnect();
  }, [videos]);

  if (loading) return <div className="text-white p-6">Cargando Reels...</div>;
  if (!videos.length && !loading) return <div className="text-white p-6">No hay reels disponibles.</div>;

  return (
    <div 
        id="reel-feed-container" 
        ref={containerRef}
        className="h-[calc(100vh-140px)] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide rounded-xl"
    >
      {videos.map((video, index) => (
        <div key={index} className="w-full h-full snap-center relative flex items-center justify-center bg-black overflow-hidden">
          <iframe
            id={`reel-frame-${index}`}
            src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1&rel=0&controls=1&loop=1&playlist=${video.videoId}`}
            className="w-full h-full absolute inset-0 object-cover pointer-events-auto reel-iframe"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="absolute bottom-20 left-4 z-10 pointer-events-none">
            {video.title && (
              <h2 className="text-white font-bold text-shadow drop-shadow-md bg-black/50 px-2 rounded backdrop-blur-sm">
                {video.title}
              </h2>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
