"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/modals/loginDialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const [isDark, setIsDark] = useState(undefined);
  const navbarRef = useRef(null);
  const { data: session, status } = useSession();
const getDomTheme = () =>
  typeof document !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;
    useEffect(() => {
      setIsDark(getDomTheme());
    }, []);
  // Only check localStorage and set theme in useEffect
  useEffect(() => {
    const currtheme =
      localStorage.getItem("theme") || localStorage.getItem("nuxt-color-mode");
    if (currtheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  },  []);
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("nuxt-color-mode", newTheme);
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
if (isDark === undefined) return null;

  return (
    <nav
      ref={navbarRef}
      className="bg-opacity-0 dark:bg-opacity-0 transition-all duration-700 ease-in-out w-full fixed top-0 left-0 z-50 backdrop-blur-lg bg-white dark:bg-black/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-cinzel font-bold text-slate-600 dark:text-red-300">
          TerraVibes
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-playfair text-sm text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-indigo-500 transition">
            Home
          </Link>

          <Link
            href="/experiences"
            className="hover:text-indigo-500 transition">
            Experiences
          </Link>
          {/* <Link href="/contact" className="hover:text-indigo-500 transition">
            Contact
          </Link> */}
        </div>

        <div className="flex items-center space-x-4">
          {status === "loading" ? null : !session ? (
            <>
              <LoginDialog mode="login">
                <Button variant="ghost">Login</Button>
              </LoginDialog>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    {session.user.image ? (
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                    ) : (
                      <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <span className="text-xl">{isDark ? "🌞" : "🌙"}</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
