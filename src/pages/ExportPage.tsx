import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Download, CheckCircle2, FileImage, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SmtpConfig {
  emailjs_service_id: string;
  emailjs_template_id: string;
  emailjs_user_id: string;
  from_name: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

interface TextElement {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  textAlign: string;
}

interface Recipient {
  id: string;
  name: string;
  email?: string;
  status: 'not_sent' | 'generated' | 'sent';
}

interface CertificateBatch {
  id: string;
  name: string;
  createdAt: string;
  recipients: Recipient[];
  status: 'not_sent' | 'generated' | 'sent';
}

const mockBatches: CertificateBatch[] = [
  {
    id: 'batch-1',
    name: 'Contoh Upload Bulk.csv',
    createdAt: new Date().toISOString(),
    recipients: [
      { id: '1', name: 'John Doe', email: 'john@example.com', status: 'not_sent' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'sent' }
    ],
    status: 'generated'
  }
];

export default function ExportPage() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<CertificateBatch[]>([]);
  const [editBatchId, setEditBatchId] = useState<string | null>(null);
  const [editBatchName, setEditBatchName] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailFormat, setEmailFormat] = useState<"pdf" | "jpg">("pdf");
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig | null>(() => {
    const storedConfig = localStorage.getItem('smtpConfig');
    return storedConfig ? JSON.parse(storedConfig) : null;
  });
  const [previewBatch, setPreviewBatch] = useState<CertificateBatch | null>(null);
  const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0);
  const [templateImage, setTemplateImage] = useState<string>("");
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'jpg'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isBulkEmail, setIsBulkEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<Record<string, 'pending' | 'success' | 'error'>>({});

  const handlePreviewBatch = (batch: CertificateBatch) => {
    setPreviewBatch(batch);
    setCurrentRecipientIndex(0);
  };

  const handleClosePreview = () => {
    setPreviewBatch(null);
    setCurrentRecipientIndex(0);
  };

  const handlePrevPreview = () => {
    if (currentRecipientIndex > 0) {
      setCurrentRecipientIndex(currentRecipientIndex - 1);
    }
  };

  const handleNextPreview = () => {
    if (previewBatch && currentRecipientIndex < previewBatch.recipients.length - 1) {
      setCurrentRecipientIndex(currentRecipientIndex + 1);
    }
  };

  const handleEmailClick = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setEmailDialogOpen(true);
  };

  const handleDownloadBatch = async (batchId: string, batchName: string) => {
    // Implementation here
  };

  const handleDeleteBatch = (id: string) => {
    const updatedBatches = batches.filter((b) => b.id !== id);
    setBatches(updatedBatches);
  };

  const handleEditBatch = (b: CertificateBatch) => {
    setEditBatchId(b.id);
    setEditBatchName(b.name);
  };

  const handleEditBatchSave = () => {
    if (editBatchId && editBatchName.trim()) {
      const updatedBatches = batches.map((b) =>
        b.id === editBatchId ? { ...b, name: editBatchName.trim() } : b
      );
      setBatches(updatedBatches);
      setEditBatchId(null);
      setEditBatchName("");
    }
  };

  const handleEmailBatch = () => {
    if (!smtpConfig) {
      toast.error("Please configure SMTP settings first");
      return;
    }

    const config = smtpConfig;

    setIsSendingEmail(true);
    const recipientsToEmail = isBulkEmail
      ? previewBatch?.recipients
      : [previewBatch?.recipients[currentRecipientIndex]];

    if (!recipientsToEmail) {
      toast.error("No recipients selected");
      setIsSendingEmail(false);
      return;
    }

    // Send emails in sequence
    const sendEmails = async () => {
      for (const recipient of recipientsToEmail) {
        if (!recipient.email) continue;

        try {
          await sendEmail(recipient, exportFormat, config);
          setEmailStatus(prev => ({
            ...prev,
            [recipient.id]: 'success'
          }));

          // Update batch status
          if (previewBatch) {
            const updatedBatch = {
              ...previewBatch,
              status: 'sent' as const,
              recipients: previewBatch.recipients.map(r => 
                r.id === recipient.id ? { ...r, status: 'sent' as const } : r
              )
            };

            const updatedBatches = batches.map(b =>
              b.id === updatedBatch.id ? updatedBatch : b
            );

            setBatches(updatedBatches);
            localStorage.setItem('certigen.certificateBatches', JSON.stringify(updatedBatches));
          }

        } catch (error) {
          console.error('Error sending email:', error);
          setEmailStatus(prev => ({
            ...prev,
            [recipient.id]: 'error'
          }));
        }
      }

      setIsSendingEmail(false);
      toast.success("Emails sent successfully");
    };

    sendEmails();
  };

  const sendEmail = async (recipient: Recipient, format: "pdf" | "jpg", config: SmtpConfig) => {
    // Create canvas for this recipient
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx || !templateImage) {
      throw new Error("Failed to create canvas or no template image");
    }

    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = templateImage;
    });

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Draw text elements
    textElements.forEach(el => {
      ctx.font = `${el.fontSize}px ${el.fontFamily}`;
      ctx.fillStyle = el.fontColor;
      ctx.textAlign = el.textAlign || "left";
      const text = el.text.replace(/\{name\}/g, recipient.name);
      ctx.fillText(text, (el.x / 100) * canvas.width, (el.y / 100) * canvas.height);
    });

    // Convert to base64
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const base64Data = dataUrl.split(",")[1];

    // Send email using EmailJS
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: config.emailjs_service_id,
        template_id: config.emailjs_template_id,
        user_id: config.emailjs_user_id,
        template_params: {
          to_email: recipient.email,
          to_name: recipient.name,
          from_name: config.from_name,
          message: `Your ${format.toUpperCase()} certificate is attached.`,
          attachment: base64Data,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return response;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Certificate Batches</h1>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <p className="text-sm text-gray-500">No certificates found</p>
                      <Button variant="outline" onClick={() => navigate('/data-input')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Batch
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>{batch.recipients.length}</TableCell>
                  <TableCell>{new Date(batch.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {(() => {
                      switch (batch.status) {
                        case 'not_sent':
                          return (
                            <span className="text-yellow-600 flex items-center gap-1">
                              <Loader2 className="h-4 w-4" />
                              Not Sent
                            </span>
                          );
                        case 'sent':
                          return (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Sent
                            </span>
                          );
                        case 'generated':
                          return (
                            <span className="text-blue-600 flex items-center gap-1">
                              <FileImage className="h-4 w-4" />
                              Generated
                            </span>
                          );
                        default:
                          return (
                            <span className="text-gray-600">
                              Unknown
                            </span>
                          );
                      }
                    })()} 
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreviewBatch(batch)}>
                        <span role="img" aria-label="Preview">👁️</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadBatch(batch.id, batch.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setEditBatchId(null); setEditBatchName(""); }}>Batal</Button>
            <Button onClick={handleEditBatchSave}>Simpan</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
switch (batch.status) {
case 'not_sent':
return (
<span className="text-yellow-600 flex items-center gap-1">
<Loader2 className="h-4 w-4" />
Not Sent
</span>
);
case 'sent':
return (
<span className="text-green-600 flex items-center gap-1">
<CheckCircle2 className="h-4 w-4" />
Sent
</span>
);
case 'generated':
return (
<span className="text-blue-600 flex items-center gap-1">
<FileImage className="h-4 w-4" />
Generated
</span>
);
default:
return (
<span className="text-gray-600">
Unknown
</span>
);
}
})()} 
</TableCell>
<TableCell className="text-right">
<div className="flex justify-end gap-2">
<Button size="sm" variant="outline" onClick={() => handlePreviewBatch(batch)}>
<span role="img" aria-label="Preview">👁️</span>
</Button>
<Button size="sm" variant="outline" onClick={() => handleDownloadBatch(batch.id, batch.name)}>
<Download className="h-4 w-4" />
</Button>
</div>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
<div className="flex gap-2 justify-end">
<Button variant="outline" onClick={() => { setEditBatchId(null); setEditBatchName(""); }}>Batal</Button>
<Button onClick={handleEditBatchSave}>Simpan</Button>
</div>
</div>
</div>
</div>
);

