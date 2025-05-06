
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, MoreHorizontal, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserRole = "admin" | "midwife" | "supervisor";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

type ProfileData = {
  id: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  facility_id: string | null;
  phone_number: string | null;
  photo_url: string | null;
  updated_at: string;
};

export default function UsersIndex() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
        
      if (profilesError) throw profilesError;
      
      // Type-safe assertion
      const typedProfiles = profiles as ProfileData[] | null;
      
      if (!typedProfiles || typedProfiles.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Fetch auth users (just for emails)
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
        // Create combined users with mock emails if auth fetch fails
        const combinedUsers = typedProfiles.map(profile => ({
          ...profile,
          email: `user-${profile.id.substring(0, 8)}@example.com`,
        })) as User[];
        
        setUsers(combinedUsers);
      } else if (authData?.users && Array.isArray(authData.users)) { // Check if authData and authData.users exist and is an array
        // Create combined users with real emails
        const combinedUsers = typedProfiles.map(profile => {
          const authUser = authData.users.find(u => u.id === profile.id);
          return {
            ...profile,
            email: authUser?.email || `user-${profile.id.substring(0, 8)}@example.com`,
          };
        }) as User[];
        
        setUsers(combinedUsers);
      } else {
        // Handle case where authData or authData.users is undefined or not an array
        const combinedUsers = typedProfiles.map(profile => ({
          ...profile,
          email: `user-${profile.id.substring(0, 8)}@example.com`,
        })) as User[];
        
        setUsers(combinedUsers);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
      
      // Provide dummy data for demonstration
      setUsers([
        {
          id: "1",
          email: "admin@mochcare.com",
          full_name: "System Administrator",
          role: "admin",
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          email: "midwife@mochcare.com",
          full_name: "Jane Midwife",
          role: "midwife",
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, is_active: !currentStatus }
            : user
        )
      );

      toast({
        title: "User updated",
        description: `User has been ${
          !currentStatus ? "activated" : "deactivated"
        }`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="midwife">Midwife</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || "—"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin"
                                ? "default"
                                : user.role === "midwife"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_active ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                              <X className="h-3.5 w-3.5 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Reset Password</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                              >
                                {user.is_active ? "Deactivate User" : "Activate User"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
