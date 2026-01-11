import { useCallback } from 'react';

export const useAudio = () => {
  const playHoverSound = useCallback((pitch: number = 1.0) => {
    try {
      const audio = new Audio('/assets/sounds/navbar.wav');
      audio.volume = 1.0;
      // audio.playbackRate = pitch; 
      // audio.preservesPitch = false;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore errors (e.g. user hasn't interacted yet)
    }
  }, []);

  const playClickSound = useCallback(() => {
     try {
       const audio = new Audio('/assets/sounds/click.wav');
       audio.volume = 0.3;
       audio.play().catch(() => {});
     } catch (e) {
       // Ignore errors
     }
  }, []);

  const playMinimizeSound = useCallback(() => {
    try {
      const audio = new Audio('/assets/sounds/msn-sound_1.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  const playNudgeSound = useCallback(() => {
    try {
      const audio = new Audio('/assets/sounds/nudge.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  return { playHoverSound, playClickSound, playMinimizeSound, playNudgeSound };
};
