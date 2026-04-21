import type { Metadata } from "next";
import { IBM_Plex_Sans, Red_Hat_Text } from "next/font/google";
import "./globals.css";
import "./webflow-css/normalize.css";
import "./webflow-css/webflow.css";
import "./webflow-css/theme.css";
import "./webflow-css/nav-overrides.css";
import "./webflow-css/custom-pages.css";

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const redHat = Red_Hat_Text({
  variable: "--font-red-hat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mid-Atlantic Uniform League",
  description:
    "Mid-Atlantic Uniform League (MAUL) is a uniform organization that functions as a Ceremonial Honor Guard unit.",
  openGraph: {
    title: "Mid-Atlantic Uniform League",
    description:
      "Mid-Atlantic Uniform League (MAUL) is a uniform organization that functions as a Ceremonial Honor Guard unit.",
    type: "website",
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlex.variable} ${redHat.variable}`}
    >
      <body className="body">{children}</body>
    </html>
  );
}
