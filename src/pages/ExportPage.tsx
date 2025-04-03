
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download,
  FileImage,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface Recipient {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed';
  downloadUrl?: string;
}

// Mock data for demo purposes
const mockRecipients: Recipient[] = [
  { id: '1', name: 'John Doe', description: 'Course Completion', status: 'pending' },
  { id: '2', name: 'Jane Smith', description: 'Excellence Award', status: 'pending' },
  { id: '3', name: 'Robert Johnson', description: 'Workshop Participation', status: 'pending' },
  { id: '4', name: 'Emily Davis', status: 'pending' },
  { id: '5', name: 'Michael Wilson', description: 'Best Performance', status: 'pending' }
];

export default function ExportPage() {
  const [recipients, setRecipients] = useState<Recipient[]>(mockRecipients);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'jpg'>('pdf');
  const [exportQuality, setExportQuality] = useState<'standard' | 'high'>('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerateCertificates = () => {
    setIsGenerating(true);
    
    // Simulate certificate generation process
    let processed = 0;
    const totalRecipients = recipients.length;
    
    recipients.forEach((recipient, index) => {
      // Update status to processing
      setTimeout(() => {
        setRecipients(prev => prev.map(r => 
          r.id === recipient.id ? { ...r, status: 'processing' } : r
        ));
      }, index * 500);
      
      // Complete processing
      setTimeout(() => {
        setRecipients(prev => prev.map(r => 
          r.id === recipient.id ? { 
            ...r, 
            status: 'completed',
            downloadUrl: '#' // In a real app, this would be a real URL
          } : r
        ));
        
        processed++;
        if (processed === totalRecipients) {
          setIsGenerating(false);
          setGenerationComplete(true);
          toast.success("All certificates generated successfully!");
        }
      }, (index + 1) * 1000);
    });
  };

  const downloadAll = () => {
    toast.info("Download started for all certificates");
    // In a real implementation, this would create a zip file with all certificates
  };

  const downloadSingle = (id: string, name: string) => {
    toast.info(`Downloading certificate for ${name}`);
    // In a real implementation, this would download the specific certificate
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generate & Export Certificates</h1>
        <p className="text-gray-500 mt-1">Create and download certificates for all recipients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Export Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Output Format</label>
                  <Select
                    value={exportFormat}
                    onValueChange={(value: 'pdf' | 'jpg') => setExportFormat(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="jpg">JPG Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Quality</label>
                  <Select
                    value={exportQuality}
                    onValueChange={(value: 'standard' | 'high') => setExportQuality(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (72 DPI)</SelectItem>
                      <SelectItem value="high">High Quality (300 DPI)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleGenerateCertificates}
                  disabled={isGenerating || generationComplete}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : generationComplete ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Generated
                    </>
                  ) : (
                    "Generate Certificates"
                  )}
                </Button>
                
                {generationComplete && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={downloadAll}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Certificates ({recipients.length})</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell className="font-medium">{recipient.name}</TableCell>
                      <TableCell>{recipient.description || "-"}</TableCell>
                      <TableCell>
                        {recipient.status === 'pending' && (
                          <span className="text-gray-500">Pending</span>
                        )}
                        {recipient.status === 'processing' && (
                          <span className="flex items-center text-certigen-blue">
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Processing
                          </span>
                        )}
                        {recipient.status === 'completed' && (
                          <span className="flex items-center text-green-600">
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {recipient.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadSingle(recipient.id, recipient.name)}
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Certificate Preview</h3>
        
        <div className="bg-certigen-gray rounded-lg p-8 text-center">
          {!generationComplete ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FileImage className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">
                {isGenerating 
                  ? "Generating certificates, please wait..." 
                  : "Generate certificates to see a preview"}
              </p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded bg-white p-4 mx-auto max-w-2xl">
              <div className="certificate-canvas bg-white rounded-lg" style={{ width: "100%", height: "300px", position: "relative" }}>
                <div style={{ 
                  position: "absolute", 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)",
                  textAlign: "center"
                }}>
                  <p className="text-sm text-gray-500">Certificate Preview</p>
                  <p className="mt-2 text-lg font-montserrat text-certigen-blue">
                    Certificate sample is ready for download
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
