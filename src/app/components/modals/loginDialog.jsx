"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/api";
import { signIn } from "next-auth/react";

export default function AuthDialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setPhone("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (isSignup) {
        await registerUser({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
          phone,
        });
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        setIsOpen(false);
        resetForm();
        router.refresh();
      } else {
        setErrors({ non_field_errors: ["Invalid email or password"] });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        setErrors(data);
      } else {
        setErrors({ non_field_errors: ["Authentication failed"] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldError = (field) =>
    errors[field]?.map((msg, i) => (
      <p key={i} className="text-red-500 text-xs mt-1">
        {msg}
      </p>
    ));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-neutral-900/90
                   backdrop-blur-md shadow-xl p-6 space-y-4 transition-all duration-300">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            {isSignup
              ? "Sign up to start your next adventure."
              : "Sign in to continue exploring."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
          {/* Signup Fields */}
          {isSignup && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                {renderFieldError("first_name")}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {renderFieldError("last_name")}
              </div>
            </div>
          )}

          {isSignup && (
            <>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {renderFieldError("username")}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {renderFieldError("phone")}
              </div>
            </>
          )}

          {/* Common Fields */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {renderFieldError("email")}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {renderFieldError("password")}
          </div>

          {errors.non_field_errors?.map((msg, i) => (
            <p key={i} className="text-red-500 text-sm text-center">
              {msg}
            </p>
          ))}

          <Button
            type="submit"
            className="w-full mt-2 font-medium text-base"
            disabled={isLoading}>
            {isLoading
              ? isSignup
                ? "Creating Account..."
                : "Signing In..."
              : isSignup
              ? "Sign Up"
              : "Sign In"}
          </Button>
        </form>

        {/* Switch Mode */}
        <div className="text-center text-sm mt-3 text-gray-600 dark:text-gray-400">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 dark:text-amber-400 hover:underline"
                onClick={() => {
                  setIsSignup(false);
                  resetForm();
                }}>
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-blue-600 dark:text-amber-400 hover:underline"
                onClick={() => {
                  setIsSignup(true);
                  resetForm();
                }}>
                Sign Up
              </button>
            </>
          )}
        </div>

        <DialogClose asChild>
          <div />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
