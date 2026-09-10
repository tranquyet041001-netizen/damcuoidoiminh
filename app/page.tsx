import { Metadata } from "next";
import { getLatestWeddingDataAsync } from "@/utils/serverWeddingData";
import HomeViewWrapper from "./HomeViewWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const currentData = await getLatestWeddingDataAsync();
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
      url: "/",
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
  };
}

export default async function Home() {
  const currentData = await getLatestWeddingDataAsync();
  return <HomeViewWrapper initialData={currentData} />;
}

