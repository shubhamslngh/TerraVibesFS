import "@/globals.css";
import Navbar from "./components/NavBar";
import { Cinzel, Monoton, Playfair_Display } from "next/font/google";
import { Providers } from "./provider";
import ThemeInitializer from "@/components/ThemeInitializer";
import Snackbar from "./components/ui/Snackbar";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const monoton = Monoton({ subsets: ["latin"], weight: ["400"], variable: "--font-monoton" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const imgUrl = "/footerimg2.jpg";
export const metadata = {
  title: "Event Platform",
  description: "Book events, explore packages, and make inquiries seamlessly.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${monoton.variable} ${playfair.variable}`}>
      <body className="relative w-full overflow-x-hidden m-0 p-0">

        <Providers>
          <ThemeInitializer /> 
          <div className="min-h-screen flex flex-col">
            <header className="w-full">
              <Navbar />
            </header>
            <Snackbar/>
            <main className="flex-grow w-full  max-w-screen-8xl mx-auto pt-20">
              {children}
            </main>

            <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
                {/* Left: Branding */}
                <div className="text-sm text-center sm:text-left">
                  <span className="font-semibold text-gray-900 dark:text-white">MoodsnTravel</span> © {new Date().getFullYear()} — All rights reserved
                </div>

                {/* Center: Links */}
                <div className="flex space-x-6 text-sm">
                  <a href="/privacy" className="hover:text-blue-500 transition">Privacy</a>
                  <a href="/terms" className="hover:text-blue-500 transition">Terms</a>
                  <a href="/contact" className="hover:text-blue-500 transition">Contact</a>
                </div>

                <div className="flex space-x-4">
                  <a href="https://twitter.com" aria-label="Twitter" className="hover:text-blue-400 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 4.6c-.9.4-1.8.6-2.7.8a4.7 4.7 0 0 0 2-2.6c-.9.6-2 .9-3 .9A4.5 4.5 0 0 0 16.6 3a4.5 4.5 0 0 0-4.5 4.5c0 .3 0 .6.1.9A12.9 12.9 0 0 1 3 3.9a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.5v.1c0 2.2 1.6 4 3.6 4.5a4.6 4.6 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.2A9 9 0 0 1 2 19.6a12.8 12.8 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.9v-.6a9 9 0 0 0 2.2-2.3z" />
                    </svg>
                  </a>
                  <a href="https://github.com" aria-label="GitHub" className="hover:text-gray-900 dark:hover:text-white transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6a3.2 3.2 0 0 0-1.3-1.8c-1.1-.7 0-.7 0-.7a2.5 2.5 0 0 1 1.8 1.2 2.6 2.6 0 0 0 3.6 1 2.6 2.6 0 0 1 .8-1.7c-2.6-.3-5.4-1.3-5.4-5.8A4.6 4.6 0 0 1 6 7.7a4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.6 4.2 18.6 4.5 18.6 4.5a4.3 4.3 0 0 1 .1 3.2 4.6 4.6 0 0 1 1.2 3.2c0 4.5-2.8 5.5-5.4 5.8a2.9 2.9 0 0 1 .9 2.3v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </footer>
          </div>

        </Providers>
      </body>
    </html>
  );
}
