import { Metadata } from "next";
import { getLatestWeddingDataAsync } from "@/utils/serverWeddingData";
import AdminStudio from "./AdminStudio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Studio • Quản Trị & Chỉnh Sửa Thiệp Cưới",
  description: "Trang chỉnh sửa thông tin thiệp cưới, lưu dữ liệu và đồng bộ tới khách mời.",
};

export default async function AdminPage() {
  const currentData = await getLatestWeddingDataAsync();
  return <AdminStudio initialData={currentData} />;
}

