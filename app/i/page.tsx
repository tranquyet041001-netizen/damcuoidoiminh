import { redirect } from "next/navigation";
import { weddingData } from "@/data/wedding";

export default function DefaultGuestPage() {
  redirect(`/i/${weddingData.slug || "quyet-han"}`);
}
