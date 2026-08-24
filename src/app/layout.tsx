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
  title: {
    default: "Boba Voucher",
    template: "%s | Boba Voucher",
  },
  description:
    "Sistem voucher digital pribadi untuk membuat, mengelola, dan mengirim voucher kepada teman dan keluarga.",
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
