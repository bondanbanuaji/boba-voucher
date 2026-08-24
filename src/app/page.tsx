'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Gift,
  ArrowRight,
} from 'lucide-react';
import { templates } from '@/lib/templates';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SmoothScroll } from '@/components/smooth-scroll';
import { LogoSpin } from '@/components/logo-spin';
import { SpringyCarousel } from '@/components/springy-carousel';

const NAV_LINKS = [
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Fitur', href: '#features' },
  { label: 'Tentang', href: '#about' },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="flex flex-1 flex-col" style={{ background: 'var(--paper)' }}>
      {/* Global Components */}
      <ScrollReveal />
      <SmoothScroll />
      <LogoSpin />
      <SpringyCarousel />

      {/* CRT Scanline Overlay */}
      <div className="crt-overlay" />

      {/* ─── Masthead ─── */}
      <nav className="masthead">
        <div className="mh-l">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mr-4 sm:mr-6 font-pixel text-xs sm:text-sm tracking-wider uppercase transition-all"
              style={{ color: 'var(--ink)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <Link href="/" className="mh-c">
          <div className="wlogo">
            <div
              className="flex size-[34px] items-center justify-center"
              style={{
                background: 'var(--ink)',
                clipPath:
                  'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
              }}
            >
              <Gift className="size-5" style={{ color: 'var(--paper)' }} />
            </div>
          </div>
        </Link>
        <div className="mh-r">
          <Link href="/create">
            <span
              className="font-pixel text-xs sm:text-sm tracking-wider uppercase transition-all"
              style={{ color: 'var(--ink)' }}
            >
              Buat Card
            </span>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero" id="hero">
        <div className="hhead">
          <div className="hgrid">
            <h1 className="hl">
              <span className="ln">
                <span>Card Ucapan,</span>
              </span>
              <span className="ln">
                <span>bermakna.</span>
              </span>
            </h1>
            <div className="hcol">
              <p className="hdesc">
                <span className="ln">
                  <span>Sistem card ucapan digital</span>
                </span>
                <span className="ln">
                  <span>personal untuk orang special</span>
                </span>
              </p>
              <div className="hfoot">
                <div className="wlogo">
                  <div
                    className="flex size-[34px] items-center justify-center"
                    style={{
                      background: 'var(--ink)',
                      clipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                    }}
                  >
                    <Gift className="size-5" style={{ color: 'var(--paper)' }} />
                  </div>
                </div>
                <p className="htag">
                  Buat card ucapan personal dengan desain aesthetic. Bagikan
                  lewat link unik, penerima bisa klaim langsung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Intro Lead ─── */}
      <section className="intro" style={{ marginTop: '-24vh' }}>
        <div className="wrap">
          <IntroLead />
        </div>
      </section>

      {/* ─── Template Carousel ─── */}
      <section className="caro" id="work">
        <div className="ch reveal" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'calc(var(--cell) * 1.5)' }}>
          <h2 style={{ maxWidth: '18ch' }}>
            5 template cantik untuk setiap momen.
          </h2>
          <p
            style={{
              maxWidth: '62ch',
              margin: 0,
              color: '#2a2a2a',
              fontSize: 'clamp(15px, 1.15vw, 18px)',
              lineHeight: 1.62,
            }}
          >
            Pilih template yang paling cocok untuk ucapanmu. Setiap desain
            dibuat dengan perhatian terhadap detail, dari warna hingga animasi.
          </p>
        </div>
        <div className="track-wrap" data-slider>
          <div className="track">
            {templates.map((tpl) => (
              <div key={tpl.id} className="slide cs">
                <div
                  className="csm flex items-center justify-center"
                  style={{ background: tpl.gradient }}
                >
                  <span className="text-6xl">{tpl.emoji}</span>
                </div>
                <p className="t">{tpl.name}</p>
                <p className="d">{tpl.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (Editorial Style) ─── */}
      <div className="sheet">
        <section className="ed" id="how-it-works">
          <div className="wrap">
            <div className="head reveal">
              <h2>Tiga langkah sederhana.</h2>
              <p className="kick">Cara Kerja</p>
            </div>
            <div className="reveal">
              <p>
                Membuat card ucapan personal tidak pernah semudah ini. Pilih
                template, tulis ucapan dari hati, dan bagikan ke orang yang
                kamu sayangi.
              </p>
              <p>
                Penerima cukup buka link unik yang kamu kirimkan, melihat
                card cantik yang sudah kamu buat, dan mengklaimnya dalam
                satu klik. Tanpa ribet, tanpa perlu akun.
              </p>
              <div className="two">
                <div className="c">
                  <div
                    className="mx-auto mb-4 flex size-[128px] items-center justify-center"
                    style={{
                      background: 'var(--neon)',
                      clipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </div>
                  <div className="l">Buat</div>
                  <p>
                    Pilih template, tulis ucapan dari hati, isi detail card
                    kamu.
                  </p>
                </div>
                <div className="c">
                  <div
                    className="mx-auto mb-4 flex size-[128px] items-center justify-center"
                    style={{
                      background: 'var(--retro-accent)',
                      clipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                  </div>
                  <div className="l">Bagikan</div>
                  <p>
                    Dapat link unik. Kirim via WhatsApp, Telegram, atau apapun.
                  </p>
                </div>
              </div>
              <div className="two" style={{ marginTop: '0' }}>
                <div className="c">
                  <div
                    className="mx-auto mb-4 flex size-[128px] items-center justify-center"
                    style={{
                      background: 'var(--retro-green)',
                      clipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  </div>
                  <div className="l">Klaim</div>
                  <p>
                    Penerima buka link, lihat card cantik, klaim dalam satu
                    klik.
                  </p>
                </div>
                <div className="c">
                  <div
                    className="mx-auto mb-4 flex size-[128px] items-center justify-center"
                    style={{
                      background: 'var(--ink)',
                      clipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </div>
                  <div className="l">Nikmati</div>
                  <p>
                    Card sudah diklaim. Momen spesial jadi lebih berkesan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Process Steps ─── */}
      <section className="proc" id="process">
        <div className="wrap">
          <div className="ph reveal">
            <h2>
              Buat. Kirim.
              <br />
              Klaim. Selesai.
            </h2>
            <div className="phx">
              <p className="pd">
                Prosesnya sederhana: kamu memilih, menulis, dan mengirim.
                Sisanya kita yang urus.
              </p>
            </div>
          </div>
          <div className="donuts reveal">
            {[
              {
                num: '01',
                title: 'Pilih Template',
                desc: 'Lima template cantik, masing-masing dengan karakter dan warna yang unik.',
              },
              {
                num: '02',
                title: 'Tulis Ucapan',
                desc: 'Tulis pesan dari hati kamu. Judul, ucapan, dan detail card personal.',
              },
              {
                num: '03',
                title: 'Bagikan Link',
                desc: 'Dapatkan link unik. Kirim via WhatsApp, Telegram, atau apapun.',
              },
              {
                num: '04',
                title: 'Penerima Klaim',
                desc: 'Penerima buka link, lihat card, klaim dalam satu klik.',
              },
            ].map((item) => (
              <div key={item.num} className="step">
                <div className="dl">
                  <span className="dn">{item.num}</span>
                  <span className="dt">{item.title}</span>
                </div>
                <p className="dd">{item.desc}</p>
                <span className="pxline" aria-hidden="true">
                  <i />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pull Quote ─── */}
      <section className="quote">
        <div className="wrap">
          <p className="q">
            Memberi hadiah tidak harus mahal, tapi harus bermakna.
          </p>
          <p className="attr">Boba Card</p>
          <p className="after">
            Dibuat dengan perhatian terhadap detail, dari desain hingga
            pengalaman klaim. Karena momen spesial layak mendapatkan sesuatu
            yang istimewa.
          </p>
        </div>
      </section>

      {/* ─── Features (Editorial Style) ─── */}
      <div className="sheet">
        <section className="ed" id="features">
          <div className="wrap">
            <div className="head reveal">
              <h2>Dirancang untuk momen spesial.</h2>
              <p className="kick">Fitur</p>
            </div>
            <div className="reveal">
              <p>
                Setiap card dibuat dengan perhatian terhadap detail. Dari
                desain template hingga pengalaman klaim, semuanya dirancang
                untuk memberikan kesan yang berkesan.
              </p>
              <ul className="pts">
                <li>
                  <span className="n">01</span>
                  <span>
                    <b>Personal & Meaningful.</b> Tulis ucapan dari hati, bukan
                    template generik.
                  </span>
                </li>
                <li>
                  <span className="n">02</span>
                  <span>
                    <b>Desain Aesthetic.</b> 5 template cantik dengan warna dan
                    animasi yang unik.
                  </span>
                </li>
                <li>
                  <span className="n">03</span>
                  <span>
                    <b>Klaim Tanpa Akun.</b> Penerima cukup buka link, tanpa
                    perlu daftar.
                  </span>
                </li>
                <li>
                  <span className="n">04</span>
                  <span>
                    <b>Share Mudah.</b> Copy link, share via WhatsApp atau
                    Telegram.
                  </span>
                </li>
                <li>
                  <span className="n">05</span>
                  <span>
                    <b>Download PNG.</b> Simpan card sebagai gambar untuk
                    dibagikan di mana saja.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* ─── About (Editorial Style) ─── */}
      <div className="sheet">
        <section className="ed" id="about">
          <div className="wrap">
            <div className="head reveal">
              <h2>Dibuat dengan perhatian untuk momen spesial.</h2>
              <p className="kick">Tentang</p>
            </div>
            <div className="reveal">
              <p>
                Boba Card lahir dari ide sederhana: memberi hadiah tidak
                harus mahal, tapi harus bermakna. Dengan card ucapan personal, kamu
                bisa menyampaikan perasaan dengan cara yang unik dan berkesan.
              </p>
              <p>
                Setiap card dibuat dengan perhatian terhadap detail, dari
                desain hingga pengalaman klaim. Karena momen spesial layak
                mendapatkan sesuatu yang istimewa.
              </p>
              <p className="s" style={{ marginTop: 'calc(var(--cell) * 2)' }}>
                Dibuat dengan React &amp; Next.js. Card tersimpan di
                browser kamu — tidak ada server, tidak ada database.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ─── CTA ─── */}
      <section className="cta" id="contact">
        <div className="wrap">
          <h2 className="reveal">Buat card pertama kamu.</h2>
          <p className="meta reveal">
            Gratis, tanpa akun, dan langsung jadi. Pilih template, tulis
            ucapan, bagikan ke orang special kamu.
          </p>
          <Link href="/create" className="cta btn reveal">
            Mulai Sekarang
            <ArrowRight className="size-4 ml-2 inline" />
          </Link>
          <p className="meta reveal" style={{ marginTop: '40px' }}>
            Dibuat dengan ♥ untuk momen spesial kamu.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="craft-footer">
        <div className="footer-inner">
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 items-center justify-center"
              style={{
                background: 'var(--retro-accent)',
                clipPath:
                  'polygon(4px 0, calc(100% - 4px) 0, calc(100% - 4px) 2px, calc(100% - 2px) 2px, calc(100% - 2px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 2px) calc(100% - 4px), calc(100% - 2px) calc(100% - 2px), calc(100% - 4px) calc(100% - 2px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 2px), 2px calc(100% - 2px), 2px calc(100% - 4px), 0 calc(100% - 4px), 0 4px, 2px 4px, 2px 2px, 4px 2px, 4px 0)',
              }}
            >
              <Gift className="size-4" style={{ color: '#fff' }} />
            </div>
            <span
              className="font-pixel text-xs sm:text-sm"
              style={{ color: 'var(--paper)' }}
            >
              BOBA CARD
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <span className="ar">↗</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Intro Lead (client component for line-splitting) ─── */
function IntroLead() {
  const leadRef = useRef<HTMLParagraphElement>(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = leadRef.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      return;
    }

    const lead = el;
    const orig = lead.innerHTML;
    let splitDone = false;

    function split() {
      lead.innerHTML = orig;
      if (!lead.clientWidth) return false;

      const toks: { t: string; em: boolean; sp: boolean }[] = [];
      lead.childNodes.forEach((n) => {
        const em = n.nodeType === 1 && (n as HTMLElement).tagName === 'EM';
        String(n.textContent)
          .split(/(\s+)/)
          .forEach((p) => {
            if (p.length)
              toks.push({ t: p, em, sp: /^\s+$/.test(p) });
          });
      });

      lead.textContent = '';
      const ws = toks.map((tk) => {
        const s = document.createElement('span');
        s.textContent = tk.t;
        if (tk.em) s.style.color = 'var(--muted-craft)';
        if (tk.sp) s.setAttribute('data-sp', '1');
        lead.appendChild(s);
        return s;
      });

      const lines: HTMLSpanElement[][] = [];
      let cur: HTMLSpanElement[] | null = null;
      let top: number | null = null;

      ws.forEach((s) => {
        if (s.getAttribute('data-sp') && top === null) return;
        const t = s.offsetTop;
        if (top === null || Math.abs(t - top) > 2) {
          cur = [];
          lines.push(cur);
          top = t;
        }
        cur!.push(s);
      });

      lead.textContent = '';
      lines.forEach((arr, i) => {
        const ln = document.createElement('span');
        ln.className = 'ln';
        const inner = document.createElement('span');
        inner.style.transitionDelay = `${i * 0.1}s`;
        arr.forEach((s) => {
          s.removeAttribute('data-sp');
          inner.appendChild(s);
        });
        ln.appendChild(inner);
        lead.appendChild(ln);
      });

      return true;
    }

    function init() {
      if (!split()) {
        requestAnimationFrame(init);
        return;
      }
      splitDone = true;
      setReady(true);

      const obs = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              setRevealed(true);
            }
          });
        },
        { threshold: 0 }
      );
      obs.observe(lead);

      let rt: ReturnType<typeof setTimeout>;
      addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
          setRevealed(false);
          split();
        }, 200);
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    } else {
      init();
    }
  }, []);

  return (
    <p
      ref={leadRef}
      className={`lead${ready ? ' ready' : ''}${revealed ? ' in' : ''}`}
    >
      Buat card ucapan personal untuk orang spesial. Pilih template, tulis
      pesan dari hati, bagikan lewat link unik.
    </p>
  );
}
