import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SmtpSettingsForm from "./SmtpSettingsForm";

export default function WebsiteSettingsPage() {
  const [senderEmail, setSenderEmail] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpan ke localStorage (atau backend jika sudah tersedia)
    localStorage.setItem("certigen.senderEmail", senderEmail);
    localStorage.setItem("certigen.notificationEmail", notificationEmail);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Email Pengirim Sertifikat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1">Email Pengirim (Admin) <span className="text-red-500">*</span></label>
              <Input
                id="senderEmail"
                type="email"
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                required
              />
            </div>
            <div>
              <label htmlFor="notificationEmail" className="block text-sm font-medium mb-1">Email Notifikasi Penerima (Opsional)</label>
              <Input
                id="notificationEmail"
                type="email"
                value={notificationEmail}
                onChange={e => setNotificationEmail(e.target.value)}
                placeholder="notifikasi@yourdomain.com"
              />
            </div>
            <Button type="submit" className="w-full">Simpan</Button>
            {saved && <p className="text-green-600 text-sm mt-2">Pengaturan email berhasil disimpan.</p>}
          </form>
        </CardContent>
      </Card>

      {/* SMTP Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SMTP Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SmtpSettingsForm />
        </CardContent>
      </Card>
      {/* Placeholder untuk pengaturan landing page di masa depan */}
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Editor (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Pengaturan tampilan landing page akan tersedia di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
}
