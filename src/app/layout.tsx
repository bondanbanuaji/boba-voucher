import type { Metadata } from "next";
import { Pixelify_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { SplashCursor } from "@/components/splash-cursor";
import { Footer } from "@/components/footer";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://boba-card.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Boba Card — Card Ucapan Digital Personal by Bondan Banuaji",
    template: "%s | Boba Card",
  },
  description:
    "Boba Card — Platform card ucapan digital personal oleh Bondan Banuaji. Buat card ucapan personal untuk orang spesial. Pilih template aesthetic, tulis pesan dari hati, bagikan lewat link unik. Gratis, tanpa akun, langsung jadi.",
  keywords: [
    "card ucapan digital",
    "kartu ucapan online",
    "greeting card digital Indonesia",
    "card ulang tahun",
    "kartu ucapan personal",
    "kirim card ucapan",
    "card ucapan gratis",
    "boba card",
    "voucher digital",
    "hadiah digital",
    "Bondan Banuaji",
    "boba-card",
    "boba card vercel",
  ],
  authors: [{ name: "Bondan Banuaji", url: "https://github.com/bondanbanuaji" }],
  creator: "Bondan Banuaji",
  publisher: "Bondan Banuaji",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Boba Card",
    title: "Boba Card — Card Ucapan Digital Personal by Boba",
    description:
      "Boba Card — Platform card ucapan digital personal oleh Bondan Banuaji. Buat card ucapan personal untuk orang spesial.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Boba Card — Card Ucapan Digital Personal by Boba",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boba Card — Card Ucapan Digital Personal by Boba",
    description:
      "Boba Card — Platform card ucapan digital personal oleh Bondan Banuaji. Buat card ucapan personal untuk orang spesial.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  other: {
    "theme-color": "#f48fb1",
    "google-site-verification": "PmEGbJJC6OvnZ2rxFdJdsPEGMMdbvWm-daSfYxs3IsI",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Boba Card",
  alternateName: "Boba Card — Card Ucapan Digital by Bondan Banuaji",
  url: siteUrl,
  description:
    "Boba Card — Platform card ucapan digital personal oleh Bondan Banuaji. Buat card ucapan personal untuk orang spesial.",
  inLanguage: "id",
  author: {
    "@type": "Person",
    name: "Bondan Banuaji",
    url: "https://github.com/bondanbanuaji",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Boba Card",
  url: siteUrl,
  logo: `${siteUrl}/og-image.svg`,
  description:
    "Platform card ucapan digital personal oleh Bondan Banuaji untuk momen spesial.",
  founder: {
    "@type": "Person",
    name: "Bondan Banuaji",
    url: "https://github.com/bondanbanuaji",
  },
  sameAs: [
    "https://github.com/bondanbanuaji",
    "https://www.instagram.com/bdn_bnj",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`h-full antialiased ${pixelifySans.className} ${outfit.className}`}
    >
      <head>
        <meta name="google-site-verification" content="PmEGbJJC6OvnZ2rxFdJdsPEGMMdbvWm-daSfYxs3IsI" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-pixelify: ${pixelifySans.style.fontFamily};
            --font-outfit: ${outfit.style.fontFamily};
          }
        `}} />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: outfit.style.fontFamily,
          background: "var(--paper)",
          color: "var(--ink)",
        }}
      >
        <SplashCursor />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
