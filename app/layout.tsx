import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { MessageProvider } from "@/providers/MessageContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolt New Clone",
  description: "Bolt New Clone",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph:{
    title: "Bolt New Clone",
    description: "Bolt New Clone",
    images: "/favicon.ico",
    url: "https://boltnewclone.vercel.app",
    siteName: "Bolt New Clone",
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <ConvexClientProvider>
       <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange >
              <MessageProvider>
                <Header/>
                {children}
              </MessageProvider>
          </ThemeProvider>
       </ConvexClientProvider>
      </body>
    </html>
  );
}
