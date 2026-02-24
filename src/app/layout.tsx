import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Edge AI | AI agents that run locally",
  description:
    "We build autonomous AI agents powered by open-source models running on your hardware. No cloud required.",
  authors: [{ name: "Edge AI" }],
  keywords: ["edge AI", "local AI", "autonomous agents", "open-source", "privacy"],
  openGraph: {
    title: "Edge AI | AI agents that run locally",
    description:
      "We build autonomous AI agents powered by open-source models running on your hardware.",
    type: "website",
    url: "https://www.edge-ai.space",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edge AI | AI agents that run locally",
    description: "Autonomous AI agents. Open-source models. Your hardware.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-black text-white font-sans antialiased">
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
