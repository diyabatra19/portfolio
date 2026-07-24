import { Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const fallbackThumbnail = (videoId) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export function InlineYouTubePlayer({
  videoId,
  title,
  poster,
  fallbackPoster,
  aspectRatio = '16:9',
  active,
  onActivate,
  onDeactivate,
  onEnded,
  eager = false,
}) {
  const iframeRef = useRef(null);
  const readyRef = useRef(false);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    if (!active) {
      readyRef.current = false;
      return undefined;
    }

    const resetFrame = window.requestAnimationFrame(() => setEmbedFailed(false));
    const onMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      let payload = event.data;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }
      if (payload?.event === 'onReady' || payload?.event === 'infoDelivery') {
        readyRef.current = true;
        setEmbedFailed(false);
      }
      if (payload?.event === 'infoDelivery' && payload?.info?.playerState === 0) {
        onEnded?.();
      }
    };

    const failureTimer = window.setTimeout(() => {
      if (!readyRef.current) setEmbedFailed(true);
    }, 9000);

    window.addEventListener('message', onMessage);
    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.clearTimeout(failureTimer);
      window.removeEventListener('message', onMessage);
    };
  }, [active, onEnded]);

  const onIframeLoad = () => {
    const playerWindow = iframeRef.current?.contentWindow;
    if (!playerWindow) return;
    const listen = () => {
      playerWindow.postMessage(
        JSON.stringify({ event: 'listening', id: `inline-${videoId}` }),
        '*',
      );
    };
    listen();
    window.setTimeout(listen, 400);
  };

  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&playsinline=1&controls=1&rel=0&modestbranding=1` +
    `&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div
      className={[
        'inline-player',
        active ? 'is-active' : '',
        aspectRatio === '9:16' ? 'is-portrait' : '',
      ].filter(Boolean).join(' ')}
    >
      {active ? (
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={`YouTube video: ${title}`}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={onIframeLoad}
          />
          <button
            className="inline-player__close"
            type="button"
            onClick={onDeactivate}
            aria-label={`Stop ${title}`}
          >
            <X size={18} />
          </button>
          {embedFailed && (
            <a
              className="inline-player__fallback"
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Playback unavailable. Open on YouTube
            </a>
          )}
        </>
      ) : (
        <button
          className="inline-player__poster"
          type="button"
          onClick={onActivate}
          aria-label={`Play ${title}`}
        >
          <img
            src={poster}
            alt={`Thumbnail for ${title}`}
            width="1280"
            height="720"
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackPoster || fallbackThumbnail(videoId);
            }}
          />
          <span className="inline-player__shade" />
          <span className="inline-player__play" aria-hidden="true">
            <Play size={28} fill="currentColor" />
          </span>
          <span className="inline-player__title">{title}</span>
        </button>
      )}
    </div>
  );
}
