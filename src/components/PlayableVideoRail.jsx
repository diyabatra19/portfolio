import { Play } from 'lucide-react';
import { useRef } from 'react';
import { InlineYouTubePlayer } from './InlineYouTubePlayer.jsx';

function DuplicateRailCard({ video, creator }) {
  return (
    <div
      className={video.aspectRatio === '9:16' ? 'rail-card is-portrait' : 'rail-card'}
      aria-hidden="true"
    >
      <img
        src={video.thumbnail}
        alt=""
        width={video.aspectRatio === '9:16' ? 720 : 1280}
        height={video.aspectRatio === '9:16' ? 1280 : 720}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = video.fallbackThumbnail;
        }}
      />
      <span className="rail-card__play">
        <Play size={22} fill="currentColor" />
      </span>
      <span className="rail-card__meta">
        <strong>{video.title}</strong>
        <small>{creator?.client}</small>
      </span>
    </div>
  );
}

function PlayableRailCard({
  railId,
  video,
  creator,
  activeVideoId,
  onActivate,
  onDeactivate,
}) {
  const playerKey = `rail-${railId}-${video.id}`;

  return (
    <article
      className={video.aspectRatio === '9:16' ? 'rail-card is-portrait' : 'rail-card'}
      data-video-id={video.id}
    >
      <InlineYouTubePlayer
        videoId={video.id}
        title={video.title}
        poster={video.thumbnail}
        fallbackPoster={video.fallbackThumbnail}
        aspectRatio={video.aspectRatio}
        active={activeVideoId === playerKey}
        onActivate={() => onActivate(playerKey)}
        onDeactivate={onDeactivate}
        onEnded={onDeactivate}
      />
      <span className="rail-card__creator">{creator?.client}</span>
    </article>
  );
}

export function PlayableVideoRail({
  rail,
  videos,
  creatorsById,
  activeVideoId,
  onActivate,
  onDeactivate,
}) {
  const viewportRef = useRef(null);
  const offsetRef = useRef(0);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, moved: false });
  const playing = activeVideoId?.startsWith(`rail-${rail.id}-`);

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    viewportRef.current?.setPointerCapture(event.pointerId);
    viewportRef.current?.classList.add('is-dragging');
  };

  const onPointerMove = (event) => {
    if (!dragRef.current.active || !viewportRef.current) return;
    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 5) return;
    dragRef.current.moved = true;
    suppressClickRef.current = true;
    viewportRef.current.style.setProperty(
      '--rail-drag',
      `${offsetRef.current + deltaX}px`,
    );
  };

  const finishDrag = (event) => {
    if (!dragRef.current.active || !viewportRef.current) return;
    if (dragRef.current.moved) {
      offsetRef.current += event.clientX - dragRef.current.startX;
      viewportRef.current.style.setProperty('--rail-drag', `${offsetRef.current}px`);
    }
    dragRef.current.active = false;
    viewportRef.current.classList.remove('is-dragging');
    window.setTimeout(() => {
      suppressClickRef.current = false;
      dragRef.current.moved = false;
    }, 0);
  };

  const preventDragClick = (event) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <section
      className={[
        'video-rail',
        rail.direction === 'left' ? 'moves-left' : 'moves-right',
        rail.portrait ? 'is-portrait' : '',
        playing ? 'is-playing' : '',
      ].filter(Boolean).join(' ')}
      aria-labelledby={`rail-${rail.id}-title`}
    >
      <div className="video-rail__heading">
        <h3 id={`rail-${rail.id}-title`}>{rail.title}</h3>
        <span>{videos.length} projects</span>
      </div>
      <div
        className="video-rail__viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={preventDragClick}
      >
        <div className="video-rail__track">
          <div className="video-rail__group">
            {videos.map((video) => (
              <PlayableRailCard
                key={video.id}
                railId={rail.id}
                video={video}
                creator={creatorsById[video.creatorId]}
                activeVideoId={activeVideoId}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
              />
            ))}
          </div>
          <div className="video-rail__group" aria-hidden="true">
            {videos.map((video) => (
              <DuplicateRailCard
                key={`duplicate-${video.id}`}
                video={video}
                creator={creatorsById[video.creatorId]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
