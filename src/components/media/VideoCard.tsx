import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoCardProps {
  title: string;
  videoUrl: string;
  thumbnail?: string;
  type: 'youtube' | 'vimeo';
}

export const VideoCard: React.FC<VideoCardProps> = ({ title, videoUrl, thumbnail, type }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = (url: string, type: string) => {
    // Simple parser for standard YouTube/Vimeo URLs
    // In a real app, use a more robust parser
    if (type === 'youtube') {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // Add vimeo logic if needed
    return url;
  };

  const getThumbnailUrl = () => {
    if (thumbnail) return thumbnail;
    
    if (type === 'youtube') {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return '/assets/img/longhorn.jpg'; // Fallback
  };

  return (
    <div className="project-card group relative bg-black/40 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300">
      {!isPlaying ? (
        <div 
          className="relative aspect-video cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          <img 
            src={getThumbnailUrl()} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="fill-white text-white ml-1" size={32} />
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          <iframe 
            src={getEmbedUrl(videoUrl, type)}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
          {title}
        </h3>
      </div>
    </div>
  );
};
