
import { useState, useEffect } from "react";
import { UserPlus, Search, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./StatsCard";
import { RecentEntries } from "./RecentEntries";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalMothers: 0,
    antenatalVisits: 0,
    newRegistrations: 0,
    upcomingAppointments: 0,
    maternalTrend: "up",
    visitsTrend: "up",
    registrationTrend: "up"
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch total mothers count
        const { count: totalMothers, error: mothersError } = await supabase
          .from('mothers')
          .select('*', { count: 'exact', head: true });
          
        if (mothersError) throw mothersError;
        
        // Fetch antenatal visits for current month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        const { count: antenatalVisits, error: visitsError } = await supabase
          .from('visits')
          .select('*', { count: 'exact', head: true })
          .eq('visit_type', 'Antenatal')
          .gte('visit_date', firstDayOfMonth.toISOString());
        
        if (visitsError) throw visitsError;
        
        // Fetch new registrations this month
        const { count: newRegistrations, error: registrationsError } = await supabase
          .from('mothers')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', firstDayOfMonth.toISOString());
        
        if (registrationsError) throw registrationsError;
        
        // Fetch upcoming appointments for next 7 days
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const { count: upcomingAppointments, error: appointmentsError } = await supabase
          .from('visits')
          .select('*', { count: 'exact', head: true })
          .gte('next_visit_date', currentDate.toISOString().split('T')[0])
          .lte('next_visit_date', nextWeek.toISOString().split('T')[0]);
        
        if (appointmentsError) throw appointmentsError;
        
        // Set the stats
        setStats({
          totalMothers: totalMothers || 0,
          antenatalVisits: antenatalVisits || 0,
          newRegistrations: newRegistrations || 0,
          upcomingAppointments: upcomingAppointments || 0,
          maternalTrend: "up",
          visitsTrend: "up",
          registrationTrend: "up"
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Error loading dashboard data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        className="flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight">Midwife Dashboard</h1>
        <p className="text-muted-foreground">
          Manage maternal records and healthcare services efficiently.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg" className="rounded-xl px-5 py-6 h-auto bg-primary text-white hover:bg-primary/90">
          <Link to="/register-mother" className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="text-base font-medium">New Mother Registration</span>
              <span className="text-xs font-normal opacity-80">Register a new mother into the system</span>
            </div>
          </Link>
        </Button>
        
        <Button asChild size="lg" variant="outline" className="rounded-xl px-5 py-6 h-auto">
          <Link to="/search" className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="text-base font-medium">Search Existing Mothers</span>
              <span className="text-xs font-normal text-muted-foreground">Find and manage mother records</span>
            </div>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Mothers"
          value={loading ? "Loading..." : stats.totalMothers.toString()}
          icon={Users}
          trend={stats.maternalTrend as "up" | "down" | "neutral"}
          trendValue=""
          delay={0.1}
        />
        <StatsCard
          title="Antenatal Visits"
          value={loading ? "Loading..." : stats.antenatalVisits.toString()}
          description="This Month"
          icon={FileText}
          trend={stats.visitsTrend as "up" | "down" | "neutral"}
          trendValue=""
          delay={0.2}
        />
        <StatsCard
          title="New Registrations"
          value={loading ? "Loading..." : stats.newRegistrations.toString()}
          description="This Month"
          icon={UserPlus}
          trend={stats.registrationTrend as "up" | "down" | "neutral"}
          trendValue=""
          delay={0.3}
        />
        <StatsCard
          title="Upcoming Appointments"
          value={loading ? "Loading..." : stats.upcomingAppointments.toString()}
          description="Next 7 Days"
          icon={Search}
          delay={0.4}
        />
      </div>

      <RecentEntries />
    </div>
  );
}
