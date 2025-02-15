"use client"
import { Home, Search, Settings, KeyRound, Ticket,BookPlus } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { title } from "process"

// Menu items.
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
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]
const unAuthItem = [
    {
        title:'Login / Signin',
        url:'/login',
        icon: KeyRound,
    },
    {
        title:'Register / Signup',
        url: 'register',
        icon:BookPlus,
    },
]

export function AppSidebar() {
    const pathname = usePathname();
    const publicRoutes:Array<string> = ['/','/login','/register']
    const[isRoutePublic,setIsRoutePublic] = useState<boolean>(false);

    useEffect(()=>{
        setIsRoutePublic(publicRoutes.includes(pathname));
    },[pathname])
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel><h1> Tubayo</h1></SidebarGroupLabel>
          <SidebarGroupContent>
          <SidebarMenu>
              {isRoutePublic ? (
                unAuthItem.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
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
  )
}
