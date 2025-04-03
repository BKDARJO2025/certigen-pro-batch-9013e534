
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function TemplatesPage() {
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    const validImageTypes = ['image/jpeg', 'image/png'];
    
    if (!validImageTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG or PNG)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setTemplateImage(e.target.result as string);
        toast.success("Template uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTemplate = () => {
    setTemplateImage(null);
    toast("Template removed");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Certificate Templates</h1>
        <p className="text-gray-500 mt-1">Upload and manage your certificate templates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                  isDragging ? "border-certigen-blue bg-blue-50" : "border-gray-300"
                } ${templateImage ? "p-4" : "p-12"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!templateImage ? (
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop your certificate template here, or{" "}
                      <label className="text-certigen-blue hover:text-certigen-blue cursor-pointer">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg"
                          onChange={handleFileChange}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports: JPG, PNG (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={handleRemoveTemplate}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={templateImage}
                      alt="Certificate template"
                      className="max-w-full rounded"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {templateImage && (
            <div className="mt-4 flex justify-end">
              <Button asChild variant="outline" className="mr-2">
                <a href="/text-settings">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Add Text Elements
                </a>
              </Button>
              <Button asChild>
                <a href="/data-input">Next: Data Input</a>
              </Button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Template Guidelines</h2>
          <div className="space-y-4">
            <div className="bg-certigen-gray p-4 rounded-lg">
              <h3 className="font-medium mb-2">Recommended Format</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Use high-resolution images (minimum 300 DPI)</li>
                <li>Landscape orientation works best</li>
                <li>Standard sizes: A4, Letter, or Certificate (8.5" x 11")</li>
                <li>Leave space for names and other dynamic text</li>
              </ul>
            </div>
            
            <div className="bg-certigen-gray p-4 rounded-lg">
              <h3 className="font-medium mb-2">Best Practices</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Use PNG format for templates with transparency</li>
                <li>Ensure your template has clear areas for text placement</li>
                <li>Use lighter backgrounds behind text placement areas</li>
                <li>Keep important design elements away from edges</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-medium flex items-center">
                <span className="mr-1">⚠️</span> Important Note
              </h3>
              <p className="text-sm mt-1">
                After uploading your template, you'll need to add and position text elements in the next step before generating certificates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
