
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Switch
} from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const [organizationName, setOrganizationName] = useState("My Organization");
  const [organizationLogo, setOrganizationLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [dateFormat, setDateFormat] = useState("MMMM DD, YYYY");
  const [certificateTitle, setCertificateTitle] = useState("Certificate of Completion");
  const [autoSave, setAutoSave] = useState(true);
  const [highResExport, setHighResExport] = useState(true);
  
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setOrganizationLogo(e.target.result as string);
          toast.success("Logo uploaded successfully");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSignature(e.target.result as string);
          toast.success("Signature uploaded successfully");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your certificate generation preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="org-logo">Organization Logo</Label>
                  <div className="mt-1 flex items-center">
                    {organizationLogo ? (
                      <div className="relative w-20 h-20 mr-4">
                        <img 
                          src={organizationLogo} 
                          alt="Organization logo" 
                          className="w-full h-full object-contain border rounded p-1" 
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                          onClick={() => setOrganizationLogo(null)}
                        >
                          <span className="sr-only">Remove</span>
                          ×
                        </Button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 mr-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                        <p className="text-xs text-gray-500">No logo</p>
                      </div>
                    )}
                    <label className="cursor-pointer bg-certigen-gray rounded px-3 py-2 text-sm">
                      Upload Logo
                      <input
                        id="org-logo"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="signature">Signature Image</Label>
                  <div className="mt-1 flex items-center">
                    {signature ? (
                      <div className="relative w-32 h-20 mr-4">
                        <img 
                          src={signature} 
                          alt="Signature" 
                          className="w-full h-full object-contain border rounded p-1" 
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                          onClick={() => setSignature(null)}
                        >
                          <span className="sr-only">Remove</span>
                          ×
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-20 mr-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                        <p className="text-xs text-gray-500">No signature</p>
                      </div>
                    )}
                    <label className="cursor-pointer bg-certigen-gray rounded px-3 py-2 text-sm">
                      Upload Signature
                      <input
                        id="signature"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleSignatureUpload}
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="certificate-title">Default Certificate Title</Label>
                  <Input
                    id="certificate-title"
                    value={certificateTitle}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Certificate Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Input
                    id="date-format"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format examples: "MMMM DD, YYYY" (January 01, 2023), "DD/MM/YYYY" (01/01/2023)
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-res-export">High Resolution Export</Label>
                    <p className="text-xs text-gray-500">
                      Generate certificates at 300 DPI for printing
                    </p>
                  </div>
                  <Switch
                    id="high-res-export"
                    checked={highResExport}
                    onCheckedChange={setHighResExport}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save">Auto-Save Progress</Label>
                    <p className="text-xs text-gray-500">
                      Automatically save changes as you work
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Footer Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter custom footer text that will appear at the bottom of each certificate"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-2">
                This text will appear at the bottom of all certificates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          className="min-w-[120px]"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
