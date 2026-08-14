import type { Metadata } from "next";
import "./globals.css";
import "./accessibility.css";
import "./product.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AlgoHar — алгоритмы через интерактивные визуализации", template: "%s — AlgoHar" },
  description: "Интерактивный курс по алгоритмам и структурам данных: пошаговые визуализации, инварианты, сложность и практика.",
  openGraph: {
    title: "AlgoHar",
    description: "Алгоритмы, которые можно увидеть шаг за шагом.",
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
