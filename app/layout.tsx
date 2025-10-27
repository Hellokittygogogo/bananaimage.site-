import { currentBrand } from "@/lib/brand";
import { I18nProvider } from "@/components/i18n-provider";
import { detectLocale, getMessages } from "@/lib/i18n/server";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const dynamic = "force-dynamic";

const baseUrl = process.env.BASE_URL ? `https://${process.env.BASE_URL}` : "http://localhost:3000";

export async function generateMetadata() {
  const brand = currentBrand();
  return {
    metadataBase: new URL(baseUrl),
    title: brand.name,
    description: "Edit images with natural language using our AI editor.",
    keywords:
      "AI image editor, text-to-edit, natural language editing, photo editing AI, inpainting, one-shot editing",
    openGraph: {
      title: brand.name,
      description: "Edit images with natural language using our AI editor.",
      type: "website",
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: brand.name,
      description: "Discover your perfect Chinese name with our AI-powered generator.",
    },
  } as const;
}

const geistSans = Geist({ display: "swap", subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const locale = detectLocale();
  const messages = await getMessages(locale);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang={locale} className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative min-h-screen">
            <Header user={user} />
            <I18nProvider locale={locale} messages={messages}>
              <main className="flex-1">{children}</main>
            </I18nProvider>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
