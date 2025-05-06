
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  fields: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1, "Label is required"),
      type: z.string(),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

type FieldType = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

export default function CreateForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fields, setFields] = useState<FieldType[]>([]);
  const [currentField, setCurrentField] = useState<FieldType>({
    id: "",
    label: "",
    type: "text",
    required: false,
  });
  const [optionInput, setOptionInput] = useState("");
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      fields: [],
    },
  });

  const addField = () => {
    if (!currentField.label) {
      toast({
        title: "Field label required",
        description: "Please provide a label for the field",
        variant: "destructive",
      });
      return;
    }

    const newField = {
      ...currentField,
      id: `field_${Date.now()}`,
      options: currentField.type === "select" || currentField.type === "radio" ? [...currentOptions] : undefined,
    };

    setFields([...fields, newField]);
    form.setValue("fields", [...fields, newField]);

    // Reset field inputs
    setCurrentField({
      id: "",
      label: "",
      type: "text",
      required: false,
    });
    setCurrentOptions([]);
  };

  const addOption = () => {
    if (!optionInput) return;
    setCurrentOptions([...currentOptions, optionInput]);
    setOptionInput("");
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...currentOptions];
    updatedOptions.splice(index, 1);
    setCurrentOptions(updatedOptions);
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    form.setValue("fields", updatedFields);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Always add a hidden mother_id field that will be autofilled
      const formFields = [
        ...data.fields,
        {
          id: "mother_id",
          label: "Mother ID",
          type: "hidden",
          required: true,
        }
      ];

      const { error } = await supabase
        .from("forms")
        .insert({
          title: data.title,
          slug: data.slug,
          fields: formFields,
          created_by: (await supabase.auth.getSession()).data.session?.user?.id,
        });

      if (error) throw error;

      toast({
        title: "Form created",
        description: "The form has been created successfully",
      });

      navigate("/admin/forms");
    } catch (error: any) {
      console.error("Error creating form:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    if (!title) return;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    form.setValue("slug", slug);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create Form</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter form title" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          onBlur={() => {
                            field.onBlur();
                            if (!form.getValues("slug")) {
                              generateSlug();
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        The title of the form to be displayed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter form slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        A URL-friendly identifier for the form. Only lowercase letters, numbers, and hyphens.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 border p-4 rounded-md">
                  <FormLabel>Add New Field</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Field Label</FormLabel>
                      <Input
                        placeholder="Enter field label"
                        value={currentField.label}
                        onChange={(e) =>
                          setCurrentField({ ...currentField, label: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <FormLabel>Field Type</FormLabel>
                      <Select
                        value={currentField.type}
                        onValueChange={(value) =>
                          setCurrentField({ ...currentField, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="select">Dropdown</SelectItem>
                          <SelectItem value="radio">Radio Buttons</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={currentField.required}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          required: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <FormLabel htmlFor="required" className="cursor-pointer">
                      Required Field
                    </FormLabel>
                  </div>

                  {(currentField.type === "select" || currentField.type === "radio") && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Options</h4>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add option"
                          value={optionInput}
                          onChange={(e) => setOptionInput(e.target.value)}
                        />
                        <Button type="button" onClick={addOption} size="sm">
                          Add
                        </Button>
                      </div>
                      {currentOptions.length > 0 && (
                        <div className="space-y-2">
                          {currentOptions.map((option, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span>{option}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="button" onClick={addField} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                {fields.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-4">Form Fields</h4>
                    <div className="space-y-4">
                      {fields.map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between bg-muted p-3 rounded"
                        >
                          <div>
                            <span className="font-medium">{field.label}</span>
                            <div className="text-sm text-muted-foreground mt-1">
                              Type: {field.type}{" "}
                              {field.required && (
                                <span className="text-destructive">*Required</span>
                              )}
                            </div>
                            {field.options && field.options.length > 0 && (
                              <div className="text-sm mt-1">
                                Options: {field.options.join(", ")}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/forms")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Form</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
