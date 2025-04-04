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
  CheckCircle2,
  MailIcon
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Recipient {
  id: string;
  name: string;
  email?: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed';
  downloadUrl?: string;
  emailSent?: boolean;
}

// Mock data for demo purposes
const mockRecipients: Recipient[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', description: 'Course Completion', status: 'pending' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', description: 'Excellence Award', status: 'pending' },
  { id: '3', name: 'Robert Johnson', email: 'robert@example.com', description: 'Workshop Participation', status: 'pending' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', status: 'pending' },
  { id: '5', name: 'Michael Wilson', email: 'michael@example.com', description: 'Best Performance', status: 'pending' }
];

export default function ExportPage() {
  const [recipients, setRecipients] = useState<Recipient[]>(mockRecipients);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'jpg'>('pdf');
  const [exportQuality, setExportQuality] = useState<'standard' | 'high'>('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  const handleGenerateCertificates = () => {
    setIsGenerating(true);
    
    let processed = 0;
    const totalRecipients = recipients.length;
    
    recipients.forEach((recipient, index) => {
      setTimeout(() => {
        setRecipients(prev => prev.map(r => 
          r.id === recipient.id ? { ...r, status: 'processing' } : r
        ));
      }, index * 500);
      
      setTimeout(() => {
        setRecipients(prev => prev.map(r => 
          r.id === recipient.id ? { 
            ...r, 
            status: 'completed',
            downloadUrl: '#' 
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
  };

  const downloadSingle = (id: string, name: string) => {
    toast.info(`Downloading certificate for ${name}`);
  };

  const sendEmail = async (recipient: Recipient) => {
    if (!recipient.email) {
      toast.error("No email address available for this recipient");
      return;
    }

    if (recipient.status !== 'completed') {
      toast.error("Certificate must be generated before sending email");
      return;
    }

    setIsSendingEmail(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRecipients(prev => prev.map(r => 
        r.id === recipient.id ? { ...r, emailSent: true } : r
      ));
      
      toast.success(`Certificate sent to ${recipient.email}`);
      setEmailDialogOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const sendAllEmails = async () => {
    const completedRecipients = recipients.filter(r => 
      r.status === 'completed' && r.email && !r.emailSent
    );
    
    if (completedRecipients.length === 0) {
      toast.info("No completed certificates available to email");
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecipients(prev => prev.map(r => 
        r.status === 'completed' && r.email ? { ...r, emailSent: true } : r
      ));
      
      toast.success(`Sent ${completedRecipients.length} certificates by email`);
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      toast.error("Failed to send some emails. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const openEmailDialog = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setEmailDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generate & Export Certificates</h1>
        <p className="text-gray-500 mt-1">Create, download, and share certificates for all recipients</p>
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
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={downloadAll}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download All
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={sendAllEmails}
                      disabled={isSendingEmail}
                    >
                      {isSendingEmail ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <MailIcon className="mr-2 h-4 w-4" />
                      )}
                      Email All Certificates
                    </Button>
                  </>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell className="font-medium">{recipient.name}</TableCell>
                      <TableCell>{recipient.email || "-"}</TableCell>
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
                            {recipient.emailSent ? "Sent" : "Completed"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {recipient.status === 'completed' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadSingle(recipient.id, recipient.name)}
                              >
                                <Download className="mr-1 h-3 w-3" />
                                Download
                              </Button>
                              
                              <Button
                                size="sm"
                                variant={recipient.emailSent ? "ghost" : "outline"}
                                disabled={!recipient.email || recipient.emailSent}
                                onClick={() => openEmailDialog(recipient)}
                                className={recipient.emailSent ? "text-green-600" : ""}
                              >
                                <MailIcon className="mr-1 h-3 w-3" />
                                {recipient.emailSent ? "Sent" : "Email"}
                              </Button>
                            </>
                          )}
                        </div>
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

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Certificate by Email</DialogTitle>
            <DialogDescription>
              This will send the certificate to {selectedRecipient?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-gray-50 mb-4">
            <p className="font-medium">{selectedRecipient?.name}</p>
            <p className="text-sm text-gray-500">{selectedRecipient?.email}</p>
            <p className="text-sm text-gray-500 mt-1">{selectedRecipient?.description}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedRecipient && sendEmail(selectedRecipient)}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Send Now
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
