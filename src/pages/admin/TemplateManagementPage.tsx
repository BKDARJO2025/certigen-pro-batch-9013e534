
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  status: "active" | "inactive";
}

export default function TemplateManagementPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  
  useEffect(() => {
    // Load templates from localStorage or initialize with mock data
    const storedTemplates = localStorage.getItem("lovable.dev.templates");
    
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    } else {
      const mockTemplates: Template[] = [
        {
          id: "template-1",
          name: "Certificate of Achievement",
          thumbnail: "/placeholder.svg",
          createdAt: new Date(2023, 5, 15).toISOString(),
          status: "active"
        },
        {
          id: "template-2",
          name: "Certificate of Completion",
          thumbnail: "/placeholder.svg",
          createdAt: new Date(2023, 6, 22).toISOString(),
          status: "active"
        },
        {
          id: "template-3",
          name: "Certificate of Excellence",
          thumbnail: "/placeholder.svg",
          createdAt: new Date(2023, 7, 10).toISOString(),
          status: "inactive"
        }
      ];
      
      setTemplates(mockTemplates);
      localStorage.setItem("lovable.dev.templates", JSON.stringify(mockTemplates));
    }
  }, []);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Template Management</h2>
        <Button>Create New Template</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id}>
            <div className="p-4 aspect-video bg-gray-100 border-b">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                className="w-full h-full object-contain"
              />
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {template.status}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                <Button size="sm" variant="destructive" className="flex-1">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
