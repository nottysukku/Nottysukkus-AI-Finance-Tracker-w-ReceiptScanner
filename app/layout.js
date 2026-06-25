import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import TawkTo from "@/components/tawk-to";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Money | An AI-powered financial management platform",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-sm-1.png" sizes="any" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {
                  console.error('Error applying theme:', e);
                }
              `,
            }}
          />
        </head>
        <body className={`${inter.className} relative min-h-screen antialiased`}>
          {/* Glowing backdrop blobs */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="absolute top-[15%] left-[-5%] w-[35rem] h-[35rem] bg-purple-600/10 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-[10%] right-[-5%] w-[40rem] h-[40rem] bg-pink-600/10 rounded-full blur-[130px] animate-float-reverse" />
            <div className="absolute top-[45%] right-[20%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[110px] animate-pulse-glow" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen justify-between">
            <div>
              <Header />
              <main className="pt-20">{children}</main>
            </div>
            
            <Toaster richColors />
            <TawkTo />

            <footer className="glass-panel border-t border-white/5 py-12 mt-20">
              <div className="container mx-auto px-4 text-center text-gray-400">
                <p className="hover:text-purple-400 transition-colors">Made with 💗 by Sukritchopra &copy; 2026</p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
