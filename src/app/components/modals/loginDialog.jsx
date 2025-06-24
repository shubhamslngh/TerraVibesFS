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
        router.refresh(); // Optional: reload current route
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


  const renderFieldError = (field) => {
    if (errors[field]) {
      return errors[field].map((msg, i) => (
        <p key={i} className="text-red-600 text-sm">
          {msg}
        </p>
      ));
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignup ? "Sign Up" : "Login"}</DialogTitle>
          <DialogDescription>
            {isSignup
              ? "Create a new account."
              : "Enter your email and password."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {isSignup && (
            <>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
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
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {renderFieldError("last_name")}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
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

          {errors.non_field_errors &&
            errors.non_field_errors.map((msg, i) => (
              <p key={i} className="text-red-600 text-sm">
                {msg}
              </p>
            ))}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? isSignup
                ? "Signing up..."
                : "Signing in..."
              : isSignup
              ? "Sign Up"
              : "Sign In"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setIsSignup(false);
                    resetForm();
                  }}>
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setIsSignup(true);
                    resetForm();
                  }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </form>

        <DialogClose asChild>
          
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
