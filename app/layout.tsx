import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "../styles.css";
import "../admin.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://annamloi.vn")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${manrope.variable}`}>{children}</body>
    </html>
  );
}
