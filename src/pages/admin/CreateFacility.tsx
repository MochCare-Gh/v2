
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FacilityType, facilityTypes } from "@/types/facility";

type District = {
  id: string;
  name: string;
};

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  facilityCode: z.string().min(3, { message: "Facility code must be at least 3 characters" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  type: z.enum(["Hospital", "Clinic", "Health Center", "CHPS Compound", "Maternity Home"] as const),
  districtId: z.string().uuid({ message: "Please select a district" }),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export default function CreateFacility() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDistricts, setFetchingDistricts] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      facilityCode: "",
      location: "",
      type: "Hospital",
      districtId: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const { data, error } = await supabase
          .from("districts")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setDistricts(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setFetchingDistricts(false);
      }
    };

    fetchDistricts();
  }, [toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const { error } = await supabase.from("facilities").insert({
        name: values.name,
        facility_code: values.facilityCode,
        location: values.location,
        type: values.type,
        district_id: values.districtId,
        latitude: values.latitude ? parseFloat(values.latitude) : null,
        longitude: values.longitude ? parseFloat(values.longitude) : null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Facility created successfully",
      });
      navigate("/admin/facilities");
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
            onClick={() => navigate("/admin/facilities")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create Facility</h1>
            <p className="text-muted-foreground mt-1">
              Add a new facility to the system
            </p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Facility Information</CardTitle>
                <CardDescription>
                  Enter the details for the new facility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Facility name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facilityCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., FAC-001" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., North District Area" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select facility type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {facilityTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="districtId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      {fetchingDistricts ? (
                        <div className="flex items-center py-2">
                          <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-primary rounded-full" />
                          <span>Loading districts...</span>
                        </div>
                      ) : (
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district.id} value={district.id}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 5.6037"
                            type="number"
                            step="0.000001"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., -0.1870"
                            type="number"
                            step="0.000001"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/facilities")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || fetchingDistricts}>
                  {loading ? "Creating..." : "Create Facility"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
}
