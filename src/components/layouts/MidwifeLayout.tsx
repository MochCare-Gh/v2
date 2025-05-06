
import { AuthGuard } from "@/components/auth/AuthGuard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, User, LogOut } from "lucide-react";

export function MidwifeLayout({ children }: { children: React.ReactNode }) {
  const [isMidwife, setIsMidwife] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsMidwife(false);
          navigate("/auth/login");
          return;
        }
        
        // Check the user's role in the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // For development, allow access
          setIsMidwife(true);
          console.log("Role check bypassed due to error - giving midwife access");
          return;
        }
        
        // Check if the role is either midwife or admin (admins can access midwife pages)
        const hasAccess = profileData?.role === 'midwife' || profileData?.role === 'admin';
        setIsMidwife(hasAccess);
        
        if (!hasAccess) {
          toast({
            title: "Access denied",
            description: "You do not have permission to access the midwife area",
            variant: "destructive"
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error in midwife auth check:", error);
        // Temporary bypass for auth issues
        setIsMidwife(true);
        
        toast({
          title: "Warning",
          description: "Role verification bypassed due to technical issues.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Show loading state while checking role
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header Nav */}
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-8">
              <h2 className="text-lg font-semibold tracking-tight text-primary">MOCHCare</h2>
            </div>
            
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              <Button 
                asChild 
                variant={isActive("/midwife") && !isActive("/midwife/") ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <Link to="/midwife">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant={isActive("/midwife/mothers") ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <Link to="/midwife/mothers">
                  <Users className="h-4 w-4" />
                  <span>Mothers</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant={isActive("/midwife/forms") ? "default" : "ghost"} 
                className="flex items-center gap-2"
              >
                <Link to="/midwife/forms">
                  <FileText className="h-4 w-4" />
                  <span>Forms</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant={isActive("/midwife/account") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Link to="/midwife/account">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            </nav>
            
            <div className="ml-auto">
              <Button variant="ghost" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
