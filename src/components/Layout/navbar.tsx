import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { SidebarTrigger } from "../ui/sidebar";
  
export function Navbar() {
    return(
        <div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger><SidebarTrigger /></NavigationMenuTrigger>
                    </NavigationMenuItem>
               </NavigationMenuList>
            </NavigationMenu>

        </div>
    );
}