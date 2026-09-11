import { Metadata } from "next";
import { getLatestWeddingDataAsync } from "@/utils/serverWeddingData";
import AdminStudio from "./AdminStudio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Thư Phòng Quản Trị • Hoàng Gia Hỷ Sự | Chỉnh Sửa Thiệp Cưới",
  description: "Trang chỉnh sửa thông tin thiệp cưới hoàng gia, lưu dữ liệu và đồng bộ tới khách mời.",
};

export default async function AdminPage() {
  const currentData = await getLatestWeddingDataAsync();
  return <AdminStudio initialData={currentData} />;
}

