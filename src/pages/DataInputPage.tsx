
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

interface Recipient {
  id: string;
  name: string;
  description?: string;
}

export default function DataInputPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleAddRecipient = () => {
    if (name.trim() === "") {
      toast.error("Please enter a name");
      return;
    }
    
    const newRecipient: Recipient = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || undefined
    };
    
    setRecipients([...recipients, newRecipient]);
    setName("");
    setDescription("");
    toast.success("Recipient added");
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(recipient => recipient.id !== id));
    toast("Recipient removed");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setCsvError("Please upload a valid CSV file");
        return;
      }
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const parsedRecipients = results.data
              .filter((row: any) => row.name && row.name.trim() !== "")
              .map((row: any) => ({
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                name: row.name?.trim() || "",
                description: row.description?.trim() || undefined
              }));
            
            if (parsedRecipients.length === 0) {
              setCsvError("No valid recipients found in CSV");
              return;
            }
            
            setRecipients([...recipients, ...parsedRecipients]);
            toast.success(`${parsedRecipients.length} recipients imported`);
            
            if (results.errors.length > 0) {
              toast.warning(`${results.errors.length} rows had errors and were skipped`);
            }
          }
        },
        error: (error) => {
          setCsvError(`Error parsing CSV: ${error.message}`);
        }
      });
    }
  };

  const handleClearAll = () => {
    if (recipients.length === 0) return;
    
    if (confirm(`Are you sure you want to remove all ${recipients.length} recipients?`)) {
      setRecipients([]);
      toast("All recipients removed");
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = "name,description\nJohn Doe,Course Completion\nJane Smith,Excellence Award";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "certificate_recipients_sample.csv";
    link.click();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Input</h1>
        <p className="text-gray-500 mt-1">Add recipient information for your certificates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="single">
                <TabsList className="mb-4">
                  <TabsTrigger value="single">Single Entry</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="single">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Recipient Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter recipient name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description (Optional)
                      </label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Course Completion, Award Title, etc."
                        rows={3}
                      />
                    </div>
                    
                    <Button
                      onClick={handleAddRecipient}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Recipient
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="bulk">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Upload a CSV file with recipient data
                      </p>
                      <label className="mt-2 inline-flex items-center px-4 py-2 bg-certigen-blue text-white rounded cursor-pointer hover:bg-blue-700 transition">
                        <FileText className="mr-2 h-4 w-4" />
                        Choose CSV File
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    
                    {csvError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm">
                        <p className="text-red-700">{csvError}</p>
                      </div>
                    )}
                    
                    <div className="bg-certigen-gray p-4 rounded-lg text-sm">
                      <p className="font-medium mb-1">CSV Format Instructions:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>The CSV should have headers: 'name' and 'description'</li>
                        <li>The 'name' field is required for each row</li>
                        <li>The 'description' field is optional</li>
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={downloadSampleCsv}
                      >
                        Download Sample CSV
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recipients List ({recipients.length})</CardTitle>
              {recipients.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {recipients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recipients added yet</p>
                  <p className="text-sm mt-1">Add recipients using the form on the left</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {recipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{recipient.name}</p>
                        {recipient.description && (
                          <p className="text-sm text-gray-500">{recipient.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRecipient(recipient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {recipients.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button asChild>
                <a href="/text-settings">Next: Text Settings</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
