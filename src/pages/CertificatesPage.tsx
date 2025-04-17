import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileImage, FileText } from "lucide-react";

export default function CertificatesPage() {
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("certigen.certificateBatches") || "[]");
      setBatches(data);
    } catch {
      setBatches([]);
    }
  }, []);

  if (!batches.length) {
    return <div className="p-8 text-center text-gray-500">Belum ada sertifikat yang digenerate.</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Sertifikat</h1>
      <Card>
        <CardContent className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Nama Arsip</th>
                <th className="px-4 py-2 text-left">Jumlah</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-4 py-2 font-semibold">{batch.name}</td>
                  <td className="px-4 py-2">{batch.recipients.length}</td>
                  <td className="px-4 py-2">{new Date(batch.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{batch.status === 'generated' ? 'Sudah Digenerate' : batch.status === 'sent' ? 'Sudah Dikirim' : 'Belum Dikirim'}</td>
                  <td className="px-4 py-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => alert('Preview belum diimplementasikan')}>Preview</Button>{' '}
                    <Button size="sm" variant="outline" onClick={() => alert('Export JPG belum diimplementasikan')}><FileImage className="inline h-4 w-4" /></Button>{' '}
                    <Button size="sm" variant="outline" onClick={() => alert('Export PDF belum diimplementasikan')}><FileText className="inline h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 text-right">
            <Button variant="secondary" onClick={() => window.location.href = '/app'}>Back to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
