
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

interface RecipientFormData {
  name: string;
  certificateNumber: string;
  title: string;
}

export default function AddRecipientPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RecipientFormData>({
    name: "",
    certificateNumber: "",
    title: "",
  });
  
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.certificateNumber || !formData.title) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Generate unique ID
    const newId = Date.now().toString();
    
    // Create new recipient
    const newRecipient = {
      id: newId,
      name: formData.name,
      certificateNumber: formData.certificateNumber,
      title: formData.title,
      creationDate: new Date().toISOString().split('T')[0],
      printed: false
    };
    
    // Get existing recipients
    const existingRecipientsJson = localStorage.getItem("certigen.recipients");
    const existingRecipients = existingRecipientsJson 
      ? JSON.parse(existingRecipientsJson) 
      : [];
    
    // Add new recipient
    const updatedRecipients = [...existingRecipients, newRecipient];
    
    // Save to localStorage
    localStorage.setItem("certigen.recipients", JSON.stringify(updatedRecipients));
    
    toast.success("Recipient added successfully");
    navigate("/admin/recipients");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsUploading(true);

    // Simulate processing CSV
    setTimeout(() => {
      // In a real implementation, we would parse the CSV here
      // For demo purposes, we'll just add a fake batch of recipients
      
      const existingRecipientsJson = localStorage.getItem("certigen.recipients");
      const existingRecipients = existingRecipientsJson 
        ? JSON.parse(existingRecipientsJson) 
        : [];
      
      // Create sample batch
      const batchSize = Math.floor(Math.random() * 5) + 3; // 3-7 random recipients
      const newRecipients = [];
      
      for (let i = 0; i < batchSize; i++) {
        const index = existingRecipients.length + i + 1;
        newRecipients.push({
          id: `batch-${Date.now()}-${i}`,
          name: `CSV Import ${index}`,
          certificateNumber: `BATCH-${String(index).padStart(3, '0')}`,
          title: "Certificate of Completion",
          creationDate: new Date().toISOString().split('T')[0],
          printed: false
        });
      }
      
      // Add new recipients
      const updatedRecipients = [...existingRecipients, ...newRecipients];
      
      // Save to localStorage
      localStorage.setItem("certigen.recipients", JSON.stringify(updatedRecipients));
      
      setIsUploading(false);
      toast.success(`${batchSize} recipients imported successfully`);
      navigate("/admin/recipients");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/admin/recipients")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">Add Recipient</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Individual Recipient</CardTitle>
            <CardDescription>
              Enter the details for a single certificate recipient
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Recipient Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input 
                  id="certificateNumber" 
                  name="certificateNumber" 
                  placeholder="CERT-001" 
                  value={formData.certificateNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Certificate Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Certificate of Excellence" 
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Add Recipient</Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Import</CardTitle>
            <CardDescription>
              Upload a CSV file with multiple recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
              <div className="flex justify-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  CSV file should include name, certificate number, and title columns
                </p>
              </div>
              <label className="relative">
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Select CSV File"}
                </Button>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
