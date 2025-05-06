
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Map,
  Users,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  Building,
  Globe,
  ShieldCheck,
  User,
  Cog,
  Code,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth/login");
  };

  const getIsActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="flex flex-col items-center justify-center pt-6">
          <h2 className="text-xl font-bold">MOCHCare</h2>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin")}
                    onClick={() => navigate("/admin")}
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Location Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/districts")}
                    onClick={() => navigate("/admin/districts")}
                  >
                    <Globe />
                    <span>Districts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/facilities")}
                    onClick={() => navigate("/admin/facilities")}
                  >
                    <Building />
                    <span>Facilities</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>People</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/personnel")}
                    onClick={() => navigate("/admin/personnel")}
                  >
                    <Users />
                    <span>Personnel</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/mothers")}
                    onClick={() => navigate("/admin/mothers")}
                  >
                    <UserPlus />
                    <span>Mothers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Forms</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/forms")}
                    onClick={() => navigate("/admin/forms")}
                  >
                    <FileText />
                    <span>Form Builder</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/users")}
                    onClick={() => navigate("/admin/users")}
                  >
                    <ShieldCheck />
                    <span>User Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
                {/* <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/account")}
                    onClick={() => navigate("/admin/account")}
                  >
                    <User />
                    <span>Account Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/settings")}
                    onClick={() => navigate("/admin/settings")}
                  >
                    <Cog />
                    <span>General Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={getIsActive("/admin/api")}
                    onClick={() => navigate("/admin/api")}
                  >
                    <Code />
                    <span>API</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
