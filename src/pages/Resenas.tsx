import React from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Quote, Calendar, Star } from 'lucide-react';

const Resenas: React.FC = () => {
  const { data: allReviews, loading, error } = useFirestoreCollection('resenas', 'fecha');

  // Filter only approved reviews
  const items = allReviews ? allReviews.filter((r: any) => r.aprobado) : [];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="No se pudieron cargar las reseñas." />;
  
  if (!items || items.length === 0) return <div className="text-white text-center p-10">No hay reseñas públicas disponibles.</div>;

  return (
    <div className="flex flex-col gap-8 animate-[centerExpand_0.6s_ease-out_forwards] max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white drop-shadow-md border-none shadow-none bg-transparent p-0">
          Reseñas y Comentarios
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((review: any, index: number) => {
            // Convert timestamp if needed
            const date = review.fecha?.seconds 
                ? new Date(review.fecha.seconds * 1000).toLocaleDateString() 
                : review.fecha;

            return (
              <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 relative group">
                <Quote className="absolute top-4 right-4 text-white/10 w-12 h-12 rotate-180 group-hover:text-primary/20 transition-colors" />
                
                <div className="flex items-center gap-2 mb-3">
                    {/* Rating Stars */}
                    <div className="flex text-yellow-400">
                        {[...Array(review.puntuacion || 5)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                        ))}
                    </div>
                </div>
                
                <p className="text-white/80 leading-relaxed text-sm mb-6 line-clamp-6 italic">
                  "{review.mensaje}"
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">
                        {review.nombre || "Anónimo"}
                      </span>
                      {review.verificado && (
                          <span className="text-blue-400" title="Verificado">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 11z"/></svg>
                          </span>
                      )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Calendar size={12} />
                    <span>{date}</span>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Resenas;