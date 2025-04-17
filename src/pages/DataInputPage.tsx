
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

interface Recipient {
  no: string;
  name: string;
  id: string;
  email: string;
}

export default function DataInputPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [csvError, setCsvError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recipients from localStorage if available
    const savedRecipients = localStorage.getItem("lovable.dev.recipients");
    if (savedRecipients) {
      try {
        setRecipients(JSON.parse(savedRecipients));
      } catch (e) {
        console.error("Error loading saved recipients:", e);
      }
    }
  }, []);

  // Save recipients to localStorage whenever they change
  useEffect(() => {
    if (recipients.length > 0) {
      localStorage.setItem("lovable.dev.recipients", JSON.stringify(recipients));
      // --- Tambahkan batch baru ke certigen.certificateBatches ---
      const batchName = `Upload ${new Date().toLocaleString()}`;
      const newBatch = {
        id: `batch-${Date.now()}`,
        name: batchName,
        createdAt: new Date().toISOString(),
        recipients: recipients.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          description: '',
          status: 'pending',
          emailSent: false
        })),
        status: 'not_sent'
      };
      // Ambil batch lama, tambahkan batch baru, simpan
      let batches = [];
      try {
        const old = localStorage.getItem("certigen.certificateBatches");
        if (old) batches = JSON.parse(old);
      } catch {}
      // Hindari duplikasi batch jika recipients tidak berubah
      if (!batches.some((b:any) => b.createdAt === newBatch.createdAt && b.recipients.length === newBatch.recipients.length)) {
        batches.push(newBatch);
        localStorage.setItem("certigen.certificateBatches", JSON.stringify(batches));
      }
    }
  }, [recipients]);

  const handleAddRecipient = () => {
    if (name.trim() === "") {
      toast.error("Please enter a name");
      return;
    }
    if (email.trim() === "") {
      toast.error("Please enter an email");
      return;
    }
    const newRecipient: Recipient = {
      no: (recipients.length + 1).toString(),
      name: name.trim(),
      id: Date.now().toString(),
      email: email.trim()
    };
    setRecipients([...recipients, newRecipient]);
    setName("");
    setEmail("");
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
            // Accept flexible casing for headers
            const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '');
            const parsedRecipients = results.data
              .map((row: any) => {
                // Try to map possible header names
                const no = row.no || row.No || row.NO || row["no"] || row["No"] || row["NO"] || row["No."] || row["no."] || '';
                const name = row.nama || row.Nama || row.NAMA || row["nama"] || row["Nama"] || row["NAMA"] || '';
                const id = row.id || row.ID || row.Id || row["id"] || row["ID"] || row["Id"] || '';
                const email = row["email address"] || row["Email Address"] || row["email"] || row["Email"] || row["EMAIL"] || '';
                return {
                  no: no?.toString().trim() || '',
                  name: name?.toString().trim() || '',
                  id: id?.toString().trim() || '',
                  email: email?.toString().trim() || ''
                };
              })
              .filter((row: any) => row.name && row.id && row.email);
            if (parsedRecipients.length === 0) {
              setCsvError("No valid recipients found in CSV. Please use columns: no, nama, id, email address.");
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
      localStorage.removeItem("lovable.dev.recipients");
      toast("All recipients removed");
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = "no,nama,id,email address\n1,John Doe,12345,john@example.com\n2,Jane Smith,67890,jane@example.com";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "certificate_recipients_sample.csv";
    link.click();
  };

  const goToTextSettings = () => {
    navigate("/text-settings");
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
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter recipient email"
                        autoComplete="email"
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
                        <li>CSV headers must be: <b>no, nama, id, email address</b></li>
                        <li>All columns are required for each row</li>
                        <li>Example: 1, John Doe, 12345, john@example.com</li>
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
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email Address</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recipients.map((recipient, idx) => (
                        <tr key={recipient.id || recipient.email+recipient.id+recipient.no}>
                          <td className="px-4 py-2 whitespace-nowrap">{recipient.no}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{recipient.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{recipient.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{recipient.email}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveRecipient(recipient.id || recipient.email+recipient.id+recipient.no)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {recipients.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={goToTextSettings}>
                Next: Text Settings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
