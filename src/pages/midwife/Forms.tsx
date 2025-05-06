
import { useEffect, useState } from "react";
import { MidwifeLayout } from "@/components/layouts/MidwifeLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Form {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  fields: any[];
}

export default function MidwifeForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data, error } = await supabase
          .from("forms")
          .select("*")
          .order("title");

        if (error) throw error;
        
        // Parse JSON fields if it comes as a string
        const parsedData = data?.map(form => ({
          ...form,
          fields: typeof form.fields === 'string' 
            ? JSON.parse(form.fields) 
            : form.fields
        }));
        
        setForms(parsedData as Form[] || []);
      } catch (error: any) {
        console.error("Error fetching forms:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [toast]);

  return (
    <MidwifeLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground mt-1">
            Available forms for data collection
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : forms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10">
                    No forms available.
                  </TableCell>
                </TableRow>
              ) : (
                forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell className="text-left">{Array.isArray(form.fields) ? form.fields.length : 0} fields</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/midwife/forms/${form.id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Fill Form
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MidwifeLayout>
  );
}
