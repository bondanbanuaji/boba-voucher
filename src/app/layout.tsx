import type { Metadata } from "next";
import { Pixelify_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { SplashCursor } from "@/components/splash-cursor";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://boba-card.vercel.app"),
  title: {
    default: "Boba Card",
    template: "%s | Boba Card",
  },
  description:
    "Buat card ucapan personal untuk orang spesial. Pilih template, tulis pesan dari hati, bagikan lewat link unik.",
  openGraph: {
    title: "Boba Card",
    description:
      "Buat card ucapan personal untuk orang spesial. Pilih template, tulis pesan dari hati, bagikan lewat link unik.",
    url: "https://boba-card.vercel.app",
    siteName: "Boba Card",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boba Card",
    description:
      "Buat card ucapan personal untuk orang spesial. Pilih template, tulis pesan dari hati, bagikan lewat link unik.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        {children}
      </body>
    </html>
  );
}
