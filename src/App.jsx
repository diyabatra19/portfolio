import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Instagram,
  Menu,
  MessageCircle,
  Play,
  Scissors,
  Upload,
  X,
  Youtube,
} from 'lucide-react';
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { GlassPanel } from './components/GlassPanel.jsx';
import { HeroVideo } from './components/HeroVideo.jsx';
import { VideoModal } from './components/VideoModal.jsx';
import { portfolioData as data } from './data/portfolio.js';

const HeroScene = lazy(() =>
  import('./components/HeroScene.jsx').then((module) => ({ default: module.HeroScene })),
);

const thumbnailFor = (id, quality = 'hqdefault') =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
const visibleSocialLinks = data.contact.socialLinks.filter((link) => link.href);

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
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function getVideo(id) {
  return data.videos.find((video) => video.id === id);
}

function getCategory(categoryId) {
  return data.categories.find((category) => category.id === categoryId);
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
        <span className="wordmark__mark">{data.brand.monogram}</span>
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
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
    element.style.setProperty('--button-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--button-y', `${event.clientY - rect.top}px`);
    element.style.transform = `translate(${x}px, ${y}px)`;
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
      rel={external ? 'noreferrer' : undefined}
    >
      <span>{children}</span>
      {icon}
    </a>
  );
}

function SocialIcon({ icon }) {
  if (icon === 'instagram') return <Instagram size={18} aria-hidden="true" />;
  if (icon === 'youtube') return <Youtube size={19} aria-hidden="true" />;
  if (icon === 'x') return <span className="x-icon" aria-hidden="true">X</span>;
  return <ArrowUpRight size={18} aria-hidden="true" />;
}

