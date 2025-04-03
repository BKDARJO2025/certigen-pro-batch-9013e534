
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from "lucide-react";
import Draggable from "react-draggable";

interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  type: "static" | "dynamic";
  dynamicField?: "name" | "description" | "date";
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  alignment?: "left" | "center" | "right";
}

const fontFamilies = [
  { value: "montserrat", label: "Montserrat" },
  { value: "roboto", label: "Roboto" },
  { value: "serif", label: "Serif" },
  { value: "sans-serif", label: "Sans Serif" },
  { value: "monospace", label: "Monospace" },
  { value: "georgia", label: "Georgia" },
  { value: "times", label: "Times New Roman" },
  { value: "arial", label: "Arial" },
];

const fontSizes = Array.from({ length: 25 }, (_, i) => 12 + i * 2);

// Professional text presets
const textPresets = [
  { id: "preset-1", name: "Certificate Title", content: "Certificate of Achievement", type: "static", fontSize: 42, fontFamily: "georgia", alignment: "center" },
  { id: "preset-2", name: "Recipient Name", content: "[Recipient Name]", type: "dynamic", dynamicField: "name", fontSize: 36, fontFamily: "montserrat", alignment: "center" },
  { id: "preset-3", name: "Description", content: "[Description]", type: "dynamic", dynamicField: "description", fontSize: 18, fontFamily: "serif", alignment: "center" },
  { id: "preset-4", name: "Date", content: "[Current Date]", type: "dynamic", dynamicField: "date", fontSize: 16, fontFamily: "sans-serif", alignment: "center" },
  { id: "preset-5", name: "Signature Line", content: "________________________", type: "static", fontSize: 24, fontFamily: "serif", alignment: "center" },
  { id: "preset-6", name: "Signatory Title", content: "CEO & Founder", type: "static", fontSize: 16, fontFamily: "serif", alignment: "center" },
];

