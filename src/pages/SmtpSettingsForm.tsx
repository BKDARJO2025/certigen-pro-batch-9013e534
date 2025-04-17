import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export type SmtpConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
  senderName?: string;
};

const LOCAL_KEY = "certigen.smtpConfig";

export default function SmtpSettingsForm() {
  const [config, setConfig] = useState<SmtpConfig>({
    host: "",
    port: 465,
    username: "",
    password: "",
    secure: true,
    senderName: ""
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      setConfig({ ...config, ...JSON.parse(stored) });
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleSwitch = (val: boolean) => {
    setConfig((prev) => ({ ...prev, secure: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label htmlFor="smtp-host" className="block text-sm font-medium mb-1">SMTP Host <span className="text-red-500">*</span></label>
        <Input
          id="smtp-host"
          name="host"
          value={config.host}
          onChange={handleChange}
          placeholder="smtp.yourdomain.com"
          required
        />
      </div>
      <div>
        <label htmlFor="smtp-port" className="block text-sm font-medium mb-1">Port <span className="text-red-500">*</span></label>
        <Input
          id="smtp-port"
          name="port"
          type="number"
          value={config.port}
          onChange={handleChange}
          placeholder="465"
          required
        />
      </div>
      <div>
        <label htmlFor="smtp-username" className="block text-sm font-medium mb-1">SMTP Username <span className="text-red-500">*</span></label>
        <Input
          id="smtp-username"
          name="username"
          value={config.username}
          onChange={handleChange}
          placeholder="email@yourdomain.com"
          required
        />
      </div>
      <div>
        <label htmlFor="smtp-password" className="block text-sm font-medium mb-1">SMTP Password <span className="text-red-500">*</span></label>
        <Input
          id="smtp-password"
          name="password"
          value={config.password}
          type="password"
          onChange={handleChange}
          placeholder="Password or App Password"
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="smtp-secure" checked={config.secure} onCheckedChange={handleSwitch} />
        <label htmlFor="smtp-secure" className="text-sm font-medium">Gunakan TLS/SSL</label>
      </div>
      <div>
        <label htmlFor="smtp-senderName" className="block text-sm font-medium mb-1">Sender Name (Opsional)</label>
        <Input
          id="smtp-senderName"
          name="senderName"
          value={config.senderName}
          onChange={handleChange}
          placeholder="Nama Pengirim"
        />
      </div>
      <Button type="submit" className="w-full">Simpan SMTP</Button>
      {saved && <p className="text-green-600 text-sm mt-2">Pengaturan SMTP berhasil disimpan.</p>}
    </form>
  );
}