{/* Modal Preview Batch */}
{previewBatch && (
<Dialog open={true} onOpenChange={() => handleClosePreview()}>
<DialogContent>
<DialogHeader>
<DialogTitle>Certificate Preview</DialogTitle>
</DialogHeader>
<div className="space-y-4">
<div className="certificate-canvas bg-white rounded-lg relative" style={{ width: "100%", height: "400px" }}>
{templateImage && (
<>
<img
src={templateImage}
alt="Certificate Preview"
style={{ width: '100%', height: '100%', objectFit: 'contain' }}
/>
{previewBatch.recipients[currentRecipientIndex] && (
<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
<p className="text-lg font-bold text-blue-600">
{previewBatch.recipients[currentRecipientIndex].name}
</p>
{textElements.map((el, idx) => (
<div
key={idx}
style={{
position: 'absolute',
left: `${el.x}%`,
top: `${el.y}%`,
transform: 'translate(-50%, -50%)',
color: el.fontColor,
fontSize: `${el.fontSize}px`,
fontFamily: el.fontFamily,
textAlign: el.textAlign as CanvasTextAlign
}}
>
{el.text.replace(/\{name\}/g, previewBatch.recipients[currentRecipientIndex].name)}
</div>
))}
</div>
))}
</>
)}
</div>
</div>
<div className="flex justify-between items-center mt-4">
<Button
variant="outline"
onClick={() => handlePrevPreview()}
disabled={currentRecipientIndex === 0}
>
Previous
</Button>
<span className="text-sm">
Recipient {currentRecipientIndex + 1} of {previewBatch.recipients.length}
</span>
<Button
variant="outline"
onClick={() => handleNextPreview()}
disabled={currentRecipientIndex === previewBatch.recipients.length - 1}
>
Next
</Button>
</div>
</DialogContent>
</Dialog>
)}
</div>
);
