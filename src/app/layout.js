import "@/globals.css";
import Navbar from "./components/NavBar";
import { Cinzel, Monoton, Playfair_Display } from "next/font/google";
import { Providers } from "./provider";
import ThemeInitializer from "@/components/ThemeInitializer";

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
      <body className="relative will-change-scroll">
        <Providers>
          <ThemeInitializer /> {/* ⬅️ This handles the dark mode */}
          <Navbar />
          <main className="max-w-8xl w-full px-6 py-8 z-10 relative pt-16">{children}</main>
          <footer
               className="relative w-full min-h-30 mask-t-from-60% bg-[url('/footerimg2.jpg')] bg-cover bg-center rounded-2xl flex flex-col place-self-center items-center justify-center">

            
            <div
              className="absolute inset-0 pointer-events-none dark:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.85) 80%)",
                mixBlendMode: "multiply",
              }}
            />
            {/* DARK THEME GRADIENT */}
            <div
              className="absolute inset-0 pointer-events-none hidden dark:block"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(20,24,31,0.1) 0%, rgba(24,32,48,0.88) 85%)",
                mixBlendMode: "multiply",
              }}
            />

            <div className="relative z-10 w-full flex flex-col items-center justify-center">
              <p className="font-playfair text-sm md:text-base text-center text-white dark:text-white drop-shadow-lg">
                &copy; {new Date().getFullYear()} Event Platform. All rights reserved.
              </p>
              <p className="mt-2 text-xs md:text-sm text-white/80 dark:text-white/70 italic">
                Made for foodies and explorers alike.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
