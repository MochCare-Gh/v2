
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyIcon, Code, PlusCircle, ChevronRight, Book, FileJson, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ApiDocumentation() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Code snippet copied to clipboard",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <Button className="flex items-center gap-2">
          <Book className="h-4 w-4" />
          <span>API Changelog</span>
        </Button>
      </div>

      <div className="bg-muted/40 p-4 rounded-lg border">
        <div className="flex gap-4 items-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium">Getting Started with the API</h2>
            <p className="text-muted-foreground">
              Our RESTful API enables programmatic access to the Maternal Health Tracking System.
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Generate API Key</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="introduction">
        <div className="flex border-b">
          <TabsList className="mx-auto bg-transparent">
            <TabsTrigger value="introduction">Introduction</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="errors">Error Handling</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="introduction" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
              <CardDescription>
                Overview of the Maternal Health Tracking System API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Base URL</h3>
                <div className="flex items-center rounded-md border bg-muted/50 p-3">
                  <code className="flex-1 font-mono text-sm">https://api.maternalhealthsystem.org/v1</code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard("https://api.maternalhealthsystem.org/v1")}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">API Versioning</h3>
                <p className="text-muted-foreground">
                  The API version is included in the URL path. Current version is <Badge>v1</Badge>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Format</h3>
                <p className="text-muted-foreground mb-2">
                  All requests and responses use JSON format. Make sure to include the header:
                </p>
                <div className="flex items-center rounded-md border bg-muted/50 p-3">
                  <code className="flex-1 font-mono text-sm">Content-Type: application/json</code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard("Content-Type: application/json")}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Rate Limits</h3>
                <p className="text-muted-foreground">
                  The API is rate-limited to 60 requests per minute. If you exceed this limit, 
                  you'll receive a 429 Too Many Requests response.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                How to authenticate with the API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">API Key Authentication</h3>
                <p className="text-muted-foreground mb-2">
                  All API requests require an API key for authentication. You can include your API key in the request header:
                </p>
                <div className="flex items-center rounded-md border bg-muted/50 p-3">
                  <code className="flex-1 font-mono text-sm">Authorization: Bearer YOUR_API_KEY</code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Example Request</h3>
                <p className="text-muted-foreground mb-2">
                  Here's an example of how to authenticate your request using curl:
                </p>
                <div className="flex flex-col rounded-md border bg-muted/50 p-3 overflow-x-auto">
                  <code className="font-mono text-sm whitespace-pre">
{`curl -X GET "https://api.maternalhealthsystem.org/v1/mothers" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json"`}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="self-end mt-2"
                    onClick={() => copyToClipboard(`curl -X GET "https://api.maternalhealthsystem.org/v1/mothers" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json"`)}
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    <span>Copy</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <div className="flex-shrink-0 mt-1">⚠️</div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Security Note</h3>
                  <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>Keep your API keys secure and never share them in client-side code. 
                    If a key is compromised, regenerate it immediately from your dashboard.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Available API endpoints and their descriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Mothers</h3>
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="flex items-center p-3 bg-muted/30">
                      <Badge className="bg-green-500 mr-2">GET</Badge>
                      <code className="font-mono text-sm">/mothers</code>
                      <div className="ml-auto text-sm text-muted-foreground">List mothers</div>
                    </div>
                    <Separator />
                    <div className="p-3 text-sm text-muted-foreground">
                      Returns a paginated list of all mothers in the system.
                    </div>
                    <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-primary hover:bg-muted/30">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="flex items-center p-3 bg-muted/30">
                      <Badge className="bg-green-500 mr-2">GET</Badge>
                      <code className="font-mono text-sm">/mothers/{"{id}"}</code>
                      <div className="ml-auto text-sm text-muted-foreground">Get mother</div>
                    </div>
                    <Separator />
                    <div className="p-3 text-sm text-muted-foreground">
                      Returns detailed information about a specific mother.
                    </div>
                    <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-primary hover:bg-muted/30">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="flex items-center p-3 bg-muted/30">
                      <Badge className="bg-blue-500 mr-2">POST</Badge>
                      <code className="font-mono text-sm">/mothers</code>
                      <div className="ml-auto text-sm text-muted-foreground">Create mother</div>
                    </div>
                    <Separator />
                    <div className="p-3 text-sm text-muted-foreground">
                      Creates a new mother record in the system.
                    </div>
                    <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-primary hover:bg-muted/30">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Visits</h3>
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="flex items-center p-3 bg-muted/30">
                      <Badge className="bg-green-500 mr-2">GET</Badge>
                      <code className="font-mono text-sm">/visits</code>
                      <div className="ml-auto text-sm text-muted-foreground">List visits</div>
                    </div>
                    <Separator />
                    <div className="p-3 text-sm text-muted-foreground">
                      Returns a paginated list of all visits.
                    </div>
                    <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-primary hover:bg-muted/30">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="flex items-center p-3 bg-muted/30">
                      <Badge className="bg-blue-500 mr-2">POST</Badge>
                      <code className="font-mono text-sm">/visits</code>
                      <div className="ml-auto text-sm text-muted-foreground">Create visit</div>
                    </div>
                    <Separator />
                    <div className="p-3 text-sm text-muted-foreground">
                      Records a new visit for a mother.
                    </div>
                    <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-primary hover:bg-muted/30">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Sample code for common API operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript">
                <TabsList className="mb-4">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      <span>Fetch Mothers</span>
                    </h3>
                    <div className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                      <code className="font-mono text-sm whitespace-pre">
{`// Fetch a list of mothers using fetch API
const API_KEY = "YOUR_API_KEY";
const API_URL = "https://api.maternalhealthsystem.org/v1";

async function fetchMothers() {
  try {
    const response = await fetch(\`\${API_URL}/mothers\`, {
      method: "GET",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching mothers:", error);
  }
}`}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="self-end mt-2"
                        onClick={() => copyToClipboard(`// Fetch a list of mothers using fetch API
const API_KEY = "YOUR_API_KEY";
const API_URL = "https://api.maternalhealthsystem.org/v1";

async function fetchMothers() {
  try {
    const response = await fetch(\`\${API_URL}/mothers\`, {
      method: "GET",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching mothers:", error);
  }
}`)}
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        <span>Copy</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      <span>Create a Visit</span>
                    </h3>
                    <div className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                      <code className="font-mono text-sm whitespace-pre">
{`// Create a new visit record
async function createVisit(motherData) {
  try {
    const response = await fetch(\`\${API_URL}/visits\`, {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mother_id: "uuid-of-mother",
        facility_id: "uuid-of-facility",
        visit_date: "2023-06-15T10:30:00Z",
        visit_type: "Antenatal",
        notes: "Regular checkup, all vitals normal"
      })
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log("Visit created:", data);
    return data;
  } catch (error) {
    console.error("Error creating visit:", error);
  }
}`}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="self-end mt-2"
                        onClick={() => copyToClipboard(`// Create a new visit record
async function createVisit(motherData) {
  try {
    const response = await fetch(\`\${API_URL}/visits\`, {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mother_id: "uuid-of-mother",
        facility_id: "uuid-of-facility",
        visit_date: "2023-06-15T10:30:00Z",
        visit_type: "Antenatal",
        notes: "Regular checkup, all vitals normal"
      })
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log("Visit created:", data);
    return data;
  } catch (error) {
    console.error("Error creating visit:", error);
  }
}`)}
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        <span>Copy</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="python" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      <span>Fetch Mothers</span>
                    </h3>
                    <div className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                      <code className="font-mono text-sm whitespace-pre">
{`import requests

API_KEY = "YOUR_API_KEY"
API_URL = "https://api.maternalhealthsystem.org/v1"

def fetch_mothers():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{API_URL}/mothers", headers=headers)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        
        data = response.json()
        print(data)
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching mothers: {e}")
        return None

if __name__ == "__main__":
    mothers = fetch_mothers()`}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="self-end mt-2"
                        onClick={() => copyToClipboard(`import requests

API_KEY = "YOUR_API_KEY"
API_URL = "https://api.maternalhealthsystem.org/v1"

def fetch_mothers():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{API_URL}/mothers", headers=headers)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        
        data = response.json()
        print(data)
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching mothers: {e}")
        return None

if __name__ == "__main__":
    mothers = fetch_mothers()`)}
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        <span>Copy</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="curl" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      <span>Fetch Mothers</span>
                    </h3>
                    <div className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                      <code className="font-mono text-sm whitespace-pre">
{`curl -X GET "https://api.maternalhealthsystem.org/v1/mothers" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json"`}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="self-end mt-2"
                        onClick={() => copyToClipboard(`curl -X GET "https://api.maternalhealthsystem.org/v1/mothers" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json"`)}
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        <span>Copy</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      <span>Create a Visit</span>
                    </h3>
                    <div className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                      <code className="font-mono text-sm whitespace-pre">
{`curl -X POST "https://api.maternalhealthsystem.org/v1/visits" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "mother_id": "uuid-of-mother",
  "facility_id": "uuid-of-facility",
  "visit_date": "2023-06-15T10:30:00Z",
  "visit_type": "Antenatal",
  "notes": "Regular checkup, all vitals normal"
}'`}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="self-end mt-2"
                        onClick={() => copyToClipboard(`curl -X POST "https://api.maternalhealthsystem.org/v1/visits" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "mother_id": "uuid-of-mother",
  "facility_id": "uuid-of-facility",
  "visit_date": "2023-06-15T10:30:00Z",
  "visit_type": "Antenatal",
  "notes": "Regular checkup, all vitals normal"
}'`)}
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        <span>Copy</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
              <CardDescription>
                Understanding API error responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Error Response Format</h3>
                <p className="text-muted-foreground mb-2">
                  When an error occurs, the API returns a JSON object with the following structure:
                </p>
                <div className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                  <code className="font-mono text-sm whitespace-pre">
{`{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      // Additional error details when available
    }
  }
}`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Common Error Codes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Status Code</th>
                        <th className="text-left py-2 px-2">Error Code</th>
                        <th className="text-left py-2 px-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-2">400</td>
                        <td className="py-2 px-2">bad_request</td>
                        <td className="py-2 px-2">The request was malformed or had invalid parameters</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">401</td>
                        <td className="py-2 px-2">unauthorized</td>
                        <td className="py-2 px-2">Authentication failed or was not provided</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">403</td>
                        <td className="py-2 px-2">forbidden</td>
                        <td className="py-2 px-2">The authenticated user doesn't have permission</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">404</td>
                        <td className="py-2 px-2">not_found</td>
                        <td className="py-2 px-2">The requested resource doesn't exist</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">409</td>
                        <td className="py-2 px-2">conflict</td>
                        <td className="py-2 px-2">The request conflicts with the current state</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">422</td>
                        <td className="py-2 px-2">validation_error</td>
                        <td className="py-2 px-2">The request data failed validation</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">429</td>
                        <td className="py-2 px-2">rate_limit_exceeded</td>
                        <td className="py-2 px-2">You've exceeded the API rate limits</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">500</td>
                        <td className="py-2 px-2">internal_server_error</td>
                        <td className="py-2 px-2">An unexpected error occurred on the server</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Error Handling Example</h3>
                <div className="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                  <code className="font-mono text-sm whitespace-pre">
{`// Example of handling API errors in JavaScript
async function fetchData() {
  try {
    const response = await fetch(\`\${API_URL}/mothers\`, {
      method: "GET",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData.error.message);
      // Handle specific error types
      if (response.status === 401) {
        // Handle authentication error
      } else if (response.status === 429) {
        // Handle rate limiting
      }
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network or parsing error:", error);
    return null;
  }
}`}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="self-end mt-2"
                    onClick={() => copyToClipboard(`// Example of handling API errors in JavaScript
async function fetchData() {
  try {
    const response = await fetch(\`\${API_URL}/mothers\`, {
      method: "GET",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData.error.message);
      // Handle specific error types
      if (response.status === 401) {
        // Handle authentication error
      } else if (response.status === 429) {
        // Handle rate limiting
      }
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network or parsing error:", error);
    return null;
  }
}`)}
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    <span>Copy</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
