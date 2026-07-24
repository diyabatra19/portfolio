import { ArrowUpRight, Instagram, Youtube } from 'lucide-react';

function ContactSocialIcon({ icon }) {
  if (icon === 'instagram') return <Instagram size={19} aria-hidden="true" />;
  if (icon === 'youtube') return <Youtube size={20} aria-hidden="true" />;
  if (icon === 'x') return <span aria-hidden="true">X</span>;
  return <ArrowUpRight size={18} aria-hidden="true" />;
}

export function WorkWithSkido({ brand, contact }) {
  const socialLinks = contact.socialLinks.filter((link) => link.href);

  return (
    <section className="work-with-skido" id="contact" aria-labelledby="contact-title">
      <div className="work-with-skido__panel" data-reveal>
        <img
          className="work-with-skido__background"
          src={brand.assets.contactBanner}
          alt=""
          width="1500"
          height="500"
          loading="lazy"
        />
        <span className="work-with-skido__veil" aria-hidden="true" />
        <div className="work-with-skido__content">
          <img
            className="work-with-skido__portrait"
            src={brand.assets.contactProfile}
            alt="Skido CRT monitor profile artwork"
            width="500"
            height="500"
            loading="lazy"
          />
          <div>
            <p>Work with Skido</p>
            <h2 id="contact-title">Have a video in mind?</h2>
            <span>Drop a message.</span>
          </div>
          <a
            className="button button--primary work-with-skido__action"
            href={contact.primaryAction.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{contact.primaryAction.label}</span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <div className="work-with-skido__meta">
            <span>Discord: {contact.discordUserName}</span>
            <div className="social-links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${link.label}`}
                  title={link.label}
                >
                  <ContactSocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
