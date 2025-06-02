import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Website",
  description: "A simple gym website built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('gym-theme') || 'dark';
                document.documentElement.classList.add(theme);
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="gym-theme"
        >
          <div className="md:bg-yellow-200 fixed left-0 top-20 z-[100] flex w-[30px] items-center justify-center bg-gray-200 py-[2.5px] text-[12px] uppercase text-black sm:bg-red-200 lg:bg-green-200 xl:bg-blue-200 2xl:bg-pink-200">
            <span className="block sm:hidden">all</span>
            <span className="hidden sm:block md:hidden">sm</span>
            <span className="hidden md:block lg:hidden">md</span>
            <span className="hidden lg:block xl:hidden">lg</span>
            <span className="hidden xl:block 2xl:hidden">xl</span>
            <span className="hidden 2xl:block">2xl</span>
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
