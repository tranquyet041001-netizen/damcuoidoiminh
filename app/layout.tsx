import type { Metadata, Viewport } from "next";
import { Noto_Serif, Be_Vietnam_Pro, Great_Vibes } from "next/font/google";
import "./globals.css";
import { weddingData } from "@/data/wedding";

const notoSerif = Noto_Serif({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-vietnam",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Thiệp Cưới • ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
  description: `${weddingData.welcomeQuote} — Kính mời người thương mến tới chung vui trong ngày trọng đại của ${weddingData.groom.shortName} và ${weddingData.bride.shortName} vào ngày ${weddingData.weddingDateFormatted}.`,
  openGraph: {
    title: `Thiệp Cưới • ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
    description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình vào ${weddingData.weddingDateFormatted}.`,
    url: "https://an-minh.vn",
    siteName: "Thiệp Cưới Quang Minh & Thục An",
    images: [
      {
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: `Thiệp cưới ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Thiệp Cưới • ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
    description: `${weddingData.welcomeQuote}`,
    images: ["https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop"],
  },
};

export const viewport: Viewport = {
  themeColor: "#183A3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${notoSerif.variable} ${beVietnamPro.variable} ${greatVibes.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-do-texture text-[#3A2D26] flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
