import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { themeBootstrapScript } from "@/lib/theme";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dime — Cartas para hablar en español",
  description:
    "Cartas de conversación en español para aprender y conectar. Elige un nivel y un modo, y deja que la charla fluya.",
  applicationName: "Dime",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Dime",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4eee2" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1b18" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Set the theme class before paint to avoid a flash / hydration mismatch. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className={`${fraunces.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
