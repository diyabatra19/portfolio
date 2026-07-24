import {
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  Instagram,
  Linkedin,
  Menu,
  Play,
  X,
  Youtube,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatedStats } from './components/AnimatedStats.jsx';
import { ClientMarquee } from './components/ClientMarquee.jsx';
import { ClientProjectSection } from './components/ClientProjectSection.jsx';
import { HeroVideo } from './components/HeroVideo.jsx';
import { MoreEditsShowcase } from './components/MoreEditsShowcase.jsx';
import { PlayableVideoRail } from './components/PlayableVideoRail.jsx';
import { WorkWithSkido } from './components/WorkWithSkido.jsx';
import { portfolioData as data } from './data/portfolio.js';

const visibleSocialLinks = data.contact.socialLinks.filter((link) => link.href);
const videosById = Object.fromEntries(data.videos.map((video) => [video.id, video]));
const creatorsById = Object.fromEntries(
  data.creatorProjects.map((creator) => [creator.id, creator]),
);

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function getVideo(id) {
  return videosById[id];
}

function getCreatorVideos(creator) {
  return creator.videoIds.map((id) => videosById[id]).filter(Boolean);
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <header className="site-header glass-surface">
      <a className="wordmark" href="#top" aria-label="SkidoEdits home">
        <img src={data.brand.assets.mascot} alt="" width="357" height="357" />
        <span>{data.brand.name}</span>
      </a>
      <button
        className="nav-toggle"
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={open ? 'site-nav site-nav--open' : 'site-nav'} aria-label="Main navigation">
        {data.navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function MagneticLink({ href, children, variant = 'primary', icon, external = false }) {
  const ref = useRef(null);

  const onPointerMove = (event) => {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.06;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.06;
    element.style.setProperty('--button-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--button-y', `${event.clientY - rect.top}px`);
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      className={`button button--${variant}`}
      href={href}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span>{children}</span>
      {icon}
    </a>
  );
}

function SocialIcon({ icon }) {
  if (icon === 'instagram') return <Instagram size={18} aria-hidden="true" />;
  if (icon === 'youtube') return <Youtube size={19} aria-hidden="true" />;
  if (icon === 'linkedin') return <Linkedin size={18} aria-hidden="true" />;
  if (icon === 'x') return <span className="x-icon" aria-hidden="true">X</span>;
  return <ArrowUpRight size={18} aria-hidden="true" />;
}

function SocialLinks() {
  return (
    <div className="social-links">
      {visibleSocialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${link.label}`}
          title={link.label}
        >
          <SocialIcon icon={link.icon} />
        </a>
      ))}
    </div>
  );
}

function Hero() {
  const heroProject = getVideo(data.hero.video.youtubeId);

  return (
    <section className="hero" id="top">
      <HeroVideo
        media={data.hero.video}
        title={heroProject?.title || 'SkidoEdits reel'}
      />
      <div className="hero__content" data-reveal>
        <p className="hero__role">{data.hero.role}</p>
        <h1>{data.hero.name}</h1>
        <p className="hero__headline">{data.hero.headline}</p>
        <p className="hero__body">{data.hero.body}</p>
        <div className="hero__actions">
          <MagneticLink href="#work" icon={<Play size={17} fill="currentColor" aria-hidden="true" />}>
            {data.hero.primaryCta}
          </MagneticLink>
          <MagneticLink href="#contact" variant="glass" icon={<ArrowUpRight size={17} aria-hidden="true" />}>
            {data.hero.secondaryCta}
          </MagneticLink>
        </div>
      </div>
      <a className="scroll-indicator" href="#clients" aria-label="Scroll to clients">
        <span>Scroll</span>
        <ChevronDown size={18} aria-hidden="true" />
      </a>
    </section>
  );
}

function ClientProjects({ creators, activeVideoId, onActivate, onDeactivate }) {
  return (
    <section className="client-projects" id="work" aria-labelledby="work-title">
      <div className="client-projects__heading">
        <p>Selected work</p>
        <h2 id="work-title">Five clients. Full stacks.</h2>
      </div>
      <div className="client-projects__list">
        {creators.map((project) => (
          <ClientProjectSection
            key={project.id}
            project={project}
            videos={getCreatorVideos(project)}
            activeVideoId={activeVideoId}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        ))}
      </div>
    </section>
  );
}

function VideoRails({ activeVideoId, onActivate, onDeactivate }) {
  return (
    <section className="video-rails" aria-labelledby="rails-title">
      <div className="section-heading">
        <p>Keep watching</p>
        <h2 id="rails-title">Our Gaming Edits</h2>
      </div>
      {data.rails.map((rail) => (
        <PlayableVideoRail
          key={rail.id}
          rail={rail}
          videos={rail.videoIds.map((id) => videosById[id]).filter(Boolean)}
          creatorsById={creatorsById}
          activeVideoId={activeVideoId}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a className="wordmark" href="#top" aria-label="SkidoEdits home">
          <img src={data.brand.assets.mascot} alt="" width="357" height="357" />
          <span>{data.brand.name}</span>
        </a>
        <p>{data.brand.tagline}</p>
        <SocialLinks />
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
      <p className="footer-disclaimer">{data.brand.robloxDisclaimer}</p>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <a
      className={visible ? 'back-to-top is-visible' : 'back-to-top'}
      href="#top"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={19} />
    </a>
  );
}

export default function App() {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const deactivateVideo = useCallback(() => setActiveVideoId(null), []);
  const creators = useMemo(
    () => [...data.creatorProjects].sort((a, b) => a.priority - b.priority),
    [],
  );
  const primaryCreators = creators.filter((creator) => creator.type === 'primary');
  const moreCreators = creators.filter((creator) => creator.type === 'more');
  const marqueeCreators = creators.filter((creator) => creator.includeInCreatorStrip);
  const stats = useMemo(
    () => [
      { value: data.videos.length, label: 'Projects Featured' },
      { value: data.creatorProjects.length, label: 'Creator Collections' },
      { value: primaryCreators.length, label: 'Featured Clients' },
      {
        value: data.videos.filter((video) => video.aspectRatio === '9:16').length,
        label: 'Shorts',
      },
    ],
    [primaryCreators.length],
  );

  useRevealOnScroll();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ClientMarquee projects={marqueeCreators} />
        <ClientProjects
          creators={primaryCreators}
          activeVideoId={activeVideoId}
          onActivate={setActiveVideoId}
          onDeactivate={deactivateVideo}
        />
        <MoreEditsShowcase
          creators={moreCreators}
          getVideos={getCreatorVideos}
          activeVideoId={activeVideoId}
          onActivate={setActiveVideoId}
          onDeactivate={deactivateVideo}
        />
        <VideoRails
          activeVideoId={activeVideoId}
          onActivate={setActiveVideoId}
          onDeactivate={deactivateVideo}
        />
        <AnimatedStats stats={stats} />
        <WorkWithSkido brand={data.brand} contact={data.contact} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
