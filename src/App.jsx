import { useState, useEffect, useRef } from "react";
import { LANGS } from "./translations";
import "./App.css";

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: t }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return [ref, v];
}

function Reveal({ children, delay = 0, dir = "up", className = "" }) {
  const [ref, v] = useInView();
  const anims = { up: "fadeUp", left: "slideR", right: "slideL", scale: "scaleIn" };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: v ? 1 : 0,
        animation: v ? `${anims[dir]} 0.72s cubic-bezier(0.22,1,0.36,1) ${delay}s both` : "none",
      }}
    >
      {children}
    </div>
  );
}

const NAV_IDS = ["about","heritage","recognition","conference","gallery","contacts"];
const LANG_LABELS = { ru: "🇷🇺 RU", en: "🇬🇧 EN", tj: "🇹🇯 TJ" };

const PHOTOS = {
  hero:  "/img/1.png",
  about: "/img/2.jpg",
  map:   "/img/1.png",
  gallery: [
    "/img/3.png",
    "/img/4.png",
    "/img/5.png",
    "/img/6.png",
    "/img/7.png",
    "/img/8.png",
    "/img/9.png",
    "/img/10.png",
  ],
};

// ── NAV ──────────────────────────────────────────────────────
function Nav({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (!e.target.closest(".nav__lang")) setLangOpen(false); };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="wrap">
        <div className="nav__inner">

          <button className="nav__logo" onClick={() => go("hero")}>
            <img src="/img/logo.png" alt="А. Джураев" />
              </button>

          <div className="nav__links">
            {NAV_IDS.map((id, i) => (
              <button
                key={id}
                className="nav__link"
                onClick={() => { go(id); setMenuOpen(false); }}
              >
                {t.nav[i]}
              </button>
            ))}
          </div>

          <div className="nav__right">
            <div className="nav__lang">
              <button className="nav__lang-btn" onClick={() => setLangOpen(v => !v)}>
                {LANG_LABELS[lang]}
                <span>▾</span>
              </button>
              {langOpen && (
                <div className="nav__lang-drop">
                  {["ru","en","tj"].map(l => (
                    <button
                      key={l}
                      className={`nav__lang-opt${lang === l ? " active" : ""}`}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="nav__cta" onClick={() => go("conference")}>
              {t.heroCTA}
            </button>

            <button
              className={`nav__burger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(v => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`nav__mobile${menuOpen ? " open" : ""}`}>
  {NAV_IDS.map((id, i) => (
    <button
      key={id}
      className="nav__link"
      onClick={() => { go(id); setMenuOpen(false); }}
    >
      {t.nav[i]}
    </button>
  ))}
</div>
      </div>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────
function Hero({ t, lang }) {
  return (
    <section id="hero" className="hero">
      <div className="1">
        <div className="hero__card">
          <div className="hero__left">
            <p className="hero__kicker">{t.heroKicker}</p>
            <h1 className="hero__name">
              {t.heroName.split("\n").map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h1>
            <p className="hero__years">{t.heroYears}</p>
            <p className="hero__desc">{t.heroSub}</p>
            <div className="hero__badges">
              {[
                { icon: "📅", val: t.heroBadge1 },
                { icon: "📍", val: t.heroBadge2 },
                { icon: "🎂", val: t.heroBadge3 },
              ].map((b, i) => (
                <div key={i} className="hero__badge">
                  <span>{b.icon}</span>
                  {b.val}
                </div>
              ))}
            </div>
          </div>

          <div className="hero__photo-wrap">
            <div className="hero__photo">
              <img
                src={PHOTOS.hero}
                alt="Акашариф Джураев"
                onError={e => { e.target.style.display = "none"; }}
              />
              <div className="hero__photo-overlay">
                {lang === "ru" ? "Акашариф Джураев"
                  : lang === "en" ? "Akasharif Juraev"
                  : "Акашариф Ҷӯраев"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── ABOUT ────────────────────────────────────────────────────
function About({ t }) {
  return (
    <section id="about" className="sec about">
      <div className="wrap">
        <div className="about__grid">
          <Reveal dir="right">
            <p className="sec-tag">{t.aboutLabel}</p>
            <h2 className="sec-h">{t.aboutTitle}</h2>
            <p className="about__body">{t.aboutP1}</p>
            <p className="about__body">{t.aboutP2}</p>
            <div className="about__awards">
              <p className="awards-tag">{t.awardsTitle}</p>
              {t.awards.map((a, i) => (
                <div className="award" key={i}>
                  <span className="award__yr">{a.year}</span>
                  <span className="award__txt">{a.title}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal dir="left" delay={0.1}>
            <div className="about__right">
              <div className="about__photo">
                <img
                  src={PHOTOS.about}
                  alt="Портрет"
                  onError={e => { e.target.style.display = "none"; }}
                />
              </div>
              <div className="about__quote">
                <p className="about__q-text">{t.quoteText}</p>
                <p className="about__q-author">{t.quoteAuthor}</p>
                <p className="about__q-role">{t.quoteRole}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── HERITAGE ─────────────────────────────────────────────────
function Heritage({ t }) {
  return (
    <section id="heritage" className="sec heritage">
      <div className="wrap">
        <Reveal>
          <p className="sec-tag">{t.heritageLabel}</p>
          <h2 className="sec-h">{t.heritageTitle}</h2>
        </Reveal>
        <div className="heritage__grid">
          {t.songs.map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="heritage__card">
                <div className="heritage__num">{s.num}</div>
                <div className="heritage__name">{s.name}</div>
                <div className="heritage__desc">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── RECOGNITION ──────────────────────────────────────────────
function Recognition({ t }) {
  return (
    <section id="recognition" className="sec recognition">
      <div className="wrap">
        <Reveal>
          <div className="recognition__head">
            <p className="sec-tag sec-tag--light">{t.recognitionLabel}</p>
            <h2 className="sec-h sec-h--light">{t.recognitionTitle}</h2>
          </div>
        </Reveal>
        <div className="recognition__grid">
          {t.tributes.map((tr, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="recog-card">
                <p className="recog-card__q">{tr.quote}</p>
                <div className="recog-card__line" />
                <p className="recog-card__name">{tr.name}</p>
                <p className="recog-card__role">{tr.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONFERENCE ───────────────────────────────────────────────
function Conference({ t }) {
  return (
    <section id="conference" className="sec conference">
      <div className="wrap">
        <Reveal>
          <div className="conference__head">
            <p className="sec-tag">{t.confLabel}</p>
            <h2 className="sec-h">{t.confTitle}</h2>
          </div>
        </Reveal>
        <div className="conference__grid">
          <Reveal dir="right" delay={0.1}>
            <div className="conf-card">
              {t.confFields.map((row, i) => (
                <div className="conf-row" key={i}>
                  <div className="conf-row__ico">
  <img src={`/img/icons/${
    row.icon === "📅" ? "date" :
    row.icon === "🕙" ? "time" :
    row.icon === "📍" ? "location" :
    row.icon === "🏛" ? "organ" :
    "organ"
  }.svg`} alt={row.label} />
</div>
                  <div>
                    <div className="conf-row__lbl">{row.label}</div>
                    <div className="conf-row__val">{row.val}</div>
                  </div>
                </div>
              ))}
              <button className="conf-cta" onClick={() => go("contacts")}>
                {t.confCTA}
              </button>
            </div>
          </Reveal>

          <Reveal dir="left" delay={0.15}>
            <div>
              <p className="conf-body">{t.confInvite}</p>
              <div className="conf-note">{t.confAudience}</div>
              <div className="conf-stats">
                {t.confStats.map((s, i) => (
                  <div key={i}>
                    <div className="cstat__num">{s.num}</div>
                    <div className="cstat__lbl">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── GALLERY ──────────────────────────────────────────────────
function Gallery({ t }) {
  const cells = [
    { cls: "g-cell g-cell--wide g-cell--tall", i: 0 },
    { cls: "g-cell", i: 1 },
    { cls: "g-cell", i: 2 },
    { cls: "g-cell g-cell--wide", i: 3 },
    { cls: "g-cell", i: 4 },
    { cls: "g-cell", i: 5 },
    { cls: "g-cell", i: 6 },
    { cls: "g-cell", i: 7 },
  ];

  return (
    <section id="gallery" className="sec gallery">
      <div className="wrap">
        <Reveal>
          <div className="gallery__head">
            <p className="sec-tag">{t.galleryLabel}</p>
            <h2 className="sec-h">{t.galleryTitle}</h2>
            <p className="gallery__sub">{t.gallerySub}</p>
          </div>
        </Reveal>
        <div className="gallery__grid">
          {cells.map(({ cls, i }) => (
            <Reveal key={i} delay={i * 0.05} className={cls}>
              <img
                src={PHOTOS.gallery[i]}
                alt={t.galleryItems[i]?.label || ""}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.parentElement.style.background = "var(--parch3)";
                }}
              />
              <div className="g-cell__overlay">
                <span className="g-cell__label">{t.galleryItems[i]?.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACTS ─────────────────────────────────────────────────
function Contacts({ t }) {
  return (
    <section id="contacts" className="sec contacts">
      <div className="wrap">
        <Reveal>
          <div className="contacts__head">
            <p className="sec-tag">{t.contactsLabel}</p>
            <h2 className="sec-h">{t.contactsTitle}</h2>
          </div>
        </Reveal>
        <div className="contacts__grid">
          <Reveal dir="right" delay={0.1}>
            <div className="contact-card">
              {t.contactFields.map((c, i) => (
                <div className="cfield" key={i}>
                  <div className="cfield__lbl">{c.label}</div>
                  <div className="cfield__val">
                    {c.link
                      ? <a href={c.link}>{c.val}</a>
                      : c.val}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal dir="left" delay={0.15}>
            <div>
             <div className="contact-map">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1559.7368794056188!2d68.7905671!3d38.5689367!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d1431a0c2c93%3A0x741dbd8c9dce8390!2sNational%20Academy%20of%20Sciences%20of%20Tajikistan!5e0!3m2!1sru!2s!4v1780306849839!5m2!1sru!2s"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Карта"
  />
</div>
              <div className="contact-note">{t.contactNote}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">А.<em> Джураев</em></div>
            <p className="footer__desc">{t.footerDesc}</p>
          </div>
          <div>
            <p className="footer__col-h">{t.footerNav}</p>
            {NAV_IDS.map((id, i) => (
              <button key={id} className="footer__lnk" onClick={() => go(id)}>
                {t.nav[i]}
              </button>
            ))}
          </div>
          <div>
            <p className="footer__col-h">{t.footerContact}</p>
            <p className="footer__addr">{t.footerAddr1}<br />{t.footerAddr2}</p>
            <a href="mailto:conference@nast.tj" className="footer__mail">
              conference@nast.tj
            </a>
          </div>
        </div>
        <div className="footer__bot">
          <span className="footer__copy">{t.footerCopy}</span>
          <button className="footer__up" onClick={() => go("hero")}>↑</button>
        </div>
      </div>
    </footer>
  );
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("ru");
  const t = LANGS[lang];
  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} lang={lang} />
      <About t={t} />
      <Heritage t={t} />
      <Recognition t={t} />
      <Conference t={t} />
      <Gallery t={t} />
      <Contacts t={t} />
      <Footer t={t} />
    </>
  );
}


