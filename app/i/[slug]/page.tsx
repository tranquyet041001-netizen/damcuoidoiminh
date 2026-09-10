import { Metadata } from "next";
import { getLatestWeddingData } from "@/utils/serverWeddingData";
import GuestViewWrapper from "./GuestViewWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const currentData = getLatestWeddingData();

  const previewImage =
    currentData.gallery && currentData.gallery.length > 0
      ? currentData.gallery[0].url
      : currentData.groom.avatarUrl;

  return {
    title: `Thiệp Cưới • ${currentData.groom.shortName} & ${currentData.bride.shortName}`,
    description: `${currentData.welcomeQuote} — Kính mời bạn tới chung vui cùng chúng mình vào ngày ${currentData.weddingDateFormatted}.`,
    openGraph: {
      title: `Thiệp Cưới • ${currentData.groom.shortName} & ${currentData.bride.shortName}`,
      description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình vào ${currentData.weddingDateFormatted}.`,
      url: `/i/${resolvedParams.slug || currentData.slug || "quyet-han"}`,
      siteName: `Thiệp Cưới ${currentData.groom.shortName} & ${currentData.bride.shortName}`,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: `Thiệp cưới ${currentData.groom.shortName} & ${currentData.bride.shortName}`,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Thiệp Cưới • ${currentData.groom.shortName} & ${currentData.bride.shortName}`,
      description: `${currentData.welcomeQuote}`,
      images: [previewImage],
    },
  };
}

export default async function GuestPage() {
  const currentData = getLatestWeddingData();
  return <GuestViewWrapper initialData={currentData} />;
}
