"use client";

import Link from "next/link";
import React, { Fragment } from "react";
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
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isDark, setIsDark] = useState(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const { data: session, status } = useSession();

  const getDomTheme = () =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false;

  useEffect(() => {
    setIsDark(getDomTheme());
  }, []);

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
  }, []);

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
      className="p-2 bg-opacity-0 bg-transparent dark:bg-opacity-0 transition-all duration-700 ease-in-out w-full fixed top-0 left-0 z-50 backdrop-blur-lg dark:bg-black/80 shadow-md">
      <div className="max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-[clamp(1.5rem,5vw,2.5rem)] font-cinzel font-bold text-slate-600 dark:text-red-300">
          TerraVibes
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 font-playfair text-[clamp(0.875rem,1vw,1.125rem)] text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-indigo-500 transition">
            Home
          </Link>
          <Link
            href="/experiences"
            className="hover:text-indigo-500 transition">
            Experiences
          </Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {status !== "loading" && !session ? (
            <LoginDialog mode="login">
              <Button variant="ghost">Login</Button>
            </LoginDialog>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="dark" className="rounded-full p-0">
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
          ) : null}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <span className="text-xl">{isDark ? "🌞" : "🌙"}</span>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog
          onClose={() => setMobileMenuOpen(false)}
          className="relative z-50 md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex justify-end">
            <Dialog.Panel className="w-72 bg-white dark:bg-black text-black dark:text-white p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-4 font-playfair text-lg">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link
                  href="/experiences"
                  onClick={() => setMobileMenuOpen(false)}>
                  Experiences
                </Link>
                {status !== "loading" && session && (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="text-left">
                      Sign Out
                    </button>
                  </>
                )}
                {status !== "loading" && !session && (
                  <LoginDialog mode="login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </LoginDialog>
                )}
                <Button variant="ghost" className="mt-4" onClick={toggleTheme}>
                  {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </nav>
  );
}
