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
import { login, registerCompany } from "@/services/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function CompanyRegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const companyData = {
        companyname: companyName,
        companyemail: companyEmail,
        companylocation: companyLocation,
        industry,
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: "admin",
      };

      const data = await registerCompany(companyData);
      const loginNow = await login({ email: adminEmail, password: adminPassword });
      
      Cookies.set("accessToken", loginNow.accessToken, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", loginNow.refreshToken, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("loggedUserInfo", JSON.stringify(loginNow.user), {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className={cn("w-full max-w-md", className)} {...props}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Register Company</CardTitle>
          <CardDescription className="text-center">
            Enter your company and admin details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Details Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyname">Company Name</Label>
                <Input
                  id="companyname"
                  type="text"
                  placeholder="TubayoAI"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyemail">Company Email</Label>
                <Input
                  id="companyemail"
                  type="email"
                  placeholder="ai@tubayoai.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                  className="h-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companylocation">Location</Label>
                  <Input
                    id="companylocation"
                    type="text"
                    placeholder="Nakawa"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    type="text"
                    placeholder="Software"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Admin Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminname">Admin Name</Label>
                  <Input
                    id="adminname"
                    type="text"
                    placeholder="AI Admin"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminphone">Phone</Label>
                  <Input
                    id="adminphone"
                    type="text"
                    placeholder="0725625625"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminemail">Admin Email</Label>
                <Input
                  id="adminemail"
                  type="email"
                  placeholder="admin@tubayoai.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminpassword">Password</Label>
                <Input
                  id="adminpassword"
                  type="password"
                  placeholder="Enter Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="h-9"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Register Company
            </Button>
            
            {error && (
              <p className="text-sm text-red-500 text-center mt-2">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CompanyRegisterForm;