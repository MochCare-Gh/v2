
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

type Facility = {
  id: string;
  name: string;
};

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),
  phoneNumber: z.string().optional(),
  role: z.enum(["admin", "midwife"]),
  facilityId: z.string().optional(),
});

export default function CreatePersonnel() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFacilities, setFetchingFacilities] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      role: "midwife",
      facilityId: undefined,
    },
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { data, error } = await supabase
          .from("facilities")
          .select("id, name")
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
        setFetchingFacilities(false);
      }
    };

    fetchFacilities();
  }, [toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // Create the profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        full_name: values.fullName,
        phone_number: values.phoneNumber,
        role: values.role,
        facility_id: values.facilityId || null,
      });

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Personnel created successfully",
      });
      navigate("/admin/personnel");
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
            onClick={() => navigate("/admin/personnel")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create Personnel</h1>
            <p className="text-muted-foreground mt-1">
              Add a new staff member to the system
            </p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Personnel Information</CardTitle>
                <CardDescription>
                  Enter the details for the new staff member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The email will be used for login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Must be at least 6 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+233 XX XXX XXXX" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="midwife">Midwife</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facilityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility (Optional)</FormLabel>
                      {fetchingFacilities ? (
                        <div className="flex items-center py-2">
                          <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-primary rounded-full" />
                          <span>Loading facilities...</span>
                        </div>
                      ) : (
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
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
                      )}
                      <FormDescription>
                        Assign the staff member to a facility
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/personnel")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || fetchingFacilities}>
                  {loading ? "Creating..." : "Create Personnel"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
}
