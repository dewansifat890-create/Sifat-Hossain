/**
 * Utility to parse video URLs and return a standardized embed URL or direct link.
 * Supports YouTube, Vimeo, and direct file links.
 */
export function getEmbedUrl(url: string | null | undefined): { type: 'youtube' | 'direct' | 'none'; url: string } {
  if (!url) return { type: 'none', url: '' };

  // YouTube identification
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return { 
      type: 'youtube', 
      url: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0` 
    };
  }

  // Direct video file identification (basic check)
  const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(url) || url.includes('storage.googleapis.com') || url.includes('firebase');
  
  if (isDirectVideo) {
    return { type: 'direct', url };
  }

  // Fallback for other URLs - treat as direct if not identified but user might want to try
  return { type: 'direct', url };
}
