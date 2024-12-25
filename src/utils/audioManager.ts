import { useEffect, useRef } from 'react';

interface AudioAssets {
  battleMusic: string;
  victory: string;
  defeat: string;
  hit: string;
  critical: string;
  miss: string;
  levelUp: string;
}

const AUDIO_ASSETS: AudioAssets = {
  battleMusic: 'https://assets.mixkit.co/music/preview/mixkit-epic-orchestra-loop-228.mp3',
  victory: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
  defeat: 'https://assets.mixkit.co/sfx/preview/mixkit-failure-arcade-alert-notification-240.mp3',
  hit: 'https://assets.mixkit.co/sfx/preview/mixkit-sword-slash-swoosh-1476.mp3',
  critical: 'https://assets.mixkit.co/sfx/preview/mixkit-epic-impact-afar-explosion-2782.mp3',
  miss: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3',
  levelUp: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'
};

export function useAudio() {
  const audioRefs = useRef<{ [K in keyof AudioAssets]?: HTMLAudioElement }>({});
  const isPlayingRef = useRef<{ [K in keyof AudioAssets]?: boolean }>({});

  useEffect(() => {
    Object.entries(AUDIO_ASSETS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audioRefs.current[key as keyof AudioAssets] = audio;
      isPlayingRef.current[key as keyof AudioAssets] = false;
    });

    if (audioRefs.current.battleMusic) {
      audioRefs.current.battleMusic.loop = true;
      audioRefs.current.battleMusic.volume = 0.3;
    }

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const playSound = async (type: keyof AudioAssets) => {
    const audio = audioRefs.current[type];
    if (audio && !isPlayingRef.current[type]) {
      try {
        isPlayingRef.current[type] = true;
        audio.currentTime = 0;
        await audio.play();
      } catch (error) {
        console.error(`Error playing ${type} sound:`, error);
      } finally {
        isPlayingRef.current[type] = false;
      }
    }
  };

  const stopSound = (type: keyof AudioAssets) => {
    const audio = audioRefs.current[type];
    if (audio && isPlayingRef.current[type]) {
      audio.pause();
      audio.currentTime = 0;
      isPlayingRef.current[type] = false;
    }
  };

  return { playSound, stopSound };
}