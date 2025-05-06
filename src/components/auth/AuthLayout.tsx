
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/admin");
      }
      setIsLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/admin");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen"
    >
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-primary-foreground/20 to-background">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">MOCHCare</h1>
            <p className="text-muted-foreground">
              Maternal and Child Health Care Management System
            </p>
          </div>
          {children}
        </div>
      </main>
    </motion.div>
  );
}
