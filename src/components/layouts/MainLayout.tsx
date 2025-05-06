
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { User, UserPlus, Search, BarChart3, Users, FileText, Settings, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PageTransition } from "@/components/ui/PageTransition";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  
  const sidebarItems = [
    {
      title: "Midwife Dashboard",
      url: "/midwife",
      icon: User,
    },
    {
      title: "Register Mother",
      url: "/register-mother",
      icon: UserPlus,
    },
    {
      title: "Search Mothers",
      url: "/search",
      icon: Search,
    },
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: BarChart3,
    },
    {
      title: "Manage Midwives",
      url: "/midwives",
      icon: Users,
    },
    {
      title: "Forms",
      url: "/forms",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-border">
          <div className="flex h-16 items-center px-4 border-b">
            <h2 className="text-lg font-semibold tracking-tight text-primary">Maternal Flow</h2>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={cn(
                        "flex w-full items-center gap-2 px-3 py-2",
                        location.pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}>
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center gap-2 px-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </SidebarTrigger>
              <div className="ml-auto flex items-center space-x-4">
                {/* Add user profile or additional navigation here */}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
