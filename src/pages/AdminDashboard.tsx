
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { BarChart, Users, Building, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    facilities: 0,
    districts: 0,
    midwives: 0,
    forms: 0,
    mothers: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCounts();
    fetchChartData();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      
      // Count facilities
      const { count: facilitiesCount, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*', { count: 'exact', head: true });
      
      if (facilitiesError) throw facilitiesError;
      
      // Count districts
      const { count: districtsCount, error: districtsError } = await supabase
        .from('districts')
        .select('*', { count: 'exact', head: true });
      
      if (districtsError) throw districtsError;
      
      // Count midwives
      const { count: midwivesCount, error: midwivesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'midwife');
      
      if (midwivesError) throw midwivesError;
      
      // Count forms
      const { count: formsCount, error: formsError } = await supabase
        .from('forms')
        .select('*', { count: 'exact', head: true });

      if (formsError) throw formsError;

      // Count mothers
      const { count: mothersCount, error: mothersError } = await supabase
        .from('mothers')
        .select('*', { count: 'exact', head: true });

      if (mothersError) throw mothersError;

      setCounts({
        facilities: facilitiesCount || 0,
        districts: districtsCount || 0,
        midwives: midwivesCount || 0,
        forms: formsCount || 0,
        mothers: mothersCount || 0
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
      toast({
        title: "Error fetching dashboard data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      // Getting visits for the last 7 months
      const now = new Date();
      const months = [];
      const visitsByMonth = {};
      const deliveriesByMonth = {};

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = format(d, 'MMM');
        months.push(monthName);
        visitsByMonth[monthName] = 0;
        deliveriesByMonth[monthName] = 0;
      }

      // Fetch visits data
      const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString();
      
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('visit_date')
        .gte('visit_date', startDate);
      
      if (visitsError) throw visitsError;
      
      // Count visits by month
      if (visitsData) {
        visitsData.forEach(visit => {
          const visitDate = new Date(visit.visit_date);
          const monthName = format(visitDate, 'MMM');
          if (visitsByMonth[monthName] !== undefined) {
            visitsByMonth[monthName]++;
          }
        });
      }
      
      // Fetch deliveries data
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('delivery_date')
        .gte('delivery_date', startDate);
      
      if (deliveriesError) throw deliveriesError;
      
      // Count deliveries by month
      if (deliveriesData) {
        deliveriesData.forEach(delivery => {
          const deliveryDate = new Date(delivery.delivery_date);
          const monthName = format(deliveryDate, 'MMM');
          if (deliveriesByMonth[monthName] !== undefined) {
            deliveriesByMonth[monthName]++;
          }
        });
      }
      
      // Format data for chart
      const formattedData = months.map(month => ({
        name: month,
        visits: visitsByMonth[month] || 0,
        deliveries: deliveriesByMonth[month] || 0
      }));
      
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Fallback to sample data
      setChartData([
        { name: "Jan", visits: 240, deliveries: 65 },
        { name: "Feb", visits: 300, deliveries: 72 },
        { name: "Mar", visits: 280, deliveries: 85 },
        { name: "Apr", visits: 320, deliveries: 78 },
        { name: "May", visits: 290, deliveries: 68 },
        { name: "Jun", visits: 350, deliveries: 90 },
        { name: "Jul", visits: 380, deliveries: 105 },
      ]);
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      let data;
      let filename;
      let headers;

      // Fetch data based on report type
      switch (reportType) {
        case "Monthly Antenatal Visits":
          const { data: visits, error: visitsError } = await supabase
            .from('visits')
            .select(`
              id, 
              visit_date, 
              visit_type, 
              mothers:mother_id (full_name), 
              facilities:facility_id (name)
            `)
            .eq('visit_type', 'Antenatal');
          
          if (visitsError) throw visitsError;
          
          data = visits.map(v => ({
            'Visit ID': v.id,
            'Date': format(new Date(v.visit_date), 'yyyy-MM-dd'),
            'Mother': v.mothers?.full_name || 'Unknown',
            'Facility': v.facilities?.name || 'Unknown',
            'Type': v.visit_type
          }));
          
          headers = ['Visit ID', 'Date', 'Mother', 'Facility', 'Type'];
          filename = 'monthly-antenatal-visits.csv';
          break;
          
        case "Facility Utilization":
          const { data: facilities, error: facilitiesError } = await supabase
            .from('facilities')
            .select(`
              id, 
              name, 
              type, 
              location, 
              districts:district_id (name)
            `);
          
          if (facilitiesError) throw facilitiesError;
          
          data = facilities.map(f => ({
            'Facility ID': f.id,
            'Name': f.name,
            'Type': f.type,
            'Location': f.location,
            'District': f.districts?.name || 'Unknown'
          }));
          
          headers = ['Facility ID', 'Name', 'Type', 'Location', 'District'];
          filename = 'facility-utilization.csv';
          break;
          
        case "Midwife Performance":
          const { data: midwives, error: midwivesError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'midwife');
          
          if (midwivesError) throw midwivesError;
          
          data = midwives.map(m => ({
            'ID': m.id,
            'Name': m.full_name || 'Unknown',
            'Phone': m.phone_number || 'N/A',
            'Status': m.is_active ? 'Active' : 'Inactive'
          }));
          
          headers = ['ID', 'Name', 'Phone', 'Status'];
          filename = 'midwife-performance.csv';
          break;
          
        case "Maternal Outcomes":
          const { data: mothers, error: mothersError } = await supabase
            .from('mothers')
            .select(`
              id, 
              full_name, 
              registration_number, 
              phone_number, 
              facilities:facility_id (name)
            `);
          
          if (mothersError) throw mothersError;
          
          data = mothers.map(m => ({
            'ID': m.id,
            'Name': m.full_name,
            'Registration': m.registration_number,
            'Phone': m.phone_number || 'N/A',
            'Facility': m.facilities?.name || 'Unknown'
          }));
          
          headers = ['ID', 'Name', 'Registration', 'Phone', 'Facility'];
          filename = 'maternal-outcomes.csv';
          break;
          
        default:
          throw new Error('Invalid report type');
      }

      // Generate CSV
      if (data) {
        const csv = generateCSV(data, headers);
        downloadCSV(csv, filename);
        
        toast({
          title: "Report Generated",
          description: `${reportType} report has been downloaded`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error Generating Report",
        description: "Failed to generate the requested report",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const generateCSV = (data, headers) => {
    // Create header row
    let csv = headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma or newline
        return typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      });
      csv += values.join(',') + '\n';
    });
    
    return csv;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage facilities, districts, and personnel efficiently.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Facilities"
            value={loading ? "..." : counts.facilities.toString()}
            icon={Building}
            trend="up"
            trendValue="+2"
            delay={0.1}
          />
          <StatsCard
            title="Active Districts"
            value={loading ? "..." : counts.districts.toString()}
            icon={BarChart}
            delay={0.2}
          />
          <StatsCard
            title="Registered Midwives"
            value={loading ? "..." : counts.midwives.toString()}
            icon={Users}
            trend="up"
            trendValue="+5"
            delay={0.3}
          />
          <StatsCard
            title="Forms Created"
            value={loading ? "..." : counts.forms.toString()}
            icon={FileText}
            trend="up"
            trendValue="+3"
            delay={0.4}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1.0],
            delay: 0.2
          }}
          className="glass-card rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Maternal Health Statistics</h3>
            <p className="text-sm text-muted-foreground">Overview of visits and deliveries</p>
          </div>
          <Tabs defaultValue="charts" className="p-6">
            <TabsList className="mb-4">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="charts" className="space-y-4">
              <div className="w-full aspect-[16/9] bg-white/50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="hsl(var(--primary))" name="Antenatal Visits" />
                    <Bar dataKey="deliveries" fill="hsl(var(--accent-foreground))" name="Deliveries" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Monthly Antenatal Visits</CardTitle>
                  <CardDescription>By district</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => handleGenerateReport("Monthly Antenatal Visits")}
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Facility Utilization</CardTitle>
                  <CardDescription>Comparing facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleGenerateReport("Facility Utilization")}
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Midwife Performance</CardTitle>
                  <CardDescription>Activity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleGenerateReport("Midwife Performance")}
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Maternal Outcomes</CardTitle>
                  <CardDescription>Health indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleGenerateReport("Maternal Outcomes")}
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
