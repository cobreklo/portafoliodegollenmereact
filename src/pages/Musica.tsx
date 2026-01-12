import React, { useState, useRef, useEffect } from 'react';
import { useFirestoreDoc } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Volume1, VolumeX, ListMusic } from 'lucide-react';

const Musica: React.FC = () => {
  const { data, loading, error } = useFirestoreDoc('contenido', 'musica');
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Use Firestore data if available
  // Legacy migration: check 'listaCanciones' first, then 'items'
  const playlist = data?.listaCanciones || data?.items || [];
  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSongEnd = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentSongIndex(nextIndex);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="No se pudo cargar la música." />;
  if (playlist.length === 0) return <div className="text-white text-center p-10">No hay canciones disponibles.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-[centerExpand_0.6s_ease-out_forwards] relative">
      {/* Page Background Layer - Full Screen Blur */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
           backgroundImage: currentSong?.url_portada || currentSong?.cover ? `url(${currentSong.url_portada || currentSong.cover})` : 'none',
           filter: 'blur(40px) brightness(0.3) saturate(1.2)'
        }}
      />
      
      <div className="music-layout-wrapper">
        {/* Player Visual Side */}
        <div className="player-visual-side">
          <div className="music-player-container rounded-2xl overflow-hidden relative bg-black/40 border border-white/10 shadow-2xl backdrop-blur-sm">
            {/* Top Bar & Controls */}
            <div className="music-topbar flex flex-col gap-2 p-3 border-b border-white/10 bg-black/40">
               <div className="flex items-center justify-between w-full">
                   <div className="text-white font-bold text-sm flex items-center gap-2">
                       <ListMusic className="text-primary" size={18} />
                       <span className="tracking-wide">Music Player</span>
                   </div>
                   <div className="flex items-center gap-2">
                       <button 
                         id="admin-access-btn"
                         className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-full border border-white/10 transition-colors"
                         title="Minimizar"
                         onClick={() => window.location.href = '/admin'}
                       >
                         _
                       </button>
                       <button className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-red-500/80 hover:border-red-500 text-white text-[10px] rounded-full border border-white/10 transition-colors">✕</button>
                   </div>
               </div>
               
               <div className="flex flex-wrap items-center justify-between w-full gap-2 mt-1">
                   {/* Playback Controls */}
                   <div className="main-controls flex items-center gap-2">
                     <button onClick={handlePrev} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95">
                       <SkipBack size={14} className="fill-current" />
                     </button>
                     <button 
                       onClick={() => setIsPlaying(!isPlaying)} 
                       className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-primary/50 shadow-[0_0_10px_rgba(13,242,242,0.2)] flex items-center justify-center text-white transition-all active:scale-95"
                     >
                       {isPlaying ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white ml-0.5" />}
                     </button>
                     <button onClick={handleNext} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95">
                       <SkipForward size={14} className="fill-current" />
                     </button>
                   </div>

                   {/* Volume & Tools */}
                   <div className="extra-controls flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                       {volume === 0 ? <VolumeX size={14} className="text-white/60" /> : <Volume2 size={14} className="text-white/60" />}
                       <input 
                         type="range" 
                         min="0" 
                         max="1" 
                         step="0.05" 
                         value={volume}
                         onChange={(e) => setVolume(Number(e.target.value))}
                         className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                       />
                       <div className="w-px h-3 bg-white/10 mx-1"></div>
                       <button 
                         onClick={() => setIsShuffle(!isShuffle)}
                         className={`hover:text-primary transition-colors ${isShuffle ? 'text-primary' : 'text-white/60'}`}
                         title="Shuffle"
                       >
                         <Shuffle size={14} />
                       </button>
                       <button 
                         onClick={() => setIsRepeat(!isRepeat)}
                         className={`hover:text-primary transition-colors ${isRepeat ? 'text-primary' : 'text-white/60'}`}
                         title="Repeat"
                       >
                         <Repeat size={14} />
                       </button>
                   </div>
               </div>
            </div>

            {/* Main Visual */}
            <div 
              className="music-body flex flex-col items-center justify-center relative flex-1 min-h-[250px] p-0 overflow-hidden"
            >
              {/* Background with Artwork */}
              <div 
                className="absolute inset-0 bg-center bg-cover z-0 transition-all duration-700"
                style={{ 
                  backgroundImage: currentSong?.url_portada || currentSong?.cover ? `url(${currentSong.url_portada || currentSong.cover})` : 'none',
                  filter: 'brightness(0.8)'
                }}
              ></div>
              
              {/* CD Animation */}
              <div 
                id="music-cd" 
                className="relative z-10 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.6)]"
              >
                  <img 
                    src={isPlaying ? '/assets/gifs/cd_spinning.gif' : '/assets/img/cd_stopped.png'} 
                    alt="CD" 
                    className="w-[200px] h-[200px] object-contain rounded-full border-[6px] border-white/10 shadow-inner"
                  />
                  {/* Center hole decor */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black/80 rounded-full border border-white/20"></div>
              </div>
              
              {/* Progress Bar (Bottom of Visual) */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-4 pt-8 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between text-white/90 text-[10px] mb-1.5 font-medium drop-shadow-md tracking-wider font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={duration || 100} 
                    value={currentTime}
                    onChange={(e) => {
                      const time = Number(e.target.value);
                      if (audioRef.current) audioRef.current.currentTime = time;
                      setCurrentTime(time);
                    }}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(13,242,242,0.8)]"
                  />
              </div>
            </div>

            {/* Song Info (Separate Bottom Bar) */}
            <div className="music-bottombar flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md border-t border-white/10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-20"></div>
                <div className="relative z-10">
                    <h2 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-lg truncate max-w-[280px]">
                      {currentSong?.titulo || "Selecciona una canción"}
                    </h2>
                    <p className="text-primary/90 text-sm font-medium tracking-wide drop-shadow truncate max-w-[280px]">
                      {currentSong?.artista || "--"}
                    </p>
                </div>
            </div>
          </div>
        </div>

        {/* Playlist Side */}
        <div className="playlist-side">
          <div className="flex items-center gap-2 mb-4 px-2">
            <ListMusic className="text-primary" size={20} />
            <h3 className="text-lg font-bold text-white">Playlist</h3>
          </div>
          
          <ul id="music-playlist" className="flex flex-col gap-2">
            {playlist.map((song: any, index: number) => (
              <li 
                key={index}
                onClick={() => {
                  setCurrentSongIndex(index);
                  setIsPlaying(true);
                }}
                className={`music-list-item p-3 rounded-lg cursor-pointer transition-all border border-transparent ${
                  currentSongIndex === index 
                    ? 'bg-primary/20 border-primary/50 text-primary' 
                    : 'bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col truncate pr-2">
                    <span className="font-bold text-sm truncate">{song.titulo}</span>
                    <span className="text-xs opacity-70 truncate">{song.artista}</span>
                  </div>
                  {currentSongIndex === index && isPlaying && (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 bg-primary animate-[bounce_0.5s_infinite] h-full"></div>
                      <div className="w-0.5 bg-primary animate-[bounce_0.7s_infinite] h-2/3"></div>
                      <div className="w-0.5 bg-primary animate-[bounce_0.6s_infinite] h-full"></div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentSong?.url_audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
      />
    </div>
  );
};

export default Musica;
