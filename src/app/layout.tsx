
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Layout/sidebar"
import { Navbar } from "@/components/Layout/navbar";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";
import ClientErrorWrapper from "@/components/clientErrorWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TAI AGENTS",
  description: "Powered by Tubayo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-50 flex overflow-hidden`}
      >
        <SidebarProvider>
          <Navbar />
          <div className="flex w-full">
            <AppSidebar />
            
            <main className="flex-1 h-screen overflow-y-auto pt-[60px]">
              
              <div className="w-full">
                <ClientErrorWrapper>
                  {children}
                  </ClientErrorWrapper>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}