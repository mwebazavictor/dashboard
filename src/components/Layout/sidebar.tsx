"use client";
import { Home, Search, Settings, KeyRound, Ticket, BookPlus, DollarSign } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Manage Agents",
    url: "/agents/manage",
    icon: Ticket,
  },
  {
    title:'Purchase Agents',
    url: '/agents/purchase',
    icon:DollarSign
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const unAuthItem = [
  {
    title: "Login / Signin",
    url: "/login",
    icon: KeyRound,
  },
  {
    title: "Register / Signup",
    url: "register",
    icon: BookPlus,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const publicRoutes: string[] = ["/", "/login", "/register"];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !pathname) return null;

  const isRoutePublic = publicRoutes.includes(pathname);

  return (
    <Sidebar className="border-r border-zinc-200 bg-white w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-4 border-b border-zinc-200">
            <a href="/">
              <h1 className="text-xl font-bold text-zinc-800">Tubayo</h1>
            </a>
            
          </SidebarGroupLabel>
          <SidebarGroupContent className="py-4">
            <SidebarMenu>
              {isRoutePublic ? (
                unAuthItem.map((item) => (
                  <SidebarMenuItem key={item.title} className="px-2">
                    <SidebarMenuButton
                      asChild
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                items.map((item) => (
                  <SidebarMenuItem key={item.title} className="px-2">
                    <SidebarMenuButton
                      asChild
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        pathname === item.url
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                      }`}
                    >
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}