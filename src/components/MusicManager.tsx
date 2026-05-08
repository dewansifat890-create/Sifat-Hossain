import { useEffect, useRef, useState } from 'react';

const BG_MUSIC_URL = 'https://image2url.com/r2/default/audio/1774622059647-c43ce5bf-080a-4945-9fd8-80b7c2775b5a.mp3';
const HADI_MUSIC_URL = 'https://image2url.com/r2/default/audio/1774578367651-9430c702-a2e8-4aa4-8ad9-898217cd2daa.mp3';

export default function MusicManager() {
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const hadiAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isHadiPlaying, setIsHadiPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('music-muted') === 'true');

  // Initialize Audio objects once
  useEffect(() => {
    if (!bgAudioRef.current) {
      bgAudioRef.current = new Audio(BG_MUSIC_URL);
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = 0.15;
    }
    if (!hadiAudioRef.current) {
      hadiAudioRef.current = new Audio(HADI_MUSIC_URL);
      hadiAudioRef.current.loop = true;
      hadiAudioRef.current.volume = 0.6; // High volume for tribute
    }

    const bgAudio = bgAudioRef.current;
    
    // Auto-play on first interaction logic
    const handleFirstInteraction = () => {
      const currentMuted = localStorage.getItem('music-muted') === 'true';
      if (!currentMuted) {
        bgAudio.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  // Sync state with localStorage and broadcast to UI
  useEffect(() => {
    localStorage.setItem('music-muted', isMuted.toString());
    window.dispatchEvent(new CustomEvent('music-status', { 
      detail: { isMuted } 
    }));
  }, [isMuted]);

  // Global Event Listeners
  useEffect(() => {
    const handleToggleMute = () => setIsMuted(prev => !prev);
    const handleHadiOn = () => setIsHadiPlaying(true);
    const handleHadiOff = () => setIsHadiPlaying(false);

    window.addEventListener('toggle-bg-music', handleToggleMute);
    window.addEventListener('hadi-music-on', handleHadiOn);
    window.addEventListener('hadi-music-off', handleHadiOff);

    return () => {
      window.removeEventListener('toggle-bg-music', handleToggleMute);
      window.removeEventListener('hadi-music-on', handleHadiOn);
      window.removeEventListener('hadi-music-off', handleHadiOff);
    };
  }, []);

  // Audio Playback Control Logic
  useEffect(() => {
    const bgAudio = bgAudioRef.current;
    const hadiAudio = hadiAudioRef.current;
    if (!bgAudio || !hadiAudio) return;

    // Background Music
    if (isMuted) {
      bgAudio.pause();
    } else if (!isHadiPlaying) {
      bgAudio.play().catch(() => {});
    } else {
      bgAudio.pause(); // Pause bg when hadi plays
    }

    // Hadi Music (Independent of isMuted based on user request)
    if (isHadiPlaying) {
      hadiAudio.play().catch(() => {});
    } else {
      hadiAudio.pause();
      hadiAudio.currentTime = 0;
    }
  }, [isMuted, isHadiPlaying]);

  return null;
}
