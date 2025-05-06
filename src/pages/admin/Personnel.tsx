
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

type Personnel = {
  id: string;
  full_name: string;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  facility_name: string | null;
};

export default function Personnel() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            phone_number,
            role,
            is_active,
            facilities (
              name
            )
          `)
          .order("full_name");

        if (error) throw error;

        const formattedData = data.map((person) => ({
          id: person.id,
          full_name: person.full_name || "Unknown",
          phone_number: person.phone_number,
          role: person.role,
          is_active: person.is_active ?? true,
          facility_name: person.facilities ? person.facilities.name : null,
        }));

        setPersonnel(formattedData);
      } catch (error: any) {
        console.error("Error fetching personnel:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [toast]);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setPersonnel(
        personnel.map((person) =>
          person.id === id
            ? { ...person, is_active: !currentStatus }
            : person
        )
      );

      toast({
        title: "Success",
        description: `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
        variant: !currentStatus ? "default" : "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Personnel</h1>
            <p className="text-muted-foreground mt-1">
              Manage healthcare workers and administrators
            </p>
          </div>
          <Button onClick={() => navigate("/admin/personnel/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Personnel
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : personnel.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No personnel found. Add a new staff member to get started.
                  </TableCell>
                </TableRow>
              ) : (
                personnel.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.full_name}</TableCell>
                    <TableCell>{person.phone_number || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={person.role === "admin" ? "secondary" : "outline"} className="capitalize">
                        {person.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{person.facility_name || "—"}</TableCell>
                    <TableCell>
                      {person.is_active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <X className="mr-1 h-3 w-3" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(person.id, person.is_active)}
                          title={person.is_active ? "Deactivate" : "Activate"}
                        >
                          {person.is_active ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
