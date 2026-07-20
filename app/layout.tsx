import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdPopup from "./components/adPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {

  title: "WhiteDocs",
  description: "Free Open Source PDF Editor",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "WhiteDocs",
    description: "Free Open Source PDF Editor",
    images: [
      {
        url: "/api/og?title=WhiteDocs&description=Free%20Open%20Source%20PDF%20Editor",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhiteDocs",
    description: "Free Open Source PDF Editor",
    images: ["/api/og?title=WhiteDocs&description=Free%20Open%20Source%20PDF%20Editor"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}

        <AdPopup delay={5000} zoneId="1234567" showAgainAfterHours={0.01} />
      </body>
    </html>
  );
}