function SocialLinks({ labels = false }) {
  return (
    <div className={labels ? 'social-links social-links--labels' : 'social-links'}>
      {visibleSocialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${link.label}`}
          title={link.label}
        >
          <SocialIcon icon={link.icon} />
          {labels && <span>{link.label}</span>}
        </a>
      ))}
    </div>
  );
}

function Hero({ onPlay }) {
  const railVideos = data.hero.railVideoIds.map(getVideo).filter(Boolean);

  return (
    <section className="hero" id="top">
      <HeroVideo media={data.hero.video} title={getVideo(data.hero.video.youtubeId)?.title || 'SkidoEdits reel'} />
      <div className="hero__three" aria-hidden="true">
        <Suspense fallback={<div className="scene-fallback"><span /><span /><span /></div>}>
          <HeroScene />
        </Suspense>
      </div>
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
      <div className="hero-strip" aria-label="More portfolio previews">
        {railVideos.map((video, index) => (
          <button
            key={video.id}
            type="button"
            className={index === 1 ? 'hero-strip__card hero-strip__card--active' : 'hero-strip__card'}
            onClick={(event) => onPlay(video, event.currentTarget)}
            aria-label={`Play ${video.title}`}
          >
            <img src={thumbnailFor(video.id)} alt="" />
            <span>{video.creator}</span>
          </button>
        ))}
      </div>
      <a className="scroll-indicator" href="#work" aria-label="Scroll to selected work">
        <ChevronDown size={18} aria-hidden="true" />
      </a>
    </section>
  );
}

function SelectedWork({ onPlay }) {
  const projects = data.selectedWorkIds.map(getVideo).filter(Boolean);
  const [active, setActive] = useState(0);
  const project = projects[active];
  const nextProject = projects[(active + 1) % projects.length];

  const move = (direction) => {
    setActive((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <section className="section selected-work" id="work">
      <div className="section__inner">
        <div className="section-label" data-reveal>
          <span>01</span>
          <h2>Selected work</h2>
        </div>
        <div className="selected-stage" data-reveal>
          <button
            className="selected-stage__main"
            type="button"
            onClick={(event) => onPlay(project, event.currentTarget)}
            aria-label={`Play ${project.title}`}
          >
            <img
              key={project.id}
              src={thumbnailFor(project.id, 'maxresdefault')}
              alt={`Thumbnail for ${project.title}`}
              onError={(event) => {
                event.currentTarget.src = thumbnailFor(project.id);
              }}
            />
            <span className="selected-stage__wash" />
            <span className="selected-stage__label">
              <small>{getCategory(project.categoryId)?.shortName}</small>
              <strong>{project.creator}</strong>
              <b>{project.title}</b>
            </span>
            <span className="cinema-play" aria-hidden="true">
              <Play size={25} fill="currentColor" />
            </span>
          </button>
          <button
            className="selected-stage__next"
            type="button"
            onClick={() => move(1)}
            aria-label={`Show next project: ${nextProject.title}`}
          >
            <img src={thumbnailFor(nextProject.id)} alt="" />
            <span>Next</span>
          </button>
          <div className="selected-stage__controls glass-surface">
            <button type="button" onClick={() => move(-1)} aria-label="Previous selected project">
              <ArrowLeft size={21} />
            </button>
            <span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => move(1)} aria-label="Next selected project">
              <ArrowRight size={21} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreatorProof() {
  const client = data.clients[0];
  return (
    <section className="creator-proof" id="creators">
      <div className="section__inner creator-proof__inner" data-reveal>
        <h2 className="sr-only">Creator proof</h2>
        <p>Worked with</p>
        <div className="creator-proof__name">
          <span>V</span>
          <strong>{client.name}</strong>
        </div>
        <div>
          <strong>{data.stats[0].value}</strong>
          <span>Subscribers</span>
        </div>
        <div>
          <strong>{data.stats[1].value}</strong>
          <span>Views highlight</span>
        </div>
        <div>
          <strong>{data.stats[2].value}</strong>
          <span>Portfolio edits</span>
        </div>
      </div>
    </section>
  );
}

function ProjectRail({ videos, direction = 'left', onPlay }) {
  const railRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, offset: 0 });
  const loop = [...videos, ...videos];

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse') return;
    drag.current.active = true;
    drag.current.startX = event.clientX;
    railRef.current?.setPointerCapture(event.pointerId);
    railRef.current?.classList.add('project-rail--dragging');
  };

  const onPointerMove = (event) => {
    if (!drag.current.active || !railRef.current) return;
    const nextOffset = drag.current.offset + event.clientX - drag.current.startX;
    railRef.current.style.setProperty('--drag-offset', `${nextOffset}px`);
  };

  const onPointerUp = (event) => {
    if (!drag.current.active || !railRef.current) return;
    drag.current.offset += event.clientX - drag.current.startX;
    drag.current.active = false;
    railRef.current.classList.remove('project-rail--dragging');
  };

  return (
    <div
      className={`project-rail project-rail--${direction}`}
      ref={railRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="project-rail__track">
        {loop.map((video, index) => (
          <button
            key={`${video.id}-${index}`}
            type="button"
            className="rail-project"
            onClick={(event) => {
              if (Math.abs(event.clientX - drag.current.startX) < 8) {
                onPlay(video, event.currentTarget);
              }
            }}
            aria-label={`Play ${video.title}`}
          >
            <img src={thumbnailFor(video.id)} alt="" loading="lazy" />
            <span>
              <b>{video.creator}</b>
              <small>{getCategory(video.categoryId)?.shortName}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkRails({ onPlay }) {
  const videos = data.railVideoIds.map(getVideo).filter(Boolean);
  const split = Math.ceil(videos.length / 2);

  return (
    <section className="work-rails" aria-label="More project previews">
      <ProjectRail videos={videos.slice(0, split)} onPlay={onPlay} />
      <ProjectRail videos={videos.slice(split)} direction="right" onPlay={onPlay} />
    </section>
  );
}

function CategoryShowcase({ onPlay, onExpand }) {
  const categories = useMemo(
    () =>
      data.categories
        .map((category) => ({
          ...category,
          videos: data.videos.filter((video) => video.categoryId === category.id),
        }))
        .filter((category) => category.videos.length > 0),
    [],
  );
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const category = categories[categoryIndex];
  const activeProject = category.videos[projectIndex % category.videos.length];

  const selectCategory = (index) => {
    setCategoryIndex(index);
    setProjectIndex(0);
  };

  const move = (direction) => {
    setProjectIndex((current) => (current + direction + category.videos.length) % category.videos.length);
  };

  return (
    <section className="section categories" id="categories">
      <div className="section__inner">
        <div className="section-label" data-reveal>
          <span>02</span>
          <h2>More work</h2>
        </div>
        <div className="category-tabs glass-surface" role="tablist" aria-label="Portfolio categories" data-reveal>
          {categories.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === categoryIndex}
              onClick={() => selectCategory(index)}
            >
              {item.shortName}
              <span>{item.videos.length}</span>
            </button>
          ))}
        </div>
        <div className="category-feature" data-reveal>
          <div className="category-feature__heading">
            <div>
              <p>{String(categoryIndex + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}</p>
              <h3>{category.name}</h3>
            </div>
            <span>{category.description}</span>
          </div>
          <div className="category-deck">
            {category.videos.slice(0, Math.min(4, category.videos.length)).map((video, index) => {
              const realIndex = (projectIndex + index) % category.videos.length;
              const deckVideo = category.videos[realIndex];
              return (
                <button
                  key={deckVideo.id}
                  type="button"
                  className={`category-deck__card category-deck__card--${index}`}
                  style={{ '--deck-index': index }}
                  onClick={(event) => {
                    if (index === 0) onPlay(activeProject, event.currentTarget);
                    else setProjectIndex(realIndex);
                  }}
                  aria-label={index === 0 ? `Play ${activeProject.title}` : `Show ${deckVideo.title}`}
                >
                  <img src={thumbnailFor(deckVideo.id)} alt="" loading="lazy" />
                  {index === 0 && (
                    <>
                      <span className="category-deck__meta">
                        <small>{deckVideo.creator}</small>
                        <strong>{deckVideo.title}</strong>
                      </span>
                      <span className="cinema-play" aria-hidden="true">
                        <Play size={23} fill="currentColor" />
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <div className="category-feature__footer">
            <button type="button" className="text-link" onClick={() => onExpand(category)}>
              {category.cta}
              <ChevronRight size={18} />
            </button>
            <div className="carousel-buttons">
              <button type="button" onClick={() => move(-1)} aria-label={`Previous ${category.name} project`}>
                <ArrowLeft size={20} />
              </button>
              <button type="button" onClick={() => move(1)} aria-label={`Next ${category.name} project`}>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryDrawer({ category, onClose, onPlay }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!category) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('button')?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll('button:not([disabled]), a[href]'));
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
  }, [category, onClose]);

  if (!category) return null;

  return (
    <div className="modal category-modal" role="presentation" onMouseDown={onClose}>
      <GlassPanel
        as="section"
        className="category-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-title"
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal__top">
          <div>
            <p>{category.videos.length} edits</p>
            <h2 id="category-title">{category.name}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close gallery">
            <X size={21} />
          </button>
        </div>
        <div className="drawer-grid">
          {category.videos.map((video) => (
            <button
              key={video.id}
              type="button"
              className="drawer-project"
              onClick={(event) => {
                onClose();
                onPlay(video, event.currentTarget);
              }}
              aria-label={`Play ${video.title}`}
            >
              <img src={thumbnailFor(video.id)} alt="" loading="lazy" />
              <span>
                <small>{video.creator}</small>
                <strong>{video.title}</strong>
              </span>
            </button>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

const processIcons = [Upload, Scissors, Play, MessageCircle, ArrowUpRight];

function CompactStudio() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="section compact-studio" id="services">
      <div className="section__inner">
        <h2 className="sr-only">Editing services and process</h2>
        <div className="identity-line" data-reveal>
          <span>{data.about.title}</span>
          <p>{data.about.body}</p>
        </div>
      </div>
      <div className="service-ticker" aria-label="Editing services">
        <div>
          {[...data.services, ...data.services].map((service, index) => (
            <span key={`${service.title}-${index}`}>
              {service.title}
              <i />
            </span>
          ))}
        </div>
      </div>
      <div className="section__inner">
        <GlassPanel className="process-console" data-reveal>
          <div className="process-console__screen">
            <img src={thumbnailFor(data.videos[activeStep].id)} alt="" loading="lazy" />
            <span>{data.process[activeStep].description}</span>
          </div>
          <div className="process-console__timeline" style={{ '--step': activeStep }}>
            <span className="process-console__playhead" />
            {data.process.map((step, index) => {
              const Icon = processIcons[index];
              return (
                <button
                  key={step.title}
                  type="button"
                  className={index === activeStep ? 'is-active' : ''}
                  onClick={() => setActiveStep(index)}
                  onFocus={() => setActiveStep(index)}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function Contact() {
  const xLink = visibleSocialLinks.find((link) => link.icon === 'x');

  return (
    <section className="section contact" id="contact">
      <div className="section__inner">
        <GlassPanel className="contact-card" data-reveal>
          <p>Have a video in mind?</p>
          <h2>DM Skido.</h2>
          {xLink && (
            <MagneticLink
              href={xLink.href}
              external
              icon={<ArrowUpRight size={18} aria-hidden="true" />}
            >
              Work With Me
            </MagneticLink>
          )}
          <div className="contact-card__meta">
            <span>Discord: {data.contact.discordUserName}</span>
            <SocialLinks />
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section__inner site-footer__inner">
        <a className="wordmark" href="#top" aria-label="SkidoEdits home">
          <span className="wordmark__mark">{data.brand.monogram}</span>
          <span>{data.brand.name}</span>
        </a>
        <p>{data.brand.tagline}</p>
        <span>Skido - Video Editor</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
      <p className="footer-disclaimer">{data.brand.robloxDisclaimer}</p>
    </footer>
  );
}

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const returnFocusRef = useRef(null);

  useRevealOnScroll();

  const openVideo = (video, trigger) => {
    returnFocusRef.current = trigger;
    setSelectedVideo({
      ...video,
      category: getCategory(video.categoryId)?.shortName || 'Portfolio',
    });
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  };

  return (
    <>
      <Header />
      <main>
        <Hero onPlay={openVideo} />
        <SelectedWork onPlay={openVideo} />
        <CreatorProof />
        <WorkRails onPlay={openVideo} />
        <CategoryShowcase onPlay={openVideo} onExpand={setExpandedCategory} />
        <CompactStudio />
        <Contact />
      </main>
      <Footer />
      <VideoModal video={selectedVideo} onClose={closeVideo} />
      <CategoryDrawer
        category={expandedCategory}
        onClose={() => setExpandedCategory(null)}
        onPlay={openVideo}
      />
    </>
  );
}
