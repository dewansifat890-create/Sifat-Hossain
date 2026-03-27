import { useEffect, useRef, useState } from 'react';

const BG_MUSIC_URL = 'https://image2url.com/r2/default/audio/1774622059647-c43ce5bf-080a-4945-9fd8-80b7c2775b5a.mp3';
const HADI_MUSIC_URL = 'https://image2url.com/r2/default/audio/1774578367651-9430c702-a2e8-4aa4-8ad9-898217cd2daa.mp3';

export default function MusicManager() {
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const hadiAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isHadiPlaying, setIsHadiPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize background music
    bgAudioRef.current = new Audio(BG_MUSIC_URL);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.15;

    // Initialize Hadi music
    hadiAudioRef.current = new Audio(HADI_MUSIC_URL);
    hadiAudioRef.current.loop = false;
    hadiAudioRef.current.volume = 0.5;

    // Listen for custom event to toggle Hadi music
    const handleToggleHadi = () => {
      if (hadiAudioRef.current) {
        if (hadiAudioRef.current.paused) {
          hadiAudioRef.current.play().catch(() => {});
          setIsHadiPlaying(true);
          // Pause background music
          bgAudioRef.current?.pause();
        } else {
          hadiAudioRef.current.pause();
          hadiAudioRef.current.currentTime = 0;
          setIsHadiPlaying(false);
          // Resume background music if not muted
          if (!isMuted) {
            bgAudioRef.current?.play().catch(() => {});
          }
        }
      }
    };

    // Auto-resume background music when Hadi music ends
    if (hadiAudioRef.current) {
      hadiAudioRef.current.onended = () => {
        setIsHadiPlaying(false);
        if (!isMuted) {
          bgAudioRef.current?.play().catch(() => {});
        }
      };
    }

    const handleToggleMute = () => {
      setIsMuted(prev => {
        const newMuted = !prev;
        if (bgAudioRef.current) {
          if (newMuted) {
            bgAudioRef.current.pause();
          } else if (!isHadiPlaying) {
            bgAudioRef.current.play().catch(() => {});
          }
        }
        return newMuted;
      });
    };

    window.addEventListener('toggle-hadi-music', handleToggleHadi);
    window.addEventListener('toggle-bg-music', handleToggleMute);

    // Initial play for background music on first interaction
    const handleFirstInteraction = () => {
      if (!isHadiPlaying && !isMuted) {
        bgAudioRef.current?.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);

    return () => {
      bgAudioRef.current?.pause();
      hadiAudioRef.current?.pause();
      window.removeEventListener('toggle-hadi-music', handleToggleHadi);
      window.removeEventListener('toggle-bg-music', handleToggleMute);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [isHadiPlaying, isMuted]);

  return null;
}
