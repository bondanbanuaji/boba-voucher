import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Card Ucapan",
  description:
    "Buat card ucapan personal untuk orang spesial. Pilih template, tulis pesan dari hati, bagikan lewat link unik.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://boba-card.vercel.app/create",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
