import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
         <Script
          id="ad-zone"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11361537';s.src='https://nap5k.com/tag.min.js';document.body.appendChild(s)})(document.createElement('script'));`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        
        
        
        {/* Ad script - loads after page becomes interactive */}
       
      </body>
    </html>
  );
}