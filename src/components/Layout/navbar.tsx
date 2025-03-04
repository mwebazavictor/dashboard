import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu";
  import { SidebarTrigger } from "../ui/sidebar";
  import { Button } from "../ui/button";
  import { User } from "lucide-react";
  
  export function Navbar() {
    return (
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-[60%] bg-gray-900/80 backdrop-blur-lg rounded-full px-6 py-3 flex items-center justify-between shadow-lg mb-4">
        {/* Sidebar Trigger (Left) */}
        <SidebarTrigger />

        {/* Profile Button (Right) */}
        <a href="/profile">
          <Button variant="ghost">
            <User className="w-5 h-5 mr-2" />
            Profile
          </Button>
        </a>
      </nav>
    );
  }
  