import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { MessageSquarePlus } from 'lucide-react';
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

// Mapeo exacto al proyecto legacy (1-5)
const EMOJI_MAP: Record<number, { src: string, label: string }> = {
    1: { src: '/assets/emojis/angry-smile.png', label: 'Enojado' },
    2: { src: '/assets/emojis/sad-smile.png', label: 'Triste' },
    3: { src: '/assets/emojis/smile.png', label: 'Normal' },
    4: { src: '/assets/emojis/open-mouthed-smile.png', label: 'Feliz' },
    5: { src: '/assets/emojis/hot-smile.png', label: 'Cool' },
};

const Resenas: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', mensaje: '', puntuacion: 3 }); // Default 3 (Normal)
  const [submitting, setSubmitting] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cargar reseñas con onSnapshot (Realtime) + Orden Descendente
  useEffect(() => {
    const q = query(collection(db, 'resenas'), orderBy('fecha', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setReviews(list);
        setLoading(false);
    }, (err) => {
        console.error("Error fetching reviews:", err);
        setError("No se pudieron cargar las reseñas.");
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función de refresco manual (Legacy Force Reload)
  const handleRefresh = async () => {
      setIsRefreshing(true);
      try {
          const q = query(collection(db, 'resenas'), orderBy('fecha', 'desc'));
          const snapshot = await getDocs(q);
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setReviews(list);
      } catch (err) {
          console.error("Error refreshing:", err);
      } finally {
          setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
      }
  };

  // Filtrar solo reseñas aprobadas
  const items = reviews.filter((r: any) => r.aprobado);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.nombre || !form.mensaje) return alert("Completa los campos");
      
      setSubmitting(true);
      try {
          await addDoc(collection(db, 'resenas'), {
              nombre: form.nombre,
              mensaje: form.mensaje,
              puntuacion: form.puntuacion,
              fecha: serverTimestamp(),
              aprobado: false,
              verificado: false
          });
          setForm({ nombre: '', mensaje: '', puntuacion: 3 });
          alert("¡Gracias! Tu reseña ha sido enviada y está pendiente de aprobación.");
      } catch (e) {
          console.error(e);
          alert("Hubo un error al enviar tu reseña.");
      } finally {
          setSubmitting(false);
      }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-[centerExpand_0.6s_ease-out_forwards] max-w-6xl mx-auto p-4">
      
      {/* LEFT COLUMN: FORMULARIO */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl sticky top-4">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <MessageSquarePlus className="text-cyan-400" size={24} />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Escribir Reseña</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-400 tracking-wider ml-1">Nombre / Apodo</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Fan de Frutiger Aero"
                        className="w-full bg-black/50 border border-white/20 rounded-full px-4 py-2 text-white focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] outline-none transition-all placeholder:text-white/20 italic"
                        value={form.nombre}
                        onChange={e => setForm({...form, nombre: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-400 tracking-wider ml-1">Tu Estado de Ánimo (MSN Style)</label>
                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/10">
                        {[1, 2, 3, 4, 5].map(val => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setForm({...form, puntuacion: val})}
                                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-125 relative group ${form.puntuacion === val ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0 opacity-100' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
                                title={EMOJI_MAP[val].label}
                            >
                                <img 
                                    src={EMOJI_MAP[val].src} 
                                    className="w-full h-full object-contain filter" 
                                    alt={EMOJI_MAP[val].label} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-gray-400 tracking-wider ml-1">Tu Mensaje</label>
                    <textarea 
                        placeholder="Comparte tu experiencia..."
                        rows={4}
                        className="w-full bg-black/50 border border-white/20 rounded-2xl px-4 py-3 text-white focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] outline-none transition-all resize-none placeholder:text-white/20 italic"
                        value={form.mensaje}
                        onChange={e => setForm({...form, mensaje: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={submitting}
                    className="mt-2 w-full bg-gradient-to-b from-[#333] to-black border border-white/20 hover:border-white/40 text-white font-bold py-3 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-95"
                >
                    <span>{submitting ? 'Enviando...' : 'Enviar Reseña'}</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                </button>
                <p className="text-xs text-white/40 text-center mt-2">
                    * Tu reseña será revisada por un moderador antes de ser publicada.
                </p>
            </form>
        </div>
      </div>

      {/* RIGHT COLUMN: MURO DE RESEÑAS */}
      <div className="w-full md:w-2/3">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#7CFC00] text-3xl">forum</span>
                <h2 className="text-xl font-bold text-white/90">Muro de Reseñas</h2>
            </div>
            <div className="flex items-center gap-2">
                <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-cyan-400">
                    {items.length} Opiniones
                </span>
                <button 
                    onClick={handleRefresh}
                    className={`w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                    title="Actualizar reseñas"
                >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((review: any, index: number) => {
                const date = review.fecha?.seconds 
                    ? new Date(review.fecha.seconds * 1000).toLocaleDateString() 
                    : "Fecha desconocida";
                
                // Lectura de DB: campo 'puntuacion' (1-5)
                const score = review.puntuacion || 3;
                const emojiData = EMOJI_MAP[score] || EMOJI_MAP[3];
                const isExpanded = expandedReview === review.id;

                return (
                  <div key={index} className="bg-[rgba(255,255,255,0.03)] p-5 rounded-2xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(124,252,0,0.4)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300 relative group shadow-lg flex flex-col hover:-translate-y-1 hover:shadow-2xl backdrop-blur-md">
                    
                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-lg leading-tight group-hover:text-[#7CFC00] transition-colors">
                                    {review.nombre}
                                </h4>
                                {review.verificado && (
                                    <span 
                                        className="material-symbols-outlined text-blue-400 text-base" 
                                        title="Verificado"
                                        style={{ textShadow: '0 0 10px #0df2f2' }}
                                    >
                                        verified
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-white/40">{date}</span>
                        </div>
                        
                        {/* Emoji Avatar Badge */}
                        <div className="relative group/emoji">
                             <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover/emoji:opacity-100 transition-opacity"></div>
                             <img 
                                src={emojiData.src} 
                                alt={emojiData.label}
                                className="w-10 h-10 object-contain relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
                            />
                        </div>
                    </div>
                    
                    {/* Body */}
                    <div className="relative">
                        <span className="absolute -top-2 -left-1 text-4xl text-white/5 font-serif">"</span>
                        <p className={`text-white/80 text-sm leading-relaxed italic px-2 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                           {review.mensaje}
                        </p>
                        <span className="absolute -bottom-4 -right-1 text-4xl text-white/5 font-serif">"</span>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-3 flex justify-start">
                        <button 
                            onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                            className="text-sm font-bold text-[#7CFC00] hover:text-[#9EFF00] cursor-pointer bg-transparent border-none p-0 transition-colors"
                        >
                            {isExpanded ? 'Ver menos' : 'Ver más'}
                        </button>
                    </div>
                  </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Resenas;
