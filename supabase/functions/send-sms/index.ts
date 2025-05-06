
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SMS_API_KEY = Deno.env.get("MNOTIFY_API_KEY") || "YW11Pz5KghwUIWyaucJfOTBEK";
const SMS_ENDPOINT = "https://api.mnotify.com/api/sms/quick";

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

    console.log(`Sending SMS to ${phoneNumber} for mother ${motherName}`);

    // Format data for the mNotify API
    const data = {
      recipient: [phoneNumber],
      sender: "MOCHCARE",
      message: message,
      is_schedule: "false",
      schedule_date: ""
    };

    // Build the URL with API key
    const url = `${SMS_ENDPOINT}?key=${SMS_API_KEY}`;

    // Make the API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    
    console.log("SMS API response:", JSON.stringify(responseData));

    if (!response.ok) {
      throw new Error(`SMS API error: ${responseData.message || "Unknown error"}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "SMS sent successfully",
        details: responseData
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in send-sms function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while sending SMS" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
