
import { useState } from "react";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Plus, Check, X, MailIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

// Define recipient type
interface Recipient {
  id: string;
  certificateNumber: string;
  name: string;
  email?: string;
  title: string;
  creationDate: string;
  printed: boolean;
}

export default function RecipientManagementPage() {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("certigen.recipients");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        certificateNumber: "CERT-001",
        name: "John Doe",
        email: "john@example.com",
        title: "Certificate of Excellence",
        creationDate: "2025-03-15",
        printed: false
      },
      {
        id: "2",
        certificateNumber: "CERT-002",
        name: "Jane Smith",
        email: "jane@example.com",
        title: "Certificate of Achievement",
        creationDate: "2025-03-20",
        printed: true
      }
    ];
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRecipient, setPreviewRecipient] = useState<Recipient | null>(null);

  // Save changes to localStorage
  const saveRecipients = (updatedRecipients: Recipient[]) => {
    localStorage.setItem("certigen.recipients", JSON.stringify(updatedRecipients));
    setRecipients(updatedRecipients);
  };

  // Toggle printed status
  const togglePrintStatus = (id: string) => {
    const updated = recipients.map(recipient => {
      if (recipient.id === id) {
        const newStatus = !recipient.printed;
        toast.success(`Certificate for ${recipient.name} marked as ${newStatus ? 'printed' : 'not printed'}`);
        return { ...recipient, printed: newStatus };
      }
      return recipient;
    });
    saveRecipients(updated);
  };

  // Delete recipient
  const deleteRecipient = (id: string) => {
    const recipientToDelete = recipients.find(r => r.id === id);
    if (recipientToDelete) {
      const updated = recipients.filter(recipient => recipient.id !== id);
      saveRecipients(updated);
      toast.success(`Recipient ${recipientToDelete.name} has been deleted`);
    }
  };

  // Preview recipient
  const previewRecipientCertificate = (recipient: Recipient) => {
    setPreviewRecipient(recipient);
    setPreviewOpen(true);
  };

  // Navigate to add recipient page
  const navigateToAddRecipient = () => {
    navigate("/admin/recipients/add");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recipient Management</h2>
        <Button onClick={navigateToAddRecipient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recipient
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Certificate Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipients.length > 0 ? (
              recipients.map((recipient, index) => (
                <TableRow key={recipient.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{recipient.certificateNumber}</TableCell>
                  <TableCell>{recipient.name}</TableCell>
                  <TableCell>{recipient.email || "-"}</TableCell>
                  <TableCell>{recipient.title}</TableCell>
                  <TableCell>{recipient.creationDate}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={recipient.printed ? "text-green-500" : "text-red-500"}
                      onClick={() => togglePrintStatus(recipient.id)}
                    >
                      {recipient.printed ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      {recipient.printed ? "Printed" : "Not Printed"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => previewRecipientCertificate(recipient)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => deleteRecipient(recipient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No recipients found. Add a new recipient to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              Preview for {previewRecipient?.name}'s certificate
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 py-4">
            <div className="flex flex-col items-center">
              <div className="border rounded-lg p-4 shadow-md w-full bg-white">
                {/* Certificate Preview Placeholder */}
                <div className="w-full aspect-[1.4/1] bg-gray-100 flex items-center justify-center rounded-md mb-3">
                  <div className="text-center p-8 max-w-xl mx-auto">
                    <h3 className="text-2xl font-serif mb-4">{previewRecipient?.title}</h3>
                    <p className="text-lg mb-2">This certifies that</p>
                    <p className="text-3xl font-bold mb-4">{previewRecipient?.name}</p>
                    <p className="text-sm mb-1">Certificate Number: {previewRecipient?.certificateNumber}</p>
                    <p className="text-sm">Date: {previewRecipient?.creationDate}</p>
                    {previewRecipient?.email && (
                      <p className="text-sm mt-2">Contact: {previewRecipient.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <p className="font-medium">{previewRecipient?.name}</p>
                  <p className="text-xs text-muted-foreground">Created on {previewRecipient?.creationDate}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setPreviewOpen(false)}>
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
