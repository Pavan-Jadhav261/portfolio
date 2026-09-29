import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pavanjadhav.dev";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Pavan Jadhav | AI Engineer & Intelligent Systems Builder",
    template: "%s | Pavan Jadhav",
  },
  description:
    "Portfolio of Pavan Jadhav — AI Engineer & Full-Stack Developer specializing in Autonomous AI Agents, LLM Fine-Tuning, Computer Vision, and High-Performance Intelligent Systems.",
  applicationName: "Pavan Jadhav Portfolio",
  authors: [{ name: "Pavan Jadhav", url: "https://github.com/Pavan-Jadhav261" }],
  generator: "Next.js",
  keywords: [
    "Pavan Jadhav",
    "AI Engineer",
    "Machine Learning Engineer",
    "Intelligent Systems",
    "Autonomous AI Agents",
    "LLM Fine-Tuning",
    "Computer Vision",
    "Full Stack Developer",
    "SchemeSathi",
    "Mentora AI",
    "Text to 3D",
    "ABHA+",
    "TypeScript",
    "Python",
    "PyTorch",
    "Next.js Portfolio",
  ],
  creator: "Pavan Jadhav",
  publisher: "Pavan Jadhav",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Pavan Jadhav Portfolio",
    title: "Pavan Jadhav | AI Engineer & Intelligent Systems Builder",
    description:
      "Explore intelligent systems, autonomous AI agents, and computer vision architectures built by Pavan Jadhav.",
    images: [
      {
        url: "/portfolio-landing.png",
        width: 1200,
        height: 630,
        alt: "Pavan Jadhav - AI Engineer & Intelligent Systems Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavan Jadhav | AI Engineer & Intelligent Systems Builder",
    description:
      "Explore intelligent systems, autonomous AI agents, and computer vision architectures built by Pavan Jadhav.",
    images: ["/portfolio-landing.png"],
    creator: "@PavanJadhav",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: "Pavan Jadhav",
      url: baseUrl,
      jobTitle: "AI Engineer & Full-Stack Developer",
      image: `${baseUrl}/portfolio-landing.png`,
      description:
        "AI Engineer & Full-Stack Developer specializing in Autonomous AI Agents, LLM Fine-Tuning, Computer Vision, and High-Performance Intelligent Systems.",
      email: "mailto:pavanjadhav5331@gmail.com",
      sameAs: [
        "https://github.com/Pavan-Jadhav261",
        "https://www.linkedin.com/in/pavan-jadhav261/",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Large Language Models",
        "Autonomous AI Agents",
        "Computer Vision",
        "Machine Learning",
        "TypeScript",
        "Python",
        "PyTorch",
        "Next.js",
        "Vector RAG",
        "System Architecture",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Pavan Jadhav Portfolio",
      description:
        "Official portfolio of Pavan Jadhav, showcasing intelligent systems, builds, and AI experiments.",
      publisher: {
        "@id": `${baseUrl}/#person`,
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${baseUrl}/#profilepage`,
      url: baseUrl,
      name: "Pavan Jadhav | AI Engineer & Intelligent Systems Builder",
      mainEntity: {
        "@id": `${baseUrl}/#person`,
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
