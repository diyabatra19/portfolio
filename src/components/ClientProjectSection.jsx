import { ArrowUpRight } from 'lucide-react';
import { VideoStack } from './VideoStack.jsx';

function ClientProfilePanel({ project, projectCount }) {
  const showTestimonial =
    project.testimonial &&
    (project.testimonialStatus === 'verified' || import.meta.env.DEV);

  return (
    <aside className="client-profile glass-surface">
      <span className="client-profile__number">
        {String(project.priority).padStart(2, '0')}
      </span>
      <img
        className="client-profile__avatar"
        src={project.avatar}
        alt={`${project.client} YouTube channel avatar`}
        width="420"
        height="420"
        loading="lazy"
      />
      <p>{project.creatorLabel}</p>
      <a
        className="client-profile__channel"
        href={project.channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.client} on YouTube`}
      >
        <h3>{project.client}</h3>
        <ArrowUpRight size={20} aria-hidden="true" />
      </a>
      <span className="client-profile__handle">{project.handle}</span>
      {!project.hideSubscriberCount && project.subscriberCount && (
        <strong>{project.subscriberCount} subscribers</strong>
      )}
      <span className="client-profile__projects">
        {projectCount} {projectCount === 1 ? 'project' : 'projects'}
      </span>

      {showTestimonial && (
        <div className="client-profile__testimonial">
          <blockquote>&ldquo;{project.testimonial}&rdquo;</blockquote>
          {project.testimonialStatus === 'placeholder' && (
            <span>Sample copy - replace before launch</span>
          )}
        </div>
      )}
    </aside>
  );
}

export function ClientProjectSection({
  project,
  videos,
  activeVideoId,
  onActivate,
  onDeactivate,
}) {
  const videoRight = project.layout === 'video-right';

  return (
    <article
      className={videoRight ? 'client-project is-video-right' : 'client-project'}
      id={`project-${project.id}`}
      data-reveal
      data-client={project.id}
    >
      <div className="client-project__media">
        <VideoStack
          creator={project}
          videos={videos}
          activeVideoId={activeVideoId}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          eager={project.priority === 1}
        />
      </div>
      <ClientProfilePanel project={project} projectCount={videos.length} />
    </article>
  );
}
