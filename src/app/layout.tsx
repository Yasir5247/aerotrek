import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "swiper/swiper-bundle.min.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "../assets/css/icons.min.css";
import "../styles/globals.css";
import AppProviders from "@/providers/AppProviders";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"),
  title: {
    default: "AeroTrek - Official webpage of AeroTrek Maldives",
    template: "%s | AeroTrek",
  },
  description: "Travel bags and accessories in Maldives",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="h-full bg-white text-sm font-normal leading-6 text-black antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
