import React, { useState } from "react";
import CertificateCanvas from "@/components/CertificateCanvas";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";

export default function CertificatePreviewPage() {
  let batch;
  try {
    const batches = JSON.parse(localStorage.getItem('certigen.certificateBatches') || '[]');
    batch = batches.length > 0 ? batches[batches.length - 1] : null;
  } catch {
    batch = null;
  }
  // Get the saved complete template and text elements
  const savedTemplate = localStorage.getItem("lovable.dev.savedTemplate");
  const templateUrl = savedTemplate || localStorage.getItem("lovable.dev.currentTemplate") || "";
  
  let textElements = [];
  try {
    // Try to get saved text elements first, fallback to current text elements
    const savedElements = localStorage.getItem("lovable.dev.savedTextElements");
    textElements = JSON.parse(savedElements || localStorage.getItem("lovable.dev.textElements") || "[]");
  } catch {}

  const [current, setCurrent] = useState(0);
  if (!batch) {
    return <div style={{ padding: 32 }}>Data tidak ditemukan. Silakan upload data terlebih dahulu.</div>;
  }
  const recipient = batch.recipients[current];

  const handlePrev = () => setCurrent((prev) => prev === 0 ? batch.recipients.length - 1 : prev - 1);
  const handleNext = () => setCurrent((prev) => (prev + 1) % batch.recipients.length);

  const handleExportJPG = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Convert canvas to jpg and download
    const link = document.createElement('a');
    link.download = `certificate-${recipient.name}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.8);
    link.click();
  };

  const handleExportPDF = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Create a new jsPDF instance
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    // Add the canvas as an image
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

    // Save the PDF
    pdf.save(`certificate-${recipient.name}.pdf`);
  };

  const handleGenerateAll = () => {
    // Dummy: update status batch jadi 'generated'
    const batches = JSON.parse(localStorage.getItem('certigen.certificateBatches') || '[]');
    const idx = batches.findIndex((b:any) => b.id === batch.id);
    if (idx >= 0) {
      batches[idx].status = 'generated';
      localStorage.setItem('certigen.certificateBatches', JSON.stringify(batches));
      window.location.reload();
    }
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">Preview Sertifikat: {batch.name}</h2>
      <div className="mb-4">
        <table className="min-w-full divide-y divide-gray-200 mb-2">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batch.recipients.map((r: any, i:number) => (
              <tr key={r.id} className={i===current ? "bg-blue-50" : ""}>
                <td className="px-4 py-2">{i+1}</td>
                <td className="px-4 py-2 font-semibold">{r.name}</td>
                <td className="px-4 py-2">{r.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-2 mb-4">
          <Button onClick={handlePrev}>Prev</Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrev}>
            Prev
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportJPG}>
            Export JPG
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            Export PDF
          </Button>
        </div>
      </div>
      <div className="mx-auto rounded-lg shadow max-w-full">
        <CertificateCanvas
          templateUrl={templateUrl}
          name={recipient.name}
          textElements={textElements}
        />
      </div>
      <Button variant="default" onClick={handleGenerateAll}>Generate All</Button>
    </div>
  );
}
