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
import { Button } from "../ui/button";
import { User } from "lucide-react";
  
export function Navbar() {
    return(
        <div>
            <NavigationMenu>
                <NavigationMenuList className="flex justify-between">
                    <NavigationMenuItem>
                        <SidebarTrigger />
                    </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Button>
                                <User />
                                Profile
                            </Button>
                        </NavigationMenuItem>               
                    </NavigationMenuList>
            </NavigationMenu>

        </div>
    );
}