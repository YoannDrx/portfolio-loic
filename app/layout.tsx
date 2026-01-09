import { Inter, Montserrat } from "next/font/google";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ConsentProvider } from "@/components/neo-brutalist/legal/ConsentProvider";
import { GlobalAudioPlayerRootEngineMount } from "@/components/neo-brutalist/player/GlobalAudioPlayerRootEngineMount";
import type { Metadata } from "next";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${montserrat.variable}`}
      data-palette="orange"
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground antialiased transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ConsentProvider>
            {children}
            <GlobalAudioPlayerRootEngineMount />
            <Toaster />
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
