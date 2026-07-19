import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function VideoModal({ video, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!video) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const focusableSelector =
      'a[href], button:not([disabled]), iframe, input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll(focusableSelector));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="modal" role="presentation" onMouseDown={onClose}>
      <section
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal__top">
          <div>
            <p>{video.category} / {video.creator}</p>
            <h2 id="video-modal-title">{video.title}</h2>
          </div>
          <button ref={closeRef} type="button" className="modal__close" onClick={onClose} aria-label="Close video">
            <X size={22} />
          </button>
        </div>
        <div className="video-frame">
          <iframe
            title={`YouTube video: ${video.title}`}
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="modal__description">{video.description}</p>
      </section>
    </div>
  );
}
