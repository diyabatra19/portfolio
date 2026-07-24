import { ArrowUpRight } from 'lucide-react';
import { VideoStack } from './VideoStack.jsx';

function MoreEditsCard({
  creator,
  videos,
  activeVideoId,
  onActivate,
  onDeactivate,
}) {
  const portrait = videos[0]?.aspectRatio === '9:16';

  return (
    <article
      className={portrait ? 'more-edits-card is-portrait' : 'more-edits-card'}
      data-reveal
      data-client={creator.id}
    >
      <header className="more-edits-card__identity">
        <img
          src={creator.avatar}
          alt={`${creator.client} YouTube channel avatar`}
          width="420"
          height="420"
          loading="lazy"
        />
        <div>
          <span>{creator.creatorLabel}</span>
          <a
            href={creator.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${creator.client} on YouTube`}
          >
            <h3>{creator.client}</h3>
            <ArrowUpRight size={18} />
          </a>
          {creator.subscriberCount && (
            <small>{creator.subscriberCount} subscribers</small>
          )}
        </div>
      </header>
      <VideoStack
        creator={creator}
        videos={videos}
        activeVideoId={activeVideoId}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        compact
      />
    </article>
  );
}

export function MoreEditsShowcase({
  creators,
  getVideos,
  activeVideoId,
  onActivate,
  onDeactivate,
}) {
  return (
    <section className="more-edits" id="more-edits" aria-labelledby="more-edits-title">
      <div className="section-heading">
        <p>More edits</p>
        <h2 id="more-edits-title">More formats. Same pace.</h2>
      </div>
      <div className="more-edits__grid">
        {creators.map((creator) => (
          <MoreEditsCard
            key={creator.id}
            creator={creator}
            videos={getVideos(creator)}
            activeVideoId={activeVideoId}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        ))}
      </div>
    </section>
  );
}
