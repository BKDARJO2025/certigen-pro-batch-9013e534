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
  emailSent?: boolean;
}

interface CertificateBatch {
  id: string;
  name: string;
  createdAt: string;
  recipients: Recipient[];
  status: 'not_sent' | 'generated' | 'sent';
}

export default function ExportPage2() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<CertificateBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<CertificateBatch | null>(null);
  const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0);
  const [templateImage, setTemplateImage] = useState<string>("");
  const [textElements, setTextElements] = useState<TextElement[]>([]);

  const handlePreviewBatch = (batch: CertificateBatch) => {
    setSelectedBatch(batch);
    setCurrentRecipientIndex(0);
  };

  const handleClosePreview = () => {
    setSelectedBatch(null);
    setCurrentRecipientIndex(0);
  };

  const handlePrevPreview = () => {
    if (currentRecipientIndex > 0) {
      setCurrentRecipientIndex(currentRecipientIndex - 1);
    }
  };

  const handleNextPreview = () => {
    if (selectedBatch && currentRecipientIndex < selectedBatch.recipients.length - 1) {
      setCurrentRecipientIndex(currentRecipientIndex + 1);
    }
  };

  const handleDownloadBatch = async (batchId: string, batchName: string) => {
    toast.info(`Downloading batch: ${batchName}`);
    // Implementation will be added later
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePreviewBatch(batch)}
                      >
                        <span role="img" aria-label="Preview">👁️</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDownloadBatch(batch.id, batch.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedBatch && (
          <Dialog open={true} onOpenChange={handleClosePreview}>
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
                      {selectedBatch.recipients[currentRecipientIndex] && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                          <p className="text-lg font-bold text-blue-600">
                            {selectedBatch.recipients[currentRecipientIndex].name}
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
                              {el.text.replace(/\{name\}/g, selectedBatch.recipients[currentRecipientIndex].name)}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevPreview}
                    disabled={currentRecipientIndex === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Recipient {currentRecipientIndex + 1} of {selectedBatch.recipients.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPreview}
                    disabled={currentRecipientIndex === selectedBatch.recipients.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
