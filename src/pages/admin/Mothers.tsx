
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";

type Mother = {
  id: string;
  full_name: string;
  registration_number: string;
  phone_number: string | null;
  ghana_card_number: string | null;
  nhis_number: string | null;
  preferred_language: string | null;
  communication_channel: string | null;
  created_at: string;
  facility: {
    name: string;
  } | null;
};

export default function Mothers() {
  const [mothers, setMothers] = useState<Mother[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMothers = async () => {
      try {
        const { data, error } = await supabase
          .from("mothers")
          .select("*, facility:facility_id(name)")
          .order("full_name");

        if (error) throw error;
        setMothers(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMothers();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mothers</h1>
          <p className="text-muted-foreground mt-1">
            View all registered mothers in the system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Mothers</CardTitle>
            <CardDescription>
              A comprehensive list of all mothers in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : mothers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Registration Number</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Registered On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mothers.map((mother) => (
                      <TableRow key={mother.id}>
                        <TableCell className="font-medium">{mother.full_name}</TableCell>
                        <TableCell>{mother.registration_number}</TableCell>
                        <TableCell>{mother.phone_number || "—"}</TableCell>
                        <TableCell>{mother.facility?.name || "—"}</TableCell>
                        <TableCell>{format(new Date(mother.created_at), "MMM d, yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No mothers found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
