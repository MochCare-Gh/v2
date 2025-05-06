
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MidwifeLayout } from "@/components/layouts/MidwifeLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Phone, FileText, Eye } from "lucide-react";
import { format } from "date-fns";

interface Mother {
  id: string;
  full_name: string;
  registration_number: string;
  phone_number: string | null;
  created_at: string;
  facility: {
    name: string;
  } | null;
}

export default function MidwifeMothers() {
  const [mothers, setMothers] = useState<Mother[]>([]);
  const [filteredMothers, setFilteredMothers] = useState<Mother[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMothers();
  }, []);

  useEffect(() => {
    filterMothers();
  }, [searchQuery, mothers]);

  const fetchMothers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mothers")
        .select("*, facility:facility_id(name)")
        .order("full_name");

      if (error) throw error;
      setMothers(data || []);
      setFilteredMothers(data || []);
    } catch (error: any) {
      console.error("Error fetching mothers:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMothers = () => {
    if (!searchQuery.trim()) {
      setFilteredMothers(mothers);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = mothers.filter(
      (mother) =>
        mother.full_name.toLowerCase().includes(lowerCaseQuery) ||
        mother.registration_number.toLowerCase().includes(lowerCaseQuery) ||
        (mother.phone_number && 
         mother.phone_number.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredMothers(filtered);
  };

  return (
    <MidwifeLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mothers</h1>
            <p className="text-muted-foreground mt-1">
              View and manage mother records
            </p>
          </div>
          <Button 
            onClick={() => navigate("/midwife/mothers/add")}
            className="flex items-center gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            <span>Add Mother</span>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mothers by name, registration number or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mother Records</CardTitle>
            <CardDescription>
              A list of all registered mothers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredMothers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Registration Number</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Registered On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMothers.map((mother) => (
                      <TableRow key={mother.id}>
                        <TableCell className="font-medium">{mother.full_name}</TableCell>
                        <TableCell>{mother.registration_number}</TableCell>
                        <TableCell>
                          {mother.phone_number ? (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{mother.phone_number}</span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{mother.facility?.name || "—"}</TableCell>
                        <TableCell>
                          {format(new Date(mother.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/midwife/mothers/${mother.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/midwife/forms?motherId=${mother.id}`)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Capture Data
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No mothers found matching your search criteria."
                    : "No mothers have been registered yet."}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/midwife/mothers/add")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register a Mother
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MidwifeLayout>
  );
}
