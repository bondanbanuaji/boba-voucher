import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Saya",
  description: "Detail dan status card ucapan yang telah kamu buat.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CardViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
