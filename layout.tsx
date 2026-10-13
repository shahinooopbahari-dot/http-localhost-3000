import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShahinLearn | با هم یاد بگیر، قوی‌تر شو، آینده‌ات رو بساز!",
  description: "ShahinLearn؛ فضای یادگیری، اشتراک دانش و ارتباط دانشجویان با مدیریت شاهین بهاری",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
