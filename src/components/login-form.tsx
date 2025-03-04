"use client";

import React, { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, refreshToken } from "@/services/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      // Save token (e.g., in localStorage or context)
      Cookies.set("accessToken", data.accessToken,{
        expires:1,
        secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
        sameSite: "Strict",
      });
      Cookies.set("refreshToken",data.refreshToken,{
        expires:1,
        secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
        sameSite: "Strict",
      });
      Cookies.set("loggedUserInfo", JSON.stringify(data.user), {
        secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
        sameSite: "Strict",
      });
      // Redirect or update state as needed
      console.log("Login successful", data);
      console.log(Cookies.get("loggedUserInfo"));
      console.log(Cookies.get("accessToken"));
      console.log(Cookies.get("refreshToken"));
      router.push('/dashboard')
      } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
