import "@/globals.css";
import Navbar from "./components/NavBar"; // Make sure the path is correct
import { Cinzel, Monoton, Playfair_Display } from "next/font/google";
import { Providers } from "./provider";
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const monoton = Monoton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-monoton",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Event Platform",
  description: "Book events, explore packages, and make inquiries seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${monoton.variable} ${playfair.variable}`}
    >
      <head>
        
      </head>

      <body>
        <Providers>
          <Navbar />
          
          <main className="max-w-8xl w-full px-6 py-8 z-10 relative pt-16">
            {children}
          </main>

          <footer className="text-black dark:text-white text-sm text-center py-4 mt-auto z-10 relative">
            &copy; {new Date().getFullYear()} Event Platform. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  );
}

