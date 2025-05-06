
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { phoneNumber, message, motherName } = await req.json();

    if (!phoneNumber || !message) {
      return new Response(
        JSON.stringify({ error: "Phone number and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending WhatsApp message to ${phoneNumber} for mother ${motherName}`);

    // Here we would integrate with the WhatsApp API
    // For demonstration, we'll just log the message and simulate success

    // For real implementation, you would use the official WhatsApp Business API
    // or a service like Twilio/MessageBird that provides WhatsApp integration

    const response = {
      success: true,
      message: `WhatsApp message would be sent to ${phoneNumber}`,
      details: {
        recipient: phoneNumber,
        content: message,
        timestamp: new Date().toISOString(),
      }
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in send-whatsapp function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while sending WhatsApp message" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