export default function TextSettingsPage() {
  const [elements, setElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get template from localStorage
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  
  // Canvas ref for positioning
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load template and any saved elements
  useEffect(() => {
    const savedTemplate = localStorage.getItem("lovable.dev.currentTemplate");
    if (savedTemplate) {
      setTemplateImage(savedTemplate);
      setImageLoaded(true);
    }

    // Load saved text elements if any
    const savedElements = localStorage.getItem("lovable.dev.textElements");
    if (savedElements) {
      setElements(JSON.parse(savedElements));
    } else if (canvasRef.current) {
      // Add default professional elements if none exist
      const defaultElements = textPresets.map((preset, index) => ({
        id: Date.now() + index.toString(),
        content: preset.content,
        x: canvasRef.current.clientWidth / 2 - 150,
        y: 100 + (index * 60),
        fontSize: preset.fontSize,
        fontFamily: preset.fontFamily,
        color: "#000000",
        type: preset.type as "static" | "dynamic",
        dynamicField: preset.type === "dynamic" ? preset.dynamicField as "name" | "description" | "date" : undefined,
        alignment: preset.alignment as "left" | "center" | "right",
        fontWeight: "normal" as "normal" | "bold",
        fontStyle: "normal" as "normal" | "italic",
      }));
      setElements(defaultElements);
    }
  }, []);

  // Save elements to localStorage whenever they change
  useEffect(() => {
    if (elements.length > 0) {
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(elements));
    }
  }, [elements]);

  const handleAddElement = (type: "static" | "dynamic") => {
    if (!canvasRef.current) return;

    const newElement: TextElement = {
      id: Date.now().toString(),
      content: type === "static" ? "Static Text" : "[Recipient Name]",
      x: canvasRef.current.clientWidth / 2 - 100,
      y: canvasRef.current.clientHeight / 2 - 20,
      fontSize: 24,
      fontFamily: "montserrat",
      color: "#000000",
      type,
      dynamicField: type === "dynamic" ? "name" : undefined,
      alignment: "left",
      fontWeight: "normal",
      fontStyle: "normal",
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    toast.success(`${type === "static" ? "Static" : "Dynamic"} text element added`);
  };

  const handleAddPresetElement = (presetId: string) => {
    if (!canvasRef.current) return;
    
    const preset = textPresets.find(p => p.id === presetId);
    if (!preset) return;
    
    const newElement: TextElement = {
      id: Date.now().toString(),
      content: preset.content,
      x: canvasRef.current.clientWidth / 2 - 150,
      y: canvasRef.current.clientHeight / 2 - 20,
      fontSize: preset.fontSize,
      fontFamily: preset.fontFamily,
      color: "#000000",
      type: preset.type as "static" | "dynamic",
      dynamicField: preset.type === "dynamic" ? preset.dynamicField as "name" | "description" | "date" : undefined,
      alignment: preset.alignment as "left" | "center" | "right",
      fontWeight: "normal",
      fontStyle: "normal",
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    toast.success(`${preset.name} element added`);
  };

  const handleElementSelect = (id: string) => {
    setSelectedElement(id);
  };

  const handleElementDelete = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    toast("Text element removed");
  };

  const handlePropertyChange = (property: keyof TextElement, value: any) => {
    if (!selectedElement) return;
    
    setElements(elements.map(el => 
      el.id === selectedElement ? { ...el, [property]: value } : el
    ));
  };

  const handleDragStop = (id: string, e: any, data: { x: number, y: number }) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, x: data.x, y: data.y } : el
    ));
  };

  // Get the currently selected element for the editor
  const activeElement = selectedElement 
    ? elements.find(el => el.id === selectedElement) 
    : null;

  // Style for text alignment
  const getTextAlignStyle = (alignment?: string) => {
    switch(alignment) {
      case 'center': return { textAlign: 'center' as const, width: '100%' };
      case 'right': return { textAlign: 'right' as const, width: '100%' };
      default: return { textAlign: 'left' as const };
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Text Settings</h1>
        <p className="text-gray-500 mt-1">Design and position text elements on your certificate</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4 flex-wrap gap-2">
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => handleAddElement("static")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Static Text
                  </Button>
                  <Button onClick={() => handleAddElement("dynamic")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Dynamic Field
                  </Button>
                </div>
                
                <Select
                  onValueChange={(value) => handleAddPresetElement(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add preset text" />
                  </SelectTrigger>
                  <SelectContent>
                    {textPresets.map(preset => (
                      <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div 
                ref={canvasRef}
                className="certificate-canvas bg-white rounded-lg border border-gray-300"
                style={{ 
                  width: "100%", 
                  height: "500px",
                  backgroundImage: templateImage ? `url(${templateImage})` : "none",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative"
                }}
                onClick={() => setSelectedElement(null)}
              >
                {!templateImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No template selected. Please upload a template first.
                  </div>
                )}
                
                {elements.map(element => (
                  <Draggable
                    key={element.id}
                    defaultPosition={{ x: element.x, y: element.y }}
                    onStop={(e, data) => handleDragStop(element.id, e, data)}
                    bounds="parent"
                  >
                    <div
                      className={`text-element cursor-move ${selectedElement === element.id ? 'ring-2 ring-certigen-blue p-1' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementSelect(element.id);
                      }}
                      style={{
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        color: element.color,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        position: 'absolute',
                        ...getTextAlignStyle(element.alignment)
                      }}
                    >
                      {element.content}
                    </div>
                  </Draggable>
                ))}
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                Click and drag to position text elements on the certificate
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Text Properties</h3>
              
              {!activeElement ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No text element selected</p>
                  <p className="text-sm mt-1">Select an element from the canvas or add a new one</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Content</label>
                    {activeElement.type === "static" ? (
                      <Input 
                        value={activeElement.content}
                        onChange={(e) => handlePropertyChange("content", e.target.value)}
                        placeholder="Enter text content"
                      />
                    ) : (
                      <Select
                        value={activeElement.dynamicField}
                        onValueChange={(value) => {
                          handlePropertyChange("dynamicField", value);
                          let newContent = "[Recipient Name]";
                          if (value === "description") newContent = "[Description]";
                          if (value === "date") newContent = "[Current Date]";
                          handlePropertyChange("content", newContent);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Recipient Name</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="date">Current Date</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Font Family</label>
                    <Select
                      value={activeElement.fontFamily}
                      onValueChange={(value) => handlePropertyChange("fontFamily", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map(font => (
                          <SelectItem 
                            key={font.value} 
                            value={font.value}
                            style={{ fontFamily: font.value }}
                          >
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Font Size</label>
                    <Select
                      value={activeElement.fontSize.toString()}
                      onValueChange={(value) => handlePropertyChange("fontSize", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map(size => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={activeElement.color}
                        onChange={(e) => handlePropertyChange("color", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        type="text"
                        value={activeElement.color}
                        onChange={(e) => handlePropertyChange("color", e.target.value)}
                        className="flex-1 ml-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Alignment</label>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant={activeElement.alignment === "left" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePropertyChange("alignment", "left")}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant={activeElement.alignment === "center" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePropertyChange("alignment", "center")}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant={activeElement.alignment === "right" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePropertyChange("alignment", "right")}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Style</label>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant={activeElement.fontWeight === "bold" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePropertyChange("fontWeight", activeElement.fontWeight === "bold" ? "normal" : "bold")}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant={activeElement.fontStyle === "italic" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePropertyChange("fontStyle", activeElement.fontStyle === "italic" ? "normal" : "italic")}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleElementDelete(activeElement.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Element
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <a href="/export">Next: Generate Certificates</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
