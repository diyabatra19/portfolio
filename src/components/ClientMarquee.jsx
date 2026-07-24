import { useRef } from 'react';

function ClientMarqueeItem({ project, duplicate = false, onClick }) {
  return (
    <a
      className="client-marquee__item"
      href={project.channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate ? 'true' : undefined}
      onClick={onClick}
    >
      <img
        src={project.avatar}
        alt=""
        width="420"
        height="420"
        loading="lazy"
      />
      <span>
        <strong>{project.client}</strong>
        {!project.hideSubscriberCount && project.subscriberCount && (
          <small>{project.subscriberCount} subscribers</small>
        )}
      </span>
    </a>
  );
}

export function ClientMarquee({ projects }) {
  const viewportRef = useRef(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    moved: false,
  });

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
    if (Math.abs(deltaX) < Math.abs(deltaY) || Math.abs(deltaX) < 4) return;
    dragRef.current.moved = true;
    viewportRef.current.style.setProperty(
      '--marquee-drag',
      `${offsetRef.current + deltaX}px`,
    );
  };

  const finishDrag = (event) => {
    if (!dragRef.current.active || !viewportRef.current) return;
    if (dragRef.current.moved) {
      offsetRef.current += event.clientX - dragRef.current.startX;
      viewportRef.current.style.setProperty('--marquee-drag', `${offsetRef.current}px`);
    }
    dragRef.current.active = false;
    viewportRef.current.classList.remove('is-dragging');
  };

  const preventDraggedLink = (event) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    window.setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  };

  return (
    <section className="client-marquee" id="clients" aria-labelledby="clients-title">
      <div className="client-marquee__label">
        <span aria-hidden="true" />
        <h2 id="clients-title">Edited for</h2>
      </div>
      <div
        className="client-marquee__viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="client-marquee__track">
          <div className="client-marquee__group">
            {projects.map((project) => (
              <ClientMarqueeItem
                key={project.id}
                project={project}
                onClick={preventDraggedLink}
              />
            ))}
          </div>
          <div className="client-marquee__group" aria-hidden="true">
            {projects.map((project) => (
              <ClientMarqueeItem
                key={`duplicate-${project.id}`}
                project={project}
                duplicate
                onClick={preventDraggedLink}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
