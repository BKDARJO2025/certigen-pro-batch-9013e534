import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;
  status: "active" | "inactive";
}

export default function TemplateManagementPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const navigate = useNavigate();
  
  useEffect(() => {
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
        },
        {
          id: "template-sidoarjo",
          name: "Sidoarjo Government Certificate",
          thumbnail: "/lovable-uploads/46b82dae-778b-477f-82aa-90ef02fc3a31.png",
          createdAt: new Date().toISOString(),
          status: "active"
        }
      ];
      
      setTemplates(mockTemplates);
      localStorage.setItem("lovable.dev.templates", JSON.stringify(mockTemplates));
    }
  }, []);

  const saveTemplates = (updatedTemplates: Template[]) => {
    setTemplates(updatedTemplates);
    localStorage.setItem("lovable.dev.templates", JSON.stringify(updatedTemplates));
  };

  const handleCreateTemplate = () => {
    navigate("/templates");
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditName(template.name);
    setEditStatus(template.status);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(updatedTemplates);
    toast.success("Template deleted successfully");
  };

  const handleSaveEdit = () => {
    if (!selectedTemplate) return;
    
    const updatedTemplates = templates.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, name: editName, status: editStatus }
        : t
    );
    
    saveTemplates(updatedTemplates);
    setIsEditDialogOpen(false);
    toast.success("Template updated successfully");
  };

  const handleUseTemplate = (template: Template) => {
    localStorage.setItem("lovable.dev.currentTemplate", template.thumbnail);
    toast.success(`Template "${template.name}" set as current template`);
    navigate("/text-settings");
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Template Management</h2>
        <Button onClick={handleCreateTemplate}>Create New Template</Button>
      </div>
      
      <Tabs defaultValue="grid" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(template => (
              <Card key={template.id}>
                <div className="p-4 aspect-video bg-gray-100 border-b">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => handleUseTemplate(template)}
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditTemplate(template)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="p-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left font-medium">Template</th>
                      <th className="p-3 text-left font-medium">Created</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map(template => (
                      <tr key={template.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 rounded bg-gray-100 overflow-hidden">
                              <img 
                                src={template.thumbnail} 
                                alt={template.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <span className="font-medium">{template.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            template.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {template.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUseTemplate(template)}
                            >
                              Use
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditTemplate(template)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>Make changes to the template details.</p>
          </DialogDescription>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editStatus}
                onValueChange={(value: "active" | "inactive") => setEditStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
