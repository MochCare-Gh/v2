import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MidwifeLayout } from "@/components/layouts/MidwifeLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  id: string;
  title: string;
  slug: string;
  fields: FormField[];
}

interface Mother {
  id: string;
  full_name: string;
  registration_number: string;
}

export default function FillForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [mothers, setMothers] = useState<Mother[]>([]);
  const [filteredMothers, setFilteredMothers] = useState<Mother[]>([]);
  const [selectedMother, setSelectedMother] = useState<string>("");
  const [nextVisitDate, setNextVisitDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchFormData();
    fetchMothers();
  }, [id]);

  useEffect(() => {
    setFilteredMothers(
      mothers.filter((mother) =>
        mother.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, mothers]);

  const fetchFormData = async () => {
    try {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      // Parse fields if it's a string
      const parsedData = {
        ...data,
        fields: typeof data.fields === 'string' ? JSON.parse(data.fields) : data.fields
      };
      
      setFormData(parsedData);
    } catch (error: any) {
      console.error("Error fetching form:", error);
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMothers = async () => {
    try {
      const { data, error } = await supabase
        .from("mothers")
        .select("id, full_name, registration_number")
        .order("full_name");
      
      if (error) throw error;
      
      setMothers(data || []);
      setFilteredMothers(data || []);
    } catch (error: any) {
      console.error("Error fetching mothers:", error);
      toast({
        title: "Error",
        description: "Failed to load mothers data",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues({
      ...formValues,
      [fieldId]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!selectedMother) {
        toast({
          title: "Missing information",
          description: "Please select a mother",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData) return;
      
      // Add mother_id to form values
      const completeFormValues = {
        ...formValues,
        mother_id: selectedMother,
      };
      
      // Get current user ID
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      const { error } = await supabase
        .from("form_entries")
        .insert({
          form_id: formData.id,
          mother_id: selectedMother, 
          data: completeFormValues,
          created_by: userId,
          next_visit_date: nextVisitDate || null,
        });
      
      if (error) throw error;
      
      toast({
        title: "Form submitted",
        description: "Form has been successfully submitted",
      });
      
      navigate("/midwife/forms");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderField = (field: FormField) => {
    if (field.type === "hidden") return null;
    
    switch (field.type) {
      case "text":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="text"
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );
        
      case "textarea":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );
        
      case "number":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
              required={field.required}
            />
          </div>
        );
        
      case "date":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={field.id}
                type="date"
                value={formValues[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        );
        
      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={field.id}>
            <Checkbox
              id={field.id}
              checked={formValues[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field.id, Boolean(checked))}
            />
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
          </div>
        );
        
      case "select":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select
              value={formValues[field.id] || ""}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case "radio":
        return (
          <div className="space-y-2" key={field.id}>
            <Label>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup
              value={formValues[field.id] || ""}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
              {field.options?.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <MidwifeLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </MidwifeLayout>
    );
  }
  
  if (!formData) {
    return (
      <MidwifeLayout>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">Form not found</h2>
          <p className="text-muted-foreground mt-2">The requested form could not be found.</p>
          <Button 
            onClick={() => navigate("/midwife/forms")} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Button>
        </div>
      </MidwifeLayout>
    );
  }

  return (
    <MidwifeLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/midwife/forms")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{formData.title}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fill Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="mother-select">
                  Select Mother <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Search mothers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                  value={selectedMother}
                  onValueChange={setSelectedMother}
                >
                  <SelectTrigger id="mother-select">
                    <SelectValue placeholder="Select a mother" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMothers.map((mother) => (
                      <SelectItem key={mother.id} value={mother.id}>
                        {mother.full_name} ({mother.registration_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.fields && formData.fields.map((field) => (
                renderField(field)
              ))}

              <div className="space-y-2">
                <Label htmlFor="next-visit-date">Next Visit Date</Label>
                <div className="relative">
                  <Input
                    id="next-visit-date"
                    type="date"
                    value={nextVisitDate}
                    onChange={(e) => setNextVisitDate(e.target.value)}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/midwife/forms")}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Form</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MidwifeLayout>
  );
}
