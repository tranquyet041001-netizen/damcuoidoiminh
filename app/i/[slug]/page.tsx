import { Metadata } from "next";
import { weddingData } from "@/data/wedding";
import GuestViewWrapper from "./GuestViewWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Thiệp Cưới • ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
    description: `${weddingData.welcomeQuote} — Kính mời bạn tới chung vui cùng chúng mình vào ngày ${weddingData.weddingDateFormatted}.`,
    openGraph: {
      title: `Thiệp Cưới • ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
      description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình vào ${weddingData.weddingDateFormatted}.`,
      url: `/i/${resolvedParams.slug || "minh-an"}`,
      siteName: `Thiệp Cưới ${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
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
    },
  };
}

export function generateStaticParams() {
  return [{ slug: "quyet-han" }, { slug: "minh-an" }];
}

export default function GuestPage() {
  return <GuestViewWrapper />;
}
