
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, ShieldCheck } from "lucide-react";

// Static roles data since this is just a UI representation
const roles = [
  {
    id: 1, 
    name: "Administrator",
    description: "Full access to all system functions",
    users: 2,
    permissions: "All permissions"
  },
  {
    id: 2, 
    name: "Midwife",
    description: "Can manage mothers, visits, and deliveries",
    users: 15,
    permissions: "Limited to mother data and forms"
  },
  {
    id: 3, 
    name: "Supervisor",
    description: "Can view reports and manage midwives",
    users: 5,
    permissions: "Reporting and midwife management"
  }
];

export default function RolesIndex() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Role</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.users}</TableCell>
                    <TableCell>{role.permissions}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/40 rounded-lg p-4 border border-muted">
        <h3 className="font-medium mb-2">About System Roles</h3>
        <p className="text-sm text-muted-foreground">
          Roles determine what users can access in the system. Each role has a specific set of permissions
          that control which features users can see and use. Assign users to roles based on their job responsibilities.
        </p>
      </div>
    </div>
  );
}
