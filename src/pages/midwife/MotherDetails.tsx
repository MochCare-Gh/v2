
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { MidwifeLayout } from "@/components/layouts/MidwifeLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { StatusPill } from "@/components/mothers/StatusPill";
import { Timeline, TimelineEvent } from "@/components/mothers/Timeline";
import {
  FileText,
  Download,
  Send,
  ArrowLeft,
  FileSpreadsheet,
  FileArchive,
  MessageSquare,
  MessageCircle,
  Phone,
  User,
  Calendar,
  Clipboard,
  Activity,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface Mother {
  id: string;
  full_name: string;
  registration_number: string;
  phone_number: string | null;
  ghana_card_number: string | null;
  nhis_number: string | null;
  communication_channel: string | null;
  preferred_language: string | null;
  created_at: string;
  facility: {
    name: string;
  } | null;
}

interface FormEntry {
  id: string;
  form_id: string;
  mother_id: string;
  data: any;
  next_visit_date: string | null;
  created_at: string;
  form: {
    title: string;
  };
}

interface Visit {
  id: string;
  mother_id: string;
  visit_date: string;
  visit_type: string;
  next_visit_date: string | null;
  notes: string | null;
}

interface Delivery {
  id: string;
  mother_id: string;
  delivery_date: string;
  outcome: string;
  notes: string | null;
}

export default function MotherDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mother, setMother] = useState<Mother | null>(null);
  const [formEntries, setFormEntries] = useState<FormEntry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [messageText, setMessageText] = useState("");
  const [messageSending, setMessageSending] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  
  // Analytics counters
  const antenatalVisitsCount = visits.filter(v => v.visit_type.toLowerCase().includes('ante')).length;
  const postnatalVisitsCount = visits.filter(v => v.visit_type.toLowerCase().includes('post')).length;
  const deliveriesCount = deliveries.length;
  
  // Determine mother status
  const determineStatus = () => {
    if (deliveriesCount > 0) {
      return "postnatal";
    } else if (antenatalVisitsCount > 0) {
      return "antenatal";
    }
    return "default";
  };

  useEffect(() => {
    if (id) {
      fetchMotherDetails();
      fetchFormEntries();
      fetchVisits();
      fetchDeliveries();
    }
  }, [id]);

  const fetchMotherDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mothers")
        .select("*, facility:facility_id(name)")
        .eq("id", id)
        .single();

      if (error) throw error;
      setMother(data);
    } catch (error: any) {
      console.error("Error fetching mother details:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFormEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("form_entries")
        .select("*, form:form_id(title)")
        .eq("mother_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFormEntries(data || []);
    } catch (error: any) {
      console.error("Error fetching form entries:", error);
    }
  };

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .eq("mother_id", id)
        .order("visit_date", { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error: any) {
      console.error("Error fetching visits:", error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .eq("mother_id", id)
        .order("delivery_date", { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error: any) {
      console.error("Error fetching deliveries:", error);
    }
  };

  // Create timeline events from all activities
  const createTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Add form entries to timeline
    formEntries.forEach(entry => {
      events.push({
        id: `form-${entry.id}`,
        date: entry.created_at,
        title: `Form Filled: ${entry.form.title}`,
        description: `A ${entry.form.title} form was completed`,
        nextVisitDate: entry.next_visit_date,
        type: "form"
      });
    });

    // Add visits to timeline
    visits.forEach(visit => {
      events.push({
        id: `visit-${visit.id}`,
        date: visit.visit_date,
        title: `${visit.visit_type} Visit`,
        description: visit.notes || `${visit.visit_type} visit recorded`,
        nextVisitDate: visit.next_visit_date,
        type: "visit"
      });
    });

    // Add deliveries to timeline
    deliveries.forEach(delivery => {
      events.push({
        id: `delivery-${delivery.id}`,
        date: delivery.delivery_date,
        title: `Delivery`,
        description: delivery.notes || `Delivery outcome: ${delivery.outcome}`,
        type: "delivery"
      });
    });

    return events;
  };

  const exportToCsv = () => {
    if (!mother) return;

    // Prepare mother data
    const motherData = {
      "Full Name": mother.full_name,
      "Registration Number": mother.registration_number,
      "Phone Number": mother.phone_number || "N/A",
      "Ghana Card Number": mother.ghana_card_number || "N/A",
      "NHIS Number": mother.nhis_number || "N/A",
      "Preferred Language": mother.preferred_language || "N/A",
      "Communication Channel": mother.communication_channel || "N/A",
      "Facility": mother.facility?.name || "N/A",
      "Registration Date": format(new Date(mother.created_at), "yyyy-MM-dd"),
      "Antenatal Visits": antenatalVisitsCount,
      "Postnatal Visits": postnatalVisitsCount,
      "Deliveries": deliveriesCount
    };

    // Format all activities chronologically
    const timelineEvents = createTimelineEvents().sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Convert mother data to CSV
    let csvContent = Object.entries(motherData)
      .map(([key, value]) => `${key},${value}`)
      .join("\n");
    
    // Add a separator
    csvContent += "\n\nTimeline Events\n";
    csvContent += "Date,Type,Title,Description,Next Visit Date\n";
    
    // Add timeline events
    timelineEvents.forEach(event => {
      csvContent += [
        format(new Date(event.date), "yyyy-MM-dd"),
        event.type,
        event.title,
        `"${event.description.replace(/"/g, '""')}"`,
        event.nextVisitDate ? format(new Date(event.nextVisitDate), "yyyy-MM-dd") : "N/A"
      ].join(",") + "\n";
    });

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${mother.full_name.replace(/\s+/g, "_")}_data_${format(new Date(), "yyyy-MM-dd")}.csv`);

    toast({
      title: "Export Successful",
      description: "Mother data has been exported to CSV",
    });
  };

  const exportToPdf = () => {
    // In a real implementation, we would generate a PDF file
    // For this example, we'll just show a toast notification
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here with a PDF generation library",
    });
  };

  const sendMessage = async (type: "whatsapp" | "sms") => {
    if (!mother || !mother.phone_number) {
      toast({
        title: "Error",
        description: "Mother does not have a phone number recorded",
        variant: "destructive",
      });
      return;
    }

    setMessageSending(true);
    const phoneNumber = mother.phone_number.replace(/\D/g, "");
    const message = messageText || `Hello ${mother.full_name}, here is a summary of your visits: [Link to your details page]`;

    try {
      if (type === "whatsapp") {
        // Call the WhatsApp API edge function
        const { error } = await supabase.functions.invoke("send-whatsapp", {
          body: {
            phoneNumber: `+233${phoneNumber}`,
            message,
            motherName: mother.full_name
          },
        });

        if (error) throw error;
      } else {
        // Call the SMS API edge function
        const { error } = await supabase.functions.invoke("send-sms", {
          body: {
            phoneNumber,
            message,
            motherName: mother.full_name
          },
        });

        if (error) throw error;
      }

      toast({
        title: "Message Sent",
        description: `Successfully sent ${type === "whatsapp" ? "WhatsApp" : "SMS"} message`,
      });
      
      setMessageDialogOpen(false);
      setMessageText("");
    } catch (error: any) {
      console.error(`Error sending ${type} message:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to send ${type} message`,
        variant: "destructive",
      });
    } finally {
      setMessageSending(false);
    }
  };

  if (loading) {
    return (
      <MidwifeLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </MidwifeLayout>
    );
  }

  if (!mother) {
    return (
      <MidwifeLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Mother not found</h2>
          <p className="text-muted-foreground mt-2">
            The mother record you're looking for does not exist or has been removed.
          </p>
          <Button 
            className="mt-4"
            onClick={() => navigate("/midwife/mothers")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mothers List
          </Button>
        </div>
      </MidwifeLayout>
    );
  }

  return (
    <MidwifeLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/midwife/mothers")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{mother.full_name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-2 ml-5">
                <Clipboard className="h-4 w-4" /> 
                ID: {mother.registration_number}
                <StatusPill status={determineStatus()} className="ml-2" />
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/midwife/forms?motherId=${mother.id}`)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Fill Form
            </Button>
            
            <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Message to {mother.full_name}</DialogTitle>
                  <DialogDescription>
                    Send a message through the mother's preferred communication channel.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Message</p>
                    <Textarea
                      placeholder={`Hello ${mother.full_name}, here is a summary of your visits: [Link to your details page]`}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                
                <DialogFooter className="flex sm:justify-start">
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => sendMessage("whatsapp")} 
                      disabled={messageSending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send WhatsApp
                    </Button>
                    <Button 
                      onClick={() => sendMessage("sms")} 
                      disabled={messageSending}
                      variant="secondary"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send SMS
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Mother Data</DialogTitle>
                  <DialogDescription>
                    Download data about this mother in different formats.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex justify-center gap-4 py-4">
                  <Button onClick={exportToCsv}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export as CSV
                  </Button>
                  <Button variant="outline" onClick={exportToPdf}>
                    <FileArchive className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Ante-natal Visits"
            value={antenatalVisitsCount}
            icon={Calendar}
            className="shadow-sm"
            delay={0.1}
          />
          <StatsCard
            title="Post-natal Visits"
            value={postnatalVisitsCount}
            icon={Calendar}
            className="shadow-sm"
            delay={0.2}
          />
          <StatsCard
            title="Deliveries"
            value={deliveriesCount}
            icon={Activity}
            className="shadow-sm"
            delay={0.3}
          />
          <StatsCard
            title="Forms Filled"
            value={formEntries.length}
            icon={FileText}
            className="shadow-sm"
            delay={0.4}
          />
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Mother details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Mother's personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                {/* <p className="flex items-center gap-2"> */}
                  {/* <User className="h-4 w-4 text-muted-foreground" /> */}
                  {mother.full_name}
                {/* </p> */}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                {/* <p className="flex items-center gap-2"> */}
                  {/* <Phone className="h-4 w-4 text-muted-foreground" /> */}
                  {mother.phone_number || "Not provided"}
                {/* </p> */}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Facility</p>
                <p>{mother.facility?.name || "Not assigned"}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Communication Channel</p>
                <p>{mother.communication_channel || "Not specified"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Preferred Language</p>
                <p>{mother.preferred_language || "Not specified"}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ghana Card Number</p>
                <p>{mother.ghana_card_number || "Not provided"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">NHIS Number</p>
                <p>{mother.nhis_number || "Not provided"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p>{format(new Date(mother.created_at), "MMMM d, yyyy")}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Right column - Forms and Timeline */}
          <Card className="lg:col-span-2">
            <Tabs defaultValue="forms">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mother Records</CardTitle>
                  <TabsList>
                    <TabsTrigger value="forms">Forms</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>View mother's records and history</CardDescription>
              </CardHeader>
              
              <TabsContent value="forms" className="space-y-4">
                <CardContent>
                  {formEntries.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Form</TableHead>
                            <TableHead>Date Filled</TableHead>
                            <TableHead>Next Visit</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formEntries.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">
                                {entry.form.title}
                              </TableCell>
                              <TableCell>
                                {format(new Date(entry.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                {entry.next_visit_date 
                                  ? format(new Date(entry.next_visit_date), "MMM d, yyyy") 
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/midwife/forms/${entry.form_id}?entry=${entry.id}`)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No forms have been filled for this mother yet.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(`/midwife/forms?motherId=${mother.id}`)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Fill New Form
                      </Button>
                    </div>
                  )}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="timeline">
                <CardContent>
                  <Timeline events={createTimelineEvents()} />
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </MidwifeLayout>
  );
}
