
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare, LayoutGrid, LayoutList } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

type EntryType = {
  id: string;
  motherName: string;
  formName: string;
  nextVisitation: string | null;
  midwife: string | null;
  timestamp: string;
};

export function RecentEntries() {
  const [view, setView] = useState<"table" | "card">("table");
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        setLoading(true);
        
        // Get form entries with mother information
        const { data, error } = await supabase
          .from('form_entries')
          .select(`
            id,
            created_at,
            next_visit_date,
            created_by,
            forms(title),
            mothers(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        // Get midwife names for the entries
        const profileIds = data
          .map(entry => entry.created_by)
          .filter(id => id !== null);
        
        let midwifeNames: Record<string, string> = {};
        
        if (profileIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', profileIds);
          
          if (profilesError) throw profilesError;
          
          midwifeNames = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.full_name;
            return acc;
          }, {} as Record<string, string>);
        }
        
        // Format the data
        const formattedEntries = data.map(entry => ({
          id: entry.id,
          motherName: entry.mothers?.full_name || 'Unknown',
          formName: entry.forms?.title || 'Unknown',
          nextVisitation: entry.next_visit_date,
          midwife: entry.created_by ? midwifeNames[entry.created_by] || 'Unknown' : null,
          timestamp: entry.created_at
        }));
        
        setEntries(formattedEntries);
      } catch (error) {
        console.error("Error fetching recent entries:", error);
        toast({
          title: "Error loading recent entries",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEntries();
  }, [toast]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd hh:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
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
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h3 className="text-lg font-semibold">Recent Entries</h3>
          <p className="text-sm text-muted-foreground">Latest mother records added to the system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("table")}
            className={cn(
              "rounded-full",
              view === "table" && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <LayoutList className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("card")}
            className={cn(
              "rounded-full",
              view === "card" && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-muted-foreground">No recent entries found</p>
        </div>
      ) : view === "table" ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mother Name</TableHead>
                <TableHead>Form Name</TableHead>
                <TableHead>Next Visitation</TableHead>
                <TableHead>Midwife</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.motherName}</TableCell>
                  <TableCell>{entry.formName}</TableCell>
                  <TableCell>{entry.nextVisitation || 'Not scheduled'}</TableCell>
                  <TableCell>{entry.midwife || 'Unknown'}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(entry.timestamp)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/midwife/mothers`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {entries.map((entry) => (
            <Card key={entry.id} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{entry.motherName}</CardTitle>
                <CardDescription>{entry.formName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm pb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Visit:</span>
                  <span>{entry.nextVisitation || 'Not scheduled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Midwife:</span>
                  <span>{entry.midwife || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span>{formatDate(entry.timestamp)}</span>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="ghost" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    SMS
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
