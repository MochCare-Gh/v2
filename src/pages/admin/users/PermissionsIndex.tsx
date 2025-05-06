
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Define structured permission data
const permissions = [
  { module: "Mothers", action: "View", admin: true, midwife: true, supervisor: true },
  { module: "Mothers", action: "Create", admin: true, midwife: true, supervisor: false },
  { module: "Mothers", action: "Edit", admin: true, midwife: true, supervisor: false },
  { module: "Mothers", action: "Delete", admin: true, midwife: false, supervisor: false },
  
  { module: "Visits", action: "View", admin: true, midwife: true, supervisor: true },
  { module: "Visits", action: "Create", admin: true, midwife: true, supervisor: false },
  { module: "Visits", action: "Edit", admin: true, midwife: true, supervisor: false },
  { module: "Visits", action: "Delete", admin: true, midwife: false, supervisor: false },
  
  { module: "Facilities", action: "View", admin: true, midwife: true, supervisor: true },
  { module: "Facilities", action: "Create", admin: true, midwife: false, supervisor: false },
  { module: "Facilities", action: "Edit", admin: true, midwife: false, supervisor: false },
  { module: "Facilities", action: "Delete", admin: true, midwife: false, supervisor: false },
  
  { module: "Users", action: "View", admin: true, midwife: false, supervisor: true },
  { module: "Users", action: "Create", admin: true, midwife: false, supervisor: false },
  { module: "Users", action: "Edit", admin: true, midwife: false, supervisor: false },
  { module: "Users", action: "Delete", admin: true, midwife: false, supervisor: false },

  { module: "Reports", action: "View", admin: true, midwife: false, supervisor: true },
  { module: "Reports", action: "Export", admin: true, midwife: false, supervisor: true }
];

// Get unique modules for filtering
const modules = [...new Set(permissions.map(p => p.module))];

export default function PermissionsIndex() {
  const [selectedModule, setSelectedModule] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredPermissions = permissions.filter(permission => {
    if (selectedModule && permission.module !== selectedModule) return false;
    if (searchQuery && !permission.module.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !permission.action.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCheckboxChange = (role: string, module: string, action: string, currentValue: boolean) => {
    // This would update the state in a real application
    console.log(`Changed ${role} permission for ${module} - ${action} to ${!currentValue}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search permissions..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedModule || ""} onValueChange={(value) => setSelectedModule(value || null)}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Modules</SelectItem>
            {modules.map(module => (
              <SelectItem key={module} value={module}>{module}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-center">Administrator</TableHead>
                  <TableHead className="text-center">Midwife</TableHead>
                  <TableHead className="text-center">Supervisor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission, index) => (
                  <TableRow key={`${permission.module}-${permission.action}-${index}`}>
                    <TableCell className="font-medium">{permission.module}</TableCell>
                    <TableCell>{permission.action}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={permission.admin}
                        onCheckedChange={() => handleCheckboxChange('admin', permission.module, permission.action, permission.admin)}
                        id={`admin-${permission.module}-${permission.action}-${index}`}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={permission.midwife}
                        onCheckedChange={() => handleCheckboxChange('midwife', permission.module, permission.action, permission.midwife)}
                        id={`midwife-${permission.module}-${permission.action}-${index}`}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={permission.supervisor}
                        onCheckedChange={() => handleCheckboxChange('supervisor', permission.module, permission.action, permission.supervisor)}
                        id={`supervisor-${permission.module}-${permission.action}-${index}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/40 rounded-lg p-4 border border-muted">
        <h3 className="font-medium mb-2">About Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Permissions determine what actions users with specific roles can perform. 
          Changes made here will affect all users with the corresponding role. 
          Use caution when modifying administrative permissions.
        </p>
      </div>
    </div>
  );
}
