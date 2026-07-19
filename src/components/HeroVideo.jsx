import { useEffect, useRef, useState } from 'react';

const thumbnailFor = (id, quality = 'maxresdefault') =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

export function HeroVideo({ media, title }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const shouldPlay = inView && pageVisible && !reducedMotion;
  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${media.youtubeId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${media.youtubeId}` +
    `&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1` +
    `&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  useEffect(() => {
    if (!shouldPlay) setReady(false);
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) video.play().catch(() => undefined);
    else video.pause();
  }, [shouldPlay]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      let message = event.data;
      if (typeof message === 'string') {
        try {
          message = JSON.parse(message);
        } catch {
          return;
        }
      }

      const playerState =
        message?.event === 'onStateChange'
          ? message.info
          : message?.event === 'infoDelivery'
            ? message.info?.playerState
            : null;
      if (playerState === 1) setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const onIframeLoad = () => {
    const playerWindow = iframeRef.current?.contentWindow;
    if (!playerWindow) return;
    const send = (payload) => playerWindow.postMessage(JSON.stringify(payload), '*');
    const requestPlayback = () => {
      send({ event: 'listening', id: 'hero-player' });
      send({ event: 'command', func: 'mute', args: [] });
      send({ event: 'command', func: 'playVideo', args: [] });
    };
    requestPlayback();
    window.setTimeout(requestPlayback, 500);
    window.setTimeout(requestPlayback, 1400);

    // Desktop autoplay is consistently available; mobile stays on the poster until playback is confirmed.
    if (!window.matchMedia('(max-width: 820px)').matches) {
      window.setTimeout(() => {
        if (iframeRef.current?.contentWindow === playerWindow) setReady(true);
      }, 2200);
    }
  };

  return (
    <div className="hero-video" ref={rootRef}>
      <img
        className="hero-video__poster"
        src={thumbnailFor(media.posterId)}
        alt=""
        fetchPriority="high"
        onError={(event) => {
          event.currentTarget.src = thumbnailFor(media.posterId, 'hqdefault');
        }}
      />
      {media.mp4Source ? (
        <video
          ref={videoRef}
          className={`hero-video__media ${ready ? 'is-ready' : ''}`}
          src={media.mp4Source}
          poster={thumbnailFor(media.posterId)}
          autoPlay={shouldPlay}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={title}
          onCanPlay={() => setReady(true)}
        />
      ) : (
        shouldPlay && (
          <iframe
            ref={iframeRef}
            className={`hero-video__media ${ready ? 'is-ready' : ''}`}
            src={embedUrl}
            title={`${title} - muted hero preview`}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex="-1"
            aria-hidden="true"
            onLoad={onIframeLoad}
          />
        )
      )}
      <div className="hero-video__veil" />
      {!ready && !reducedMotion && <span className="hero-video__status">Loading reel</span>}
    </div>
  );
}
