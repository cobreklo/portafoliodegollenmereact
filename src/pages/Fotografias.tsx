import React, { useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Fotografias: React.FC = () => {
  const { data: albums, loading, error } = useFirestoreCollection('albumes');
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="No se pudieron cargar los álbumes." />;
  if (!albums || albums.length === 0) return <div className="text-white text-center p-10">No hay álbumes disponibles.</div>;

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll to top of gallery when changing page
    const galleryTop = document.getElementById('gallery-top');
    if (galleryTop) galleryTop.scrollIntoView({ behavior: 'smooth' });
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedAlbum) {
      setSelectedImageIndex((selectedImageIndex + 1) % selectedAlbum.fotos.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedAlbum) {
      setSelectedImageIndex((selectedImageIndex - 1 + selectedAlbum.fotos.length) % selectedAlbum.fotos.length);
    }
  };

  // Album Detail View
  if (selectedAlbum) {
    const photos = selectedAlbum.fotos || [];
    const totalPages = Math.ceil(photos.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPhotos = photos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div id="gallery-top" className="flex flex-col gap-6 animate-[centerExpand_0.6s_ease-out_forwards]">
            <div className="flex items-center gap-4 mb-4">
                <button 
                    onClick={() => {
                        setSelectedAlbum(null);
                        setCurrentPage(1);
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-md p-0 m-0">
                        {selectedAlbum.titulo}
                    </h2>
                    <span className="text-xs text-primary/70 uppercase tracking-widest">
                        {photos.length} Fotos
                    </span>
                </div>
            </div>

            {photos.length === 0 ? (
                <div className="text-white/50 text-center py-10">Este álbum está vacío.</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentPhotos.map((url: string, index: number) => (
                            <div 
                                key={startIndex + index}
                                onClick={() => openLightbox(startIndex + index)}
                                className="project-card-image aspect-square rounded-xl overflow-hidden cursor-zoom-in relative group bg-black/20 border border-white/10"
                            >
                                <img 
                                    src={url} 
                                    alt={`Foto ${startIndex + index + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-white/70 text-sm">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}

             {/* Lightbox Modal */}
            {selectedImageIndex !== null && (
                <div 
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={closeLightbox}
                >
                <button 
                    onClick={closeLightbox}
                    className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-50"
                >
                    <X size={32} />
                </button>

                <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all hidden md:block"
                >
                    <ChevronLeft size={48} />
                </button>

                <div className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center">
                    <img 
                    src={photos[selectedImageIndex]} 
                    alt="Full size"
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                    />
                </div>

                <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all hidden md:block"
                >
                    <ChevronRight size={48} />
                </button>
                </div>
            )}
        </div>
    );
  }

  // Albums List View
  return (
    <div className="flex flex-col gap-6 animate-[centerExpand_0.6s_ease-out_forwards]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white drop-shadow-md border-none shadow-none bg-transparent p-0">
          Galería de Álbumes
        </h2>
        <span className="text-xs text-primary/70 uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-full">
          {albums.length} Álbumes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album: any) => (
          <div 
            key={album.id}
            onClick={() => {
                setSelectedAlbum(album);
                setCurrentPage(1);
            }}
            className="project-card group relative bg-black/40 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-video overflow-hidden">
                <img 
                    src={album.portadaUrl || '/assets/img/cd_stopped.png'} 
                    alt={album.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
            </div>
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                {album.titulo}
              </h3>
              <p className="text-xs text-white/60">
                {album.fotos ? album.fotos.length : 0} Fotos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fotografias;
