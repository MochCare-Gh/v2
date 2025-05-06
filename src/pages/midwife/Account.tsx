
import { useState, useEffect } from "react";
import { MidwifeLayout } from "@/components/layouts/MidwifeLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
import { Separator } from "@/components/ui/separator";
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

type UserProfile = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  facility_id: string | null;
  facility?: {
    name: string;
  } | null;
  email?: string;
};

const profileFormSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  phoneNumber: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function MidwifeAccount() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*, facility:facility_id(name)")
            .eq("id", authUser.id)
            .single();

          if (profileError) throw profileError;

          setUser({
            ...profile,
            email: authUser.email,
          });

          // Set form default values
          profileForm.reset({
            fullName: profile.full_name || "",
            phoneNumber: profile.phone_number || "",
          });

          if (profile.facility_id) {
            const { data: facilityData, error: facilityError } = await supabase
              .from("facilities")
              .select("*")
              .eq("id", profile.facility_id)
              .single();

            if (facilityError) throw facilityError;
            setFacility(facilityData);
          }
        }
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

    fetchUserProfile();
  }, [toast]);

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;
    
    setSavingProfile(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          phone_number: values.phoneNumber,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      setUser({
        ...user,
        full_name: values.fullName,
        phone_number: values.phoneNumber,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    setSavingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: values.newPassword 
      });

      if (error) throw error;

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <MidwifeLayout>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </MidwifeLayout>
    );
  }

  return (
    <MidwifeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information and settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted max-w-md w-full"
              />
              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed
              </p>
            </div>

            {facility && (
              <div className="space-y-1">
                <Label>Assigned Facility</Label>
                <Input
                  value={facility.name}
                  disabled
                  className="bg-muted max-w-md"
                />
                <p className="text-xs text-muted-foreground">
                  Your facility assignment is managed by administrators
                </p>
              </div>
            )}

            <Separator className="my-4" />

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
                          className="max-w-md"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+233 XX XXX XXXX" 
                          className="max-w-md"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Your contact phone number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="••••••••" 
                          className="max-w-md"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="••••••••" 
                          className="max-w-md"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="••••••••" 
                          className="max-w-md"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MidwifeLayout>
  );
}
