"use client";
import EnquiryForm from "@/components/EnquiryForm";
import { trackEvent } from "@/lib/analytics";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Menu,
  X,
  Phone,
  MessageCircle,
  MoveUpRight,
  Plus,
  Minus,
} from "lucide-react";
import { assets, site, whatsappLink } from "@/data/site";
const Arrow = () => <ArrowUpRight size={17} strokeWidth={1.5} />;
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
function Photo({
  src,
  alt,
  className = "",
  sizes = "(max-width: 700px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} />
    </div>
  );
}
function Concept({
  children = "Architectural concept · For illustration only",
}: {
  children?: React.ReactNode;
}) {
  return <span className="concept">{children}</span>;
}
export default function Website() {
  const root = useRef<HTMLDivElement>(null),
    drawer = useRef<HTMLElement>(null),
    menuButton = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [contactInView, setContactInView] = useState(false),
    [gallery, setGallery] = useState(0),
    [plot, setPlot] = useState(1),
    [feature, setFeature] = useState(0),
    [step, setStep] = useState(0);
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { rootMargin: "-80px 0px -64px 0px" },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-enter", {
          y: 28,
          opacity: 0,
          duration: 1.15,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.15,
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
        gsap.to(".hero-image", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.fromTo(
          ".journey-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".journey",
              start: "top 75%",
              end: "bottom 50%",
              scrub: true,
            },
          },
        );
      }, root);
      return () => ctx.revert();
    });
    return () => {
      window.removeEventListener("scroll", scroll);
      mm.revert();
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const trigger = menuButton.current;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const items = drawer.current?.querySelectorAll<HTMLElement>("a, button");
    const first = items?.[0],
      last = items?.[items.length - 1];
    const tween = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? null
      : gsap.fromTo(
          drawer.current,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.45, ease: "power3.out" },
        );
    first?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", key);
      tween?.kill();
      trigger?.focus();
    };
  }, [menu]);
  const current = site.plots[plot];
  const features = [
    [
      "Thoughtfully connected",
      "Internal roads & community access",
      "Considered street networks create the foundation for a neighbourhood that feels easy to navigate.",
    ],
    [
      "Comfort, considered",
      "Water, drainage & street lighting",
      "Ask our team about project-specific utility proposals, specifications and development status.",
    ],
    [
      "A little breathing room",
      "Green spaces & landscape planning",
      "Explore the possibilities of native planting, open spaces and a quieter everyday rhythm.",
    ],
    [
      "An address with identity",
      "Entrance & boundary planning",
      "A distinct sense of arrival, inspired by the enduring character of Jodhpur sandstone.",
    ],
  ];
  const steps = [
    [
      "Explore",
      "Discover our plotted developments and tell us what you have in mind.",
    ],
    [
      "Experience",
      "Arrange a site visit. Walk the land, explore the setting and ask your questions.",
    ],
    [
      "Choose",
      "Discuss plot options, dimensions, orientation and current availability with our team.",
    ],
    [
      "Make it yours",
      "Review the project documents and terms before completing purchase formalities.",
    ],
  ];
  return (
    <div
      ref={root}
      onClick={(event) => {
        const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
          "a",
        );
        const href = anchor?.getAttribute("href") || "";
        if (href.startsWith("tel:"))
          trackEvent("contact_click", { method: "phone" });
        if (href.startsWith("https://wa.me/"))
          trackEvent("contact_click", { method: "whatsapp" });
      }}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#home" aria-label="JRH Estates home">
          <span className="brand-monogram">
            JRH<span>ESTATES</span>
          </span>
          <span className="brand-line" />
          <span className="brand-caption">
            LAND. LIFE.
            <br />
            LEGACY.
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {site.navigation.map(([name, id]) => (
            <a key={id} href={`#${id}`}>
              {name}
            </a>
          ))}
        </nav>
        <a href="#contact" className="header-cta">
          Book a Site Visit <Arrow />
        </a>
        <button
          ref={menuButton}
          onClick={() => setMenu(true)}
          className="menu-toggle"
          aria-label="Open navigation"
          aria-expanded={menu}
          aria-controls="mobile-menu"
        >
          <Menu />
        </button>
      </header>
      {menu && (
        <div className="menu-layer">
          <div className="menu-backdrop" onClick={() => setMenu(false)} />
          <nav
            ref={drawer}
            id="mobile-menu"
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <button
              onClick={() => setMenu(false)}
              className="close-menu"
              aria-label="Close navigation"
            >
              <X />
            </button>
            <span className="eyebrow">JRH ESTATES</span>
            {site.navigation.map(([name, id], i) => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
                <small>0{i + 1}</small>
                {name}
                <Arrow />
              </a>
            ))}
            <p>
              Jodhpur, Rajasthan
              <br />A place for your next chapter.
            </p>
          </nav>
        </div>
      )}
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-image">
            <picture>
              <source media="(max-width: 600px)" srcSet={assets.heroMobile} />
              <source media="(max-width: 1000px)" srcSet={assets.heroTablet} />
              <Image
                src={assets.heroDesktop}
                alt="Architectural concept of the JRH ESTATES sandstone entrance in Jodhpur, with bronze lettering and roads leading to residential plots"
                fill
                priority
                sizes="100vw"
                quality={90}
              />
            </picture>
          </div>
          <div className="hero-shade" />
          <div className="hero-content wrap">
            <div className="hero-enter">
              <Label>ROOTED IN JODHPUR. MADE FOR YOUR FUTURE.</Label>
            </div>
            <h1 className="hero-enter">
              Your Land.
              <br />
              Your <em>Legacy.</em>
            </h1>
            <p className="hero-enter">
              Thoughtfully planned residential plots.
              <br />A beautiful beginning, in Jodhpur.
            </p>
            <div className="hero-actions hero-enter">
              <a className="button dark" href="#projects">
                Explore Our Projects <Arrow />
              </a>
              <a className="text-link" href="#contact">
                Book a Site Visit <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-bottom wrap">
            <a href="#about" className="scroll-cue">
              <span>
                <ArrowDown size={16} />
              </span>
              SCROLL TO DISCOVER
            </a>
            <Concept>Entrance concept rendering</Concept>
            <span className="hero-location">
              <MapPin size={14} /> JODHPUR, RAJASTHAN
            </span>
          </div>
        </section>
        <div className="statement-strip">
          <span>RESIDENTIAL PLOTS</span>
          <i>✧</i>
          <span>THOUGHTFULLY PLANNED</span>
          <i>✧</i>
          <span>DEEPLY ROOTED</span>
          <i>✧</i>
          <span>YOURS TO BUILD</span>
          <i>✧</i>
          <span>JODHPUR, RAJASTHAN</span>
        </div>
        <section id="about" className="about section wrap">
          <div className="about-copy" data-reveal>
            <Label>THE JRH ESTATES PHILOSOPHY</Label>
            <h2>
              More Than Land.
              <br />A Place to <em>Belong.</em>
            </h2>
            <div className="short-rule" />
            <p>
              A home begins long before the first stone is laid. It begins with
              a piece of land, a sense of possibility, and a place that feels
              right.
            </p>
            <p>
              At JRH Estates, we bring that beginning closer. We focus on
              residential plots and thoughtfully planned communities in and
              around Jodhpur — giving you the space to build a future that is
              entirely your own.
            </p>
            <a href="#projects" className="text-link">
              A place for your next chapter <Arrow />
            </a>
            <div className="about-signoff">
              Land is the beginning.
              <br />
              <em>Life is what you make of it.</em>
            </div>
          </div>
          <div className="about-art" data-reveal>
            <Photo
              src={assets.home}
              alt="Concept of a modern Jodhpur sandstone home with a shaded entrance and carved jali"
            />
            <span className="image-caption">THE SPIRIT OF MODERN MARWAR</span>
            <div className="detail-image">
              <Photo
                src={assets.detail}
                alt="Concept detail of warm Jodhpuri sandstone and a carved jali screen"
              />
              <span>
                Rooted in place.
                <br />
                Designed for possibility.
              </span>
            </div>
            <Concept>Home inspiration · Concept imagery</Concept>
          </div>
        </section>
        <section id="projects" className="projects section">
          <div className="wrap">
            <div className="section-heading" data-reveal>
              <div>
                <Label>OUR PLOTTED COMMUNITIES</Label>
                <h2>
                  Discover Your
                  <br />
                  <em>Future Address.</em>
                </h2>
              </div>
              <p>
                Open land. Thoughtful possibilities.
                <br />
                Discover the setting for your next chapter.
              </p>
            </div>
            <div className="project-stage" data-reveal>
              <div className="gallery-image" key={gallery}>
                <Photo
                  src={site.gallery[gallery].src}
                  alt={site.gallery[gallery].alt}
                  sizes="(max-width: 700px) 100vw, 85vw"
                />
                <div className="gallery-top">
                  <span>FEATURED DEVELOPMENT</span>
                  <span>JODHPUR</span>
                </div>
                <Concept />
              </div>
              <div className="project-card">
                <span className="eyebrow">
                  A NEW PERSPECTIVE ON PLOTTED LIVING
                </span>
                <h3>
                  {site.project.name}
                  <em> A future to call your own.</em>
                </h3>
                <p>
                  <MapPin size={15} />
                  {site.project.location}
                </p>
                <div className="project-facts">
                  <div>
                    <small>PROPERTY TYPE</small>
                    <span>Residential plots</span>
                  </div>
                  <div>
                    <small>PROJECT INFORMATION</small>
                    <span>Enquire for details</span>
                  </div>
                </div>
                <p className="fineprint">
                  Working location description. Project name, exact site, plot
                  sizes, approvals and development status await verification.
                </p>
                <a className="button sand" href="#contact">
                  Enquire About This Project <Arrow />
                </a>
              </div>
              <div className="gallery-controls">
                <span>
                  <b>0{gallery + 1}</b> / 0{site.gallery.length}{" "}
                  <small>{site.gallery[gallery].label}</small>
                </span>
                <div>
                  <button
                    aria-label="Previous project image"
                    onClick={() =>
                      setGallery(
                        (gallery + site.gallery.length - 1) %
                          site.gallery.length,
                      )
                    }
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    aria-label="Next project image"
                    onClick={() =>
                      setGallery((gallery + 1) % site.gallery.length)
                    }
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="plots" className="plots section wrap">
          <div className="section-heading" data-reveal>
            <div>
              <Label>A CANVAS FOR YOUR VISION</Label>
              <h2>
                Find the Space
                <br />
                for Your <em>Future.</em>
              </h2>
            </div>
            <p>
              A little more garden. A sunlit courtyard.
              <br />
              Start with the space that feels like you.
            </p>
          </div>
          <div className="plot-experience" data-reveal>
            <div className="plot-options">
              <div
                className="plot-tabs"
                role="tablist"
                aria-label="Illustrative plot sizes"
                onKeyDown={(event) => {
                  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
                  if (!keys.includes(event.key)) return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? site.plots.length - 1
                        : (plot +
                            (event.key === "ArrowRight" ? 1 : -1) +
                            site.plots.length) %
                          site.plots.length;
                  setPlot(next);
                  document.getElementById(`plot-tab-${next}`)?.focus();
                }}
              >
                {site.plots.map((p, i) => (
                  <button
                    key={p.id}
                    id={`plot-tab-${i}`}
                    role="tab"
                    tabIndex={i === plot ? 0 : -1}
                    aria-selected={i === plot}
                    aria-controls="plot-panel"
                    onClick={() => setPlot(i)}
                  >
                    {p.area}
                    <small>SQ. YD.</small>
                  </button>
                ))}
              </div>
              <div
                id="plot-panel"
                role="tabpanel"
                aria-labelledby={`plot-tab-${plot}`}
              >
                <span className="eyebrow">IMAGINE YOUR POSSIBILITIES</span>
                <h3>{current.name}</h3>
                <p>{current.description}</p>
                <div className="plot-stats">
                  <div>
                    <small>EXAMPLE AREA</small>
                    <strong>
                      {current.area} <span>sq. yd.</span>
                    </strong>
                  </div>
                  <div>
                    <small>EXAMPLE DIMENSIONS</small>
                    <strong>{current.dimensions}</strong>
                  </div>
                </div>
                <a
                  href={`#contact`}
                  className="text-link"
                  onClick={() => {
                    const select =
                      document.querySelector<HTMLSelectElement>(
                        '[name="plot"]',
                      );
                    if (select) select.value = String(current.area);
                  }}
                >
                  Discuss Your Preferred Plot <Arrow />
                </a>
                <p className="fineprint">
                  Illustrative sizes only, not current inventory. Orientation,
                  dimensions and availability must be confirmed with the team.
                </p>
              </div>
            </div>
            <div className="plot-plan">
              <div className="plan-label">
                <span>THE SPACE TO MAKE IT YOURS</span>
                <span>N ↑</span>
              </div>
              <div className="plan-grid" aria-hidden="true">
                {Array.from({ length: 18 }, (_, i) => (
                  <div key={i} className={i === plot + 7 ? "selected" : ""}>
                    {i === plot + 7 ? (
                      <>
                        <span>
                          YOUR
                          <br />
                          POSSIBILITIES
                        </span>
                        <MoveUpRight />
                      </>
                    ) : (
                      <span>{String(i + 1).padStart(2, "0")}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="plan-road">ILLUSTRATIVE INTERNAL ROAD</div>
              <div className="plan-key">
                <span>
                  <i /> Your chosen example
                </span>
                <span>Concept diagram · Not an approved layout</span>
              </div>
            </div>
          </div>
        </section>
        <section id="amenities" className="amenities section">
          <div className="wrap">
            <div className="section-heading" data-reveal>
              <div>
                <Label>THE FOUNDATIONS OF A GOOD LIFE</Label>
                <h2>
                  Designed for
                  <br />
                  <em>Better Living.</em>
                </h2>
              </div>
              <p>
                Considered spaces begin with thoughtful planning.
                <br />
                Explore what matters in your future neighbourhood.
              </p>
            </div>
            <div className="amenity-content">
              <div className="amenity-visual" data-reveal>
                <Photo
                  src={feature === 2 ? assets.park : assets.roads}
                  alt={
                    feature === 2
                      ? "Concept of a landscaped community park with native trees"
                      : "Concept of internal residential roads with sandstone edges and native landscaping"
                  }
                />
                <Concept>
                  Infrastructure concept · Not a completion claim
                </Concept>
                <div className="visual-note">
                  The everyday,
                  <br />
                  <em>beautifully considered.</em>
                </div>
              </div>
              <div className="feature-list" data-reveal>
                {features.map((f, i) => (
                  <div
                    className={`feature ${feature === i ? "active" : ""}`}
                    key={f[0]}
                  >
                    <button
                      aria-expanded={feature === i}
                      aria-controls={`feature-${i}`}
                      onClick={() => setFeature(i)}
                    >
                      <span>0{i + 1}</span>
                      <div>
                        <small>{f[0]}</small>
                        <h3>{f[1]}</h3>
                      </div>
                      {feature === i ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                    <div id={`feature-${i}`} hidden={feature !== i}>
                      <p>{f[2]}</p>
                    </div>
                  </div>
                ))}
                <p className="fineprint">
                  Planning themes shown for illustration. Features are subject
                  to project-specific confirmation, permissions and development
                  plans.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="location" className="location section">
          <div className="wrap location-grid">
            <div className="location-images" data-reveal>
              <Photo
                src={assets.jodhpur}
                alt="Atmospheric architectural illustration of Jodhpur's blue city below Mehrangarh Fort"
              />
              <span className="location-stamp">
                26° N<br />
                <small>THE MARWAR SPIRIT</small>
              </span>
              <Concept>Jodhpur-inspired cityscape · Illustration</Concept>
            </div>
            <div className="location-copy" data-reveal>
              <Label>OUR CITY. OUR ROOTS.</Label>
              <h2>
                Rooted in Jodhpur.
                <br />
                Connected to
                <br />
                <em>Tomorrow.</em>
              </h2>
              <p>
                A city of sandstone and blue skies. Of enduring craftsmanship
                and a spirit that looks ahead. Jodhpur is more than our
                location. It is the character behind everything we imagine.
              </p>
              <div className="location-row">
                <MapPin />
                <div>
                  <small>THE CITY WE CALL HOME</small>
                  <strong>Jodhpur, Rajasthan</strong>
                </div>
                <Arrow />
              </div>
              <div className="location-row">
                <MoveUpRight />
                <div>
                  <small>A CORRIDOR OF POSSIBILITIES</small>
                  <strong>Jodhpur–Jaisalmer Road · NH-125</strong>
                </div>
              </div>
              <p className="fineprint">
                General corridor context. Exact project location, routes and
                connectivity will be shared once verified.
              </p>
              <a
                className="button outline"
                href={site.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Jodhpur on Maps <Arrow />
              </a>
              <small className="map-note">
                City map only · Request the verified site pin before travelling.
              </small>
            </div>
          </div>
        </section>
        <section className="journey section wrap">
          <div className="center-heading" data-reveal>
            <Label>A SIMPLE PATH TO YOUR NEXT CHAPTER</Label>
            <h2>
              Four Steps Closer
              <br />
              to Your <em>Own Land.</em>
            </h2>
          </div>
          <div className="journey-line">
            <div className="journey-progress" />
          </div>
          <div className="journey-steps" data-reveal>
            {steps.map((s, i) => (
              <button
                key={s[0]}
                className={`journey-step ${step === i ? "active" : ""}`}
                aria-pressed={step === i}
                onClick={() => setStep(i)}
              >
                <span className="step-number">
                  0{i + 1}
                  <Arrow />
                </span>
                <h3>{s[0]}</h3>
                <p>{s[1]}</p>
                <span className="step-indicator">
                  {step === i ? "YOUR NEXT CHAPTER" : "EXPLORE THIS STEP"}
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="lifestyle">
          <Photo
            src={assets.lifestyle}
            alt="Concept of a quiet Jodhpur sandstone residential neighbourhood with a family walking along a landscaped street"
            sizes="100vw"
          />
          <div className="lifestyle-shade" />
          <div className="wrap lifestyle-content" data-reveal>
            <Label>THE LIFE YOU ENVISION</Label>
            <h2>
              A Place to Build
              <br />
              Everything That
              <br />
              <em>Matters.</em>
            </h2>
            <p>
              A home of your own. A life at your pace.
              <br />A legacy that starts with the land.
            </p>
            <a href="#contact" className="button sand">
              Begin Your Journey <Arrow />
            </a>
          </div>
          <Concept>
            Aspirational neighbourhood concept · Homes are not offered for sale
          </Concept>
        </section>
        <section id="contact" className="contact section">
          <div className="wrap contact-grid">
            <div data-reveal>
              <Label>LET’S FIND YOUR PLACE</Label>
              <h2>
                Your Future Begins
                <br />
                with the <em>Right Land.</em>
              </h2>
              <p>
                Tell us a little about what you have in mind.
                <br />
                Let’s explore the possibilities, together.
              </p>
              <div className="contact-links">
                {site.phone ? (
                  <a href={`tel:${site.phone}`}>
                    <Phone size={20} />
                    <div>
                      <small>A CONVERSATION IS A GOOD START</small>
                      <strong>{site.phone}</strong>
                    </div>
                    <Arrow />
                  </a>
                ) : (
                  <div className="contact-unconfigured">
                    <Phone size={20} />
                    <div>
                      <small>PERSONAL ASSISTANCE</small>
                      <strong>Phone details coming soon</strong>
                    </div>
                  </div>
                )}
                {site.whatsapp ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={20} />
                    <div>
                      <small>LET’S TALK ABOUT YOUR FUTURE</small>
                      <strong>Connect on WhatsApp</strong>
                    </div>
                    <Arrow />
                  </a>
                ) : (
                  <div className="contact-unconfigured">
                    <MessageCircle size={20} />
                    <div>
                      <small>DIRECT ENQUIRIES</small>
                      <strong>WhatsApp details coming soon</strong>
                    </div>
                  </div>
                )}
              </div>
              <div className="contact-landscape">
                <Photo
                  src={assets.sunset}
                  alt="Concept of residential land in the Jodhpur landscape at golden hour"
                />
                <Concept>Land and landscape concept</Concept>
              </div>
              <span className="contact-location">
                <MapPin size={15} /> JODHPUR, RAJASTHAN, INDIA
              </span>
            </div>
            <EnquiryForm />
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div>
              <span className="eyebrow">JODHPUR · RAJASTHAN</span>
              <p>
                A piece of land.
                <br />
                <em>A world of possibilities.</em>
              </p>
            </div>
            <a href="#home" className="back-top" aria-label="Back to top">
              <ArrowUpRight size={22} />
            </a>
          </div>
          <div className="footer-wordmark">
            JRH ESTATES<span>®</span>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} JRH Estates. All rights reserved.
            </span>
            <nav aria-label="Footer navigation">
              {site.navigation.slice(1).map(([name, id]) => (
                <a href={`#${id}`} key={id}>
                  {name}
                </a>
              ))}
              <Link href="/privacy">Privacy</Link>
            </nav>
            <span>LAND. LIFE. LEGACY.</span>
          </div>
          <p className="footer-disclaimer">
            All architectural visuals are concept illustrations. Project
            details, approvals, plot availability and infrastructure require
            verification. No imagery constitutes an offer or commitment.
          </p>
        </div>
      </footer>
      <div
        className={`mobile-contact ${contactInView ? "contact-in-view" : ""}`}
        aria-hidden={contactInView}
      >
        <a href={site.phone ? `tel:${site.phone}` : "#contact"}>
          <Phone size={17} />
          Call Now{!site.phone && <small>Enquire</small>}
        </a>
        <span />
        <a
          href={whatsappLink}
          target={site.whatsapp ? "_blank" : undefined}
          rel={site.whatsapp ? "noopener noreferrer" : undefined}
        >
          <MessageCircle size={18} />
          WhatsApp{!site.whatsapp && <small>Enquire</small>}
        </a>
      </div>
    </div>
  );
}
