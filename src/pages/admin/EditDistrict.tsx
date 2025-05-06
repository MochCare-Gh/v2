
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

// Define the GhanaRegion type to match the enum in the database
type GhanaRegion = 
  | "Ahafo"
  | "Ashanti"
  | "Bono"
  | "Bono East"
  | "Central"
  | "Eastern"
  | "Greater Accra"
  | "North East"
  | "Northern"
  | "Oti"
  | "Savannah"
  | "Upper East"
  | "Upper West"
  | "Volta"
  | "Western"
  | "Western North";

// The ghana regions from the database enum
const ghanaRegions: GhanaRegion[] = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
];

export default function EditDistrict() {
  const [name, setName] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [region, setRegion] = useState<GhanaRegion | "">("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    const fetchDistrict = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from("districts")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;

          if (data) {
            setName(data.name);
            setDistrictCode(data.district_code);
            setRegion(data.region as GhanaRegion);
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setFetchLoading(false);
        }
      }
    };

    fetchDistrict();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!region) {
      toast({
        title: "Error",
        description: "Please select a region",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from("districts")
        .update({
          name,
          district_code: districtCode,
          region,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "District updated successfully",
      });
      navigate("/admin/districts");
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/districts")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Edit District</h1>
            <p className="text-muted-foreground mt-1">
              Update district information
            </p>
          </div>
        </div>

        {fetchLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <Card className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>District Information</CardTitle>
                <CardDescription>
                  Edit the details for this district
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">District Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district-code">District Code</Label>
                  <Input
                    id="district-code"
                    value={districtCode}
                    onChange={(e) => setDistrictCode(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={region}
                    onValueChange={(value) => setRegion(value as GhanaRegion)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {ghanaRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/districts")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update District"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
