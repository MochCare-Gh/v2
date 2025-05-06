
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, MapPin } from "lucide-react";
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

type Facility = {
  id: string;
  name: string;
  facility_code: string;
  type: string;
  location: string;
  district: {
    name: string;
  };
};

export default function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { data, error } = await supabase
          .from("facilities")
          .select("*, district:district_id(name)")
          .order("name");

        if (error) throw error;
        setFacilities(data || []);
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

    fetchFacilities();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Facilities</h1>
            <p className="text-muted-foreground mt-1">
              Manage healthcare facilities in the system
            </p>
          </div>
          <div className="flex gap-3">
            {/* <Button 
              variant="outline"
              onClick={() => navigate("/admin/facilities/map")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              View Map
            </Button> */}
            <Button onClick={() => navigate("/admin/facilities/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Facility
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
            <CardDescription>
              A list of all healthcare facilities in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : facilities.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Facility Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>{facility.facility_code}</TableCell>
                      <TableCell>{facility.type}</TableCell>
                      <TableCell>{facility.location}</TableCell>
                      <TableCell>{facility.district?.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/admin/facilities/edit/${facility.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // Delete functionality would go here
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No facilities found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/admin/facilities/create")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Facility
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
