"use client";

import React, { useEffect, useRef, useState, Fragment } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
import LoginDialog from "@/components/modals/loginDialog";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lottieRef = useRef(null);
  const { data: session, status } = useSession();

  // --- Detect and set theme on mount ---
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (document.documentElement.classList.contains("dark") ? "dark" : "light");

    const dark = savedTheme === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  // --- Toggle theme + control Lottie animation ---
  const toggleTheme = () => {
    const goingToDark = !isDark;
    const newTheme = goingToDark ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", goingToDark);
    setIsDark(goingToDark);

    // Lottie animation control
    const api = lottieRef.current;
    if (api) {
      try {
        if (goingToDark && api.setMode) {
          api.setMode("reverse"); // Play backwards (moon → sun)
        } else if (!goingToDark && api.setMode) {
          api.setMode("normal"); // Play forward (sun → moon)
        }
        api.play?.();
      } catch (e) {
        console.warn("Lottie control failed:", e);
        api.play?.(); // Fallback
      }
    }
  };

  return (
    <nav className="p-2 fixed top-0 w-full bg-transparent backdrop-blur-md z-50">
      <div className="max-w-[80vw] mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-[clamp(1.2rem,3vw,2rem)] font-bold text-black dark:text-red-300">
          CrispyTraveller
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-red-500">
            Home
          </Link>
          <Link href="/experiences" className="hover:text-red-500">
            Experiences
          </Link>
          <Link href="/blogs" className="hover:text-red-500">
            Stories
          </Link>
          <Link href="/generate" className="hover:text-red-500">
            Create
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
                      <AvatarImage src={session.user.image} alt="User" />
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

          {/* ✅ Lottie Theme Toggle Button */}
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            <DotLottieReact
              dotLottieRefCallback={(instance) =>
                (lottieRef.current = instance)
              }
              src="/LDswitch.lottie"
              autoplay={false}
              loop={false}
              style={{ width: 40, height: 40 }}
            />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog
          onClose={() => setMobileMenuOpen(false)}
          className="relative z-50">
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
            <Dialog.Panel className="w-72 bg-white dark:bg-black p-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col mt-6 space-y-4">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link
                  href="/experiences"
                  onClick={() => setMobileMenuOpen(false)}>
                  Experiences
                </Link>
                <Link href="/generate" onClick={() => setMobileMenuOpen(false)}>
                  Create
                </Link>

                {session && (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}>
                      Sign Out
                    </button>
                  </>
                )}

                {!session && (
                  <LoginDialog mode="login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </LoginDialog>
                )}

                <Button variant="ghost" onClick={toggleTheme}>
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
