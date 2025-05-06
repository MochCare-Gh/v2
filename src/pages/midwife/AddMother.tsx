
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MidwifeLayout } from "@/components/layouts/MidwifeLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

interface Facility {
  id: string;
  name: string;
  facility_code: string;
  district_id: string;
}

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  registration_number: z.string().min(2, "Registration number is required"),
  phone_number: z.string().optional(),
  ghana_card_number: z.string().optional(),
  nhis_number: z.string().optional(),
  preferred_language: z.string().optional(),
  communication_channel: z.string().optional(),
  facility_id: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddMother() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      registration_number: "",
      phone_number: "",
      ghana_card_number: "",
      nhis_number: "",
      preferred_language: "",
      communication_channel: "",
      facility_id: "",
    },
  });

  useEffect(() => {
    fetchFacilities();
    generateRegistrationNumber();
  }, []);

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name, facility_code, district_id")
        .order("name");

      if (error) throw error;
      setFacilities(data || []);
      
      // If facilities exist, set the first one as default
      if (data && data.length > 0) {
        form.setValue("facility_id", data[0].id);
      }
    } catch (error: any) {
      console.error("Error fetching facilities:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateRegistrationNumber = () => {
    // Generate a registration number format: MCH-YYYY-XXXXX
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    const regNumber = `MCH-${year}-${random}`;
    form.setValue("registration_number", regNumber);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      
      // Get current user ID for registered_by field
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      // Make sure all required fields are present
      const motherData = {
        full_name: data.full_name,
        registration_number: data.registration_number,
        facility_id: data.facility_id,
        phone_number: data.phone_number || null,
        ghana_card_number: data.ghana_card_number || null,
        nhis_number: data.nhis_number || null,
        preferred_language: data.preferred_language || null,
        communication_channel: data.communication_channel || null,
        registered_by: userId || null
      };

      const { error } = await supabase
        .from("mothers")
        .insert(motherData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mother has been registered successfully",
      });

      navigate("/midwife/mothers");
    } catch (error: any) {
      console.error("Error adding mother:", error);
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
    <MidwifeLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/midwife/mothers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Register New Mother</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mother Information</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registration_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormDescription>
                        Automatically generated
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facility_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a facility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility.id} value={facility.id}>
                              {facility.name}
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
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ghana_card_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghana Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Ghana Card number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nhis_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NHIS Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter NHIS number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferred_language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Twi">Twi</SelectItem>
                          <SelectItem value="Ga">Ga</SelectItem>
                          <SelectItem value="Ewe">Ewe</SelectItem>
                          <SelectItem value="Dagbani">Dagbani</SelectItem>
                          <SelectItem value="Hausa">Hausa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communication_channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Communication Channel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select communication channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Voice Call">Voice Call</SelectItem>
                          <SelectItem value="In Person">In Person</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/midwife/mothers")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-white"></div>
                      Saving...
                    </>
                  ) : (
                    "Register Mother"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MidwifeLayout>
  );
}
