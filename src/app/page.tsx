'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Pencil,
  Share2,
  Download,
  Heart,
} from 'lucide-react';
import { templates } from '@/lib/templates';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SmoothScroll } from '@/components/smooth-scroll';
import { LogoSpin } from '@/components/logo-spin';
import { SpringyCarousel } from '@/components/springy-carousel';
import { DeveloperBadge } from '@/components/developer-badge';
import { Navbar } from '@/components/navbar';

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col" style={{ background: 'var(--paper)' }}>
      {/* Global Components */}
      <ScrollReveal />
      <SmoothScroll />
      <LogoSpin />
      <SpringyCarousel />

      {/* CRT Scanline Overlay */}
      <div className="crt-overlay" />

      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-white focus:text-black"
      >
        Lewati ke konten utama
      </a>

      {/* ─── Navbar ─── */}
      <Navbar />

      {/* ─── Hero ─── */}
      <main id="main-content" role="main">
      <section className="hero" id="hero" aria-label="Hero">
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
                <p className="htag">
                  Buat card ucapan personal dengan desain aesthetic. Bagikan
                  lewat link unik, penerima bisa klaim langsung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pixel Art Banner ─── */}
      <div className="pixel-banner">
        <img
          src="/img/pixel__.gif"
          alt="Pixel art decoration"
          className="pixel-banner-img"
        />
      </div>

      {/* ─── Intro Lead ─── */}
      <section className="intro">
        <div className="wrap">
          <IntroLead />
        </div>
      </section>

      {/* ─── Template Carousel ─── */}
      <section className="caro" id="work" aria-label="Template Card">
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
        <section className="ed" id="how-it-works" aria-label="Cara Kerja">
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
                    <Pencil size={48} style={{ color: 'var(--ink)' }} strokeWidth={1.5} />
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
                      background: '#FF6B35',
                      overflow: 'visible',
                      WebkitClipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                      clipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                    }}
                  >
                    <Share2 size={48} color="#ffffff" strokeWidth={1.5} />
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
                      background: '#2D9C6F',
                      overflow: 'visible',
                      WebkitClipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                      clipPath:
                        'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
                    }}
                  >
                    <Download size={48} color="#ffffff" strokeWidth={1.5} />
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
                    <Heart size={48} style={{ color: 'var(--paper)' }} strokeWidth={1.5} />
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
      <section className="proc" id="process" aria-label="Proses Pembuatan">
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
      <section className="quote" aria-label="Kutipan">
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
        <section className="ed" id="features" aria-label="Fitur">
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
        <section className="ed" id="about" aria-label="Tentang Boba Card">
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
                Dibuat dengan React &amp; Next.js. Card tersimpan
                secara online — bisa diakses dari mana saja.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ─── CTA ─── */}
      <section className="cta" id="contact" aria-label="Mulai Sekarang">
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
      </main>

      {/* ─── Footer ─── */}
      <footer className="craft-footer">
        <div className="footer-inner">
          <div className="flex items-center gap-3">
            <span
              className="font-pixel text-xs sm:text-sm"
              style={{ color: 'var(--muted-craft)' }}
            >
              &copy; 2026 Boba.dev
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DeveloperBadge />
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
