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
    <div className="flex flex-col h-[calc(100vh-140px)] animate-[centerExpand_0.6s_ease-out_forwards]">
      <div className="music-layout-wrapper">
        {/* Player Visual Side */}
        <div className="player-visual-side">
          <div className="music-player-container">
            {/* Top Bar */}
            <div className="music-topbar flex justify-between items-center w-full pr-2">
              <div className="flex gap-2 items-center">
                 <span className="text-xs font-mono text-primary animate-pulse">
                    {isPlaying ? "REPRODUCIENDO..." : "PAUSADO"}
                 </span>
                 <span className="text-sm font-bold tracking-widest text-white">WINAMP 2007</span>
                 <span className="text-xs font-mono text-white/50">128KBPS</span>
              </div>
              
              {/* HIDDEN ADMIN BUTTON - Disguised as Minimize Button (_) */}
              <button 
                id="admin-access-btn"
                className="w-5 h-5 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold border border-gray-500 rounded-sm shadow-sm"
                title="Minimizar"
                onClick={() => window.location.href = '/admin'}
              >
                _
              </button>
            </div>

            {/* Main Visual */}
            <div className="music-body flex items-center justify-center relative p-8">
              {/* CD Animation */}
              {(() => {
                const hasUrl = !!(currentSong?.url_portada || currentSong?.cover);
                
                // Determinamos la fuente base: si hay URL, úsala; si no, decide según el estado de reproducción
                const fallbackSrc = isPlaying ? '/assets/gifs/cd_spinning.gif' : '/assets/img/cd_stopped.png';
                const imgSrc = hasUrl ? (currentSong?.url_portada || currentSong?.cover) : fallbackSrc;
                
                // Rotación CSS solo si es una imagen estática (portada) y está sonando
                // Si es el GIF, no necesita rotación CSS
                const needsSpin = hasUrl && isPlaying;
                
                return (
                  <div 
                    id="music-cd" 
                    className={`rounded-full border-4 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-1000 ${needsSpin ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                  >
                    <div className="w-full h-full bg-black flex items-center justify-center relative">
                      <img 
                        src={imgSrc} 
                        alt="Album Art" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          // Si la imagen falla, forzar el fallback inmediatamente
                          const target = e.currentTarget;
                          const newSrc = isPlaying ? '/assets/gifs/cd_spinning.gif' : '/assets/img/cd_stopped.png';
                          if (target.src !== window.location.origin + newSrc) {
                              target.src = newSrc;
                          }
                        }}
                      />
                      {/* Center hole decor */}
                      <div className="w-8 h-8 bg-black rounded-full border-2 border-white/20 z-10"></div>
                    </div>
                  </div>
                );
              })()}
              
              {/* Song Info Overlay */}
              <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                <h2 className="text-xl font-bold text-white drop-shadow-md truncate">{currentSong?.titulo || "Unknown Title"}</h2>
                <p className="text-primary text-sm font-medium truncate">{currentSong?.artista || "Unknown Artist"}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="music-bottombar flex flex-col gap-4">
              {/* Progress Bar */}
              <div className="w-full flex items-center gap-3 text-xs font-mono text-primary/80">
                <span>{formatTime(currentTime)}</span>
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
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                />
                <span>{formatTime(duration)}</span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isShuffle ? 'text-primary' : 'text-white/50'}`}
                  >
                    <Shuffle size={16} />
                  </button>
                  <button 
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isRepeat ? 'text-primary' : 'text-white/50'}`}
                  >
                    <Repeat size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={handlePrev} className="text-white hover:text-primary transition-colors">
                    <SkipBack size={24} className="fill-current" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)} 
                    className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(13,242,242,0.5)]"
                  >
                    {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                  </button>
                  <button onClick={handleNext} className="text-white hover:text-primary transition-colors">
                    <SkipForward size={24} className="fill-current" />
                  </button>
                </div>

                <div className="flex items-center gap-2 w-24">
                  {volume === 0 ? <VolumeX size={16} className="text-white/50" /> : <Volume2 size={16} className="text-white/50" />}
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
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
