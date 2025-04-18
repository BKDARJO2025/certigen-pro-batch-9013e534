import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadCloud, X, ExternalLink, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal";

interface SavedTemplate {
  id: string;
  name: string;
  image: string;
  createdAt: string;
}

const sampleTemplates = [
  {
    id: "template-sample-1",
    name: "Professional Certificate",
    image: "/placeholder.svg",
    createdAt: new Date().toISOString()
  },
  {
    id: "template-sample-2",
    name: "Academic Achievement",
    image: "/placeholder.svg",
    createdAt: new Date().toISOString()
  },
  {
    id: "template-sample-3",
    name: "Sidoarjo Government Certificate",
    image: "/lovable-uploads/46b82dae-778b-477f-82aa-90ef02fc3a31.png",
    createdAt: new Date().toISOString()
  }
];

export default function TemplatesPage() {
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [templateName, setTemplateName] = useState<string>("My Certificate Template");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTemplate = localStorage.getItem("lovable.dev.currentTemplate");
    if (savedTemplate) {
      setTemplateImage(savedTemplate);
    }
    
    const templates = localStorage.getItem("lovable.dev.savedTemplates");
    if (templates) {
      const parsedTemplates = JSON.parse(templates);
      const sidoarjoTemplateExists = parsedTemplates.some(
        (t: SavedTemplate) => t.name === "Sidoarjo Government Certificate"
      );
      
      if (!sidoarjoTemplateExists) {
        const updatedTemplates = [
          ...parsedTemplates, 
          {
            id: "template-sample-sidoarjo",
            name: "Sidoarjo Government Certificate",
            image: "/lovable-uploads/46b82dae-778b-477f-82aa-90ef02fc3a31.png",
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem("lovable.dev.savedTemplates", JSON.stringify(updatedTemplates));
        setSavedTemplates(updatedTemplates);
      } else {
        setSavedTemplates(parsedTemplates);
      }
    } else {
      localStorage.setItem("lovable.dev.savedTemplates", JSON.stringify(sampleTemplates));
      setSavedTemplates(sampleTemplates);
      
      const adminTemplates = sampleTemplates.map(template => ({
        id: template.id,
        name: template.name,
        thumbnail: template.image,
        createdAt: template.createdAt,
        status: "active"
      }));
      localStorage.setItem("lovable.dev.templates", JSON.stringify(adminTemplates));
    }
  }, []);

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
    const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];
    
    if (!validImageTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, SVG, or GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string;
        setTemplateImage(imageData);
        
        localStorage.setItem("lovable.dev.currentTemplate", imageData);
        toast.success("Template uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveTemplate = () => {
    setTemplateImage(null);
    localStorage.removeItem("lovable.dev.currentTemplate");
    toast("Template removed");
  };

  const handleSaveTemplate = () => {
    if (!templateImage) {
      toast.error("Please upload a template first");
      return;
    }

    const newTemplate: SavedTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      image: templateImage,
      createdAt: new Date().toISOString()
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem("lovable.dev.savedTemplates", JSON.stringify(updatedTemplates));
    
    const adminTemplates = localStorage.getItem("lovable.dev.templates");
    const parsedAdminTemplates = adminTemplates ? JSON.parse(adminTemplates) : [];
    const adminTemplate = {
      id: newTemplate.id,
      name: newTemplate.name,
      thumbnail: newTemplate.image,
      createdAt: newTemplate.createdAt,
      status: "active"
    };
    localStorage.setItem("lovable.dev.templates", JSON.stringify([...parsedAdminTemplates, adminTemplate]));
    
    toast.success("Template saved to your collection!");
  };

  const handleUseTemplate = (template: SavedTemplate) => {
    setTemplateImage(template.image);
    localStorage.setItem("lovable.dev.currentTemplate", template.image);
    toast.success(`Using template: ${template.name}`);
  };

  const handleEditTemplate = (template: SavedTemplate) => {
    setTemplateImage(template.image);
    setTemplateName(template.name);
    localStorage.setItem("lovable.dev.currentTemplate", template.image);
    
    const filteredTemplates = savedTemplates.filter(t => t.id !== template.id);
    setSavedTemplates(filteredTemplates);
    localStorage.setItem("lovable.dev.savedTemplates", JSON.stringify(filteredTemplates));
    
    toast(`Editing template: ${template.name}`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const filteredTemplates = savedTemplates.filter(t => t.id !== templateId);
    setSavedTemplates(filteredTemplates);
    localStorage.setItem("lovable.dev.savedTemplates", JSON.stringify(filteredTemplates));
    toast("Template deleted");
  };

  const goToDataInput = () => {
    if (!templateImage) {
      toast.error("Please upload or select a template first");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const goToTextSettings = () => {
    if (!templateImage) {
      toast.error("Please upload or select a template first");
      return;
    }
    navigate("/text-settings");
  };

  const handleConfirmGeneration = () => {
    setIsConfirmModalOpen(false);
    navigate("/export");
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
                className={`border-2 border-dashed rounded-lg transition-colors ${
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
                      <button 
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        onClick={handleClickUpload}
                      >
                        browse
                      </button>
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/svg+xml, image/gif"
                        onChange={handleFileChange}
                      />
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports: JPG, PNG, SVG, GIF (Max 10MB)
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

              {templateImage && (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Template Name</label>
                    <Input 
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleSaveTemplate}>
                      Save as Template
                    </Button>
                    <div className="space-x-2">
                      <Button onClick={goToTextSettings} variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Add Text Elements
                      </Button>
                      <Button onClick={goToDataInput}>
                        Next: Generate Template
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {savedTemplates.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Your Saved Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedTemplates.map(template => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold truncate">{template.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1"
                          variant="default"
                        >
                          Use Template
                        </Button>
                        <Button 
                          onClick={() => handleEditTemplate(template)}
                          size="icon"
                          variant="outline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteTemplate(template.id)}
                          size="icon"
                          variant="outline"
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Demo Templates</h3>
              <p className="text-sm mb-3">Try these sample templates to test the certificate generation flow:</p>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="border rounded p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    const image = "/placeholder.svg";
                    setTemplateImage(image);
                    setTemplateName("Sample Certificate");
                    localStorage.setItem("lovable.dev.currentTemplate", image);
                    toast.success("Sample template loaded!");
                  }}
                >
                  <img src="/placeholder.svg" alt="Sample template" className="w-full aspect-video object-contain mb-1" />
                  <p className="text-xs font-medium text-center">Basic Certificate</p>
                </div>
                <div 
                  className="border rounded p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    const image = "/lovable-uploads/46b82dae-778b-477f-82aa-90ef02fc3a31.png";
                    setTemplateImage(image);
                    setTemplateName("Sidoarjo Government Certificate");
                    localStorage.setItem("lovable.dev.currentTemplate", image);
                    toast.success("Sidoarjo Certificate template loaded!");
                  }}
                >
                  <img src="/lovable-uploads/46b82dae-778b-477f-82aa-90ef02fc3a31.png" alt="Sidoarjo Certificate" className="w-full aspect-video object-contain mb-1" />
                  <p className="text-xs font-medium text-center">Sidoarjo Government Certificate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmGeneration}
        title="Generate Certificates"
        description="Are you ready to generate the certificates with the current template and text settings?"
        confirmText="Continue to Generation"
        cancelText="Back to Text Settings"
      />
    </div>
  );
}
