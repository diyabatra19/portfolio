import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { InlineYouTubePlayer } from './InlineYouTubePlayer.jsx';

const wrapIndex = (index, length) => (index + length) % length;

function RearProjectCard({ video, depth, onSelect }) {
  return (
    <button
      className="video-stack__rear"
      style={{ '--stack-depth': depth }}
      type="button"
      onClick={onSelect}
      aria-label={`Bring ${video.title} to the front`}
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
      <span aria-hidden="true">
        <Play size={20} fill="currentColor" />
      </span>
    </button>
  );
}

export function VideoStack({
  creator,
  videos,
  activeVideoId,
  onActivate,
  onDeactivate,
  compact = false,
  eager = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, moved: false });
  const suppressClickRef = useRef(false);
  const isSingle = videos.length <= 1;
  const activeVideo = videos[activeIndex] || videos[0];
  const portrait = activeVideo?.aspectRatio === '9:16';
  const activePlayerKey = activeVideo
    ? `stack-${creator.id}-${activeVideo.id}`
    : '';

  const rearVideos = useMemo(() => {
    if (videos.length <= 1) return [];
    return [1, 2]
      .filter((depth) => depth < videos.length)
      .map((depth) => ({
        depth,
        index: wrapIndex(activeIndex + depth, videos.length),
        video: videos[wrapIndex(activeIndex + depth, videos.length)],
      }));
  }, [activeIndex, videos]);

  const selectIndex = (nextIndex) => {
    if (nextIndex === activeIndex || !videos.length) return;
    onDeactivate();
    setActiveIndex(wrapIndex(nextIndex, videos.length));
  };

  const move = (direction) => selectIndex(activeIndex + direction);

  const onPointerDown = (event) => {
    if (isSingle || event.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    stageRef.current?.setPointerCapture(event.pointerId);
    stageRef.current?.classList.add('is-dragging');
  };

  const onPointerMove = (event) => {
    if (!dragRef.current.active || !stageRef.current) return;
    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 5) return;
    dragRef.current.moved = true;
    suppressClickRef.current = true;
    stageRef.current.style.setProperty('--stack-drag', `${deltaX * 0.22}px`);
  };

  const finishDrag = (event) => {
    if (!dragRef.current.active || !stageRef.current) return;
    const deltaX = event.clientX - dragRef.current.startX;
    stageRef.current.style.removeProperty('--stack-drag');
    stageRef.current.classList.remove('is-dragging');
    dragRef.current.active = false;
    if (dragRef.current.moved && Math.abs(deltaX) > 46) {
      move(deltaX < 0 ? 1 : -1);
    }
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

  const onKeyDown = (event) => {
    if (isSingle) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };

  if (!activeVideo) return null;

  return (
    <div
      className={[
        'video-stack',
        portrait ? 'is-portrait' : '',
        compact ? 'is-compact' : '',
        isSingle ? 'is-single' : '',
      ].filter(Boolean).join(' ')}
      aria-label={`${creator.client} project carousel`}
    >
      <div
        className="video-stack__stage"
        ref={stageRef}
        tabIndex={isSingle ? -1 : 0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={preventDragClick}
      >
        {[...rearVideos].reverse().map(({ depth, index, video }) => (
          <RearProjectCard
            key={video.id}
            video={video}
            depth={depth}
            onSelect={() => selectIndex(index)}
          />
        ))}
        <div className="video-stack__active">
          <InlineYouTubePlayer
            videoId={activeVideo.id}
            title={activeVideo.title}
            poster={activeVideo.thumbnail}
            fallbackPoster={activeVideo.fallbackThumbnail}
            aspectRatio={activeVideo.aspectRatio}
            active={activeVideoId === activePlayerKey}
            onActivate={() => onActivate(activePlayerKey)}
            onDeactivate={onDeactivate}
            onEnded={onDeactivate}
            eager={eager}
          />
        </div>
      </div>

      {!isSingle && (
        <div className="video-stack__controls">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={`Previous ${creator.client} project`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="video-stack__dots" aria-label="Choose project">
            {videos.map((video, index) => (
              <button
                key={video.id}
                className={index === activeIndex ? 'is-active' : ''}
                type="button"
                onClick={() => selectIndex(index)}
                aria-label={`Show project ${index + 1}: ${video.title}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
          <span className="video-stack__count" aria-live="polite">
            {activeIndex + 1} / {videos.length}
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={`Next ${creator.client} project`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
