
import { useState, useEffect, useRef } from "react";
import DraggableResizableText from "@/components/DraggableResizableText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Circle, MoveHorizontal, MoveVertical, Type, Users, Upload } from 'lucide-react';
import { ChromePicker } from 'react-color';
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Switch } from "@/components/ui/switch";
import FontUploader from "@/components/FontUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CertificateCanvas from "@/components/CertificateCanvas";
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TextElement } from '@/types';



const defaultFont = "Arial";

// Daftar font default dan kustom
const defaultFonts = [
  { name: "Arial", family: "Arial, sans-serif" },
  { name: "Helvetica", family: "Helvetica, sans-serif" },
  { name: "Times New Roman", family: "Times New Roman, serif" },
  { name: "Courier New", family: "Courier New, monospace" },
  { name: "Georgia", family: "Georgia, serif" },
  { name: "Poppins", family: "Poppins, sans-serif" },
  { name: "Magnolia Script", family: "Magnolia Script, cursive" },
  { name: "Celandine", family: "Celandine, cursive" },
];

export default function TextSettingsPage() {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elementText, setElementText] = useState<string>("");
  const [elementX, setElementX] = useState<number>(50);
  const [elementY, setElementY] = useState<number>(50);
  const [elementFontSize, setElementFontSize] = useState<number>(16);
  const [elementFontColor, setElementFontColor] = useState<string>("#000000");
  const [elementFontFamily, setElementFontFamily] = useState<string>(defaultFont);
  const [elementTextAlign, setElementTextAlign] = useState<CanvasTextAlign>('left');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [uploadedFonts, setUploadedFonts] = useState<{ name: string, family: string }[]>([]);
  const [showFontUploader, setShowFontUploader] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user uploaded fonts if any
    const storedFonts = localStorage.getItem("lovable.dev.uploadedFonts");
    if (storedFonts) {
      setUploadedFonts(JSON.parse(storedFonts));
    }

    // Load the selected template from localStorage
    const template = localStorage.getItem("lovable.dev.currentTemplate");
    if (template) {
      setTemplateImage(template);
    }

    const storedElements = localStorage.getItem("lovable.dev.textElements");
    if (storedElements) {
      setTextElements(JSON.parse(storedElements));
    } else {
      // Initialize with a default text element
      const initialElement: TextElement = {
        id: `text-${Date.now()}`,
        text: "Sample Text",
        x: 50,
        y: 50,
        fontSize: 24,
        fontColor: "#000000",
        fontFamily: defaultFont,
        width: 200,
        height: 40,
        textAlign: 'left'
      };
      setTextElements([initialElement]);
      localStorage.setItem("lovable.dev.textElements", JSON.stringify([initialElement]));
      setSelectedElementId(initialElement.id);
      setElementText(initialElement.text);
      setElementX(initialElement.x);
      setElementY(initialElement.y);
      setElementFontSize(initialElement.fontSize);
      setElementFontColor(initialElement.fontColor);
      setElementFontFamily(initialElement.fontFamily);
    }
  }, []);

  useEffect(() => {
    // Update selected element state when selectedElementId changes
    if (selectedElementId) {
      const selectedElement = textElements.find(element => element.id === selectedElementId);
      if (selectedElement) {
        setElementText(selectedElement.text);
        setElementX(selectedElement.x);
        setElementY(selectedElement.y);
        setElementFontSize(selectedElement.fontSize);
        setElementFontColor(selectedElement.fontColor);
        setElementFontFamily(selectedElement.fontFamily);
      }
    }
  }, [selectedElementId, textElements]);

  const handleAddTextElement = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      text: "New Text",
      x: 50,
      y: 50,
      fontSize: 24,
      fontColor: "#000000",
      fontFamily: defaultFont,
      width: 200,
      height: 40,
      textAlign: 'left'
    };

    const updatedElements = [...textElements, newElement];
    setTextElements(updatedElements);
    localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
    setSelectedElementId(newElement.id);
    setElementText(newElement.text);
    setElementX(newElement.x);
    setElementY(newElement.y);
    setElementFontSize(newElement.fontSize);
    setElementFontColor(newElement.fontColor);
    setElementFontFamily(newElement.fontFamily);
    toast({
      title: "Success",
      description: "Text element added",
    });
  };

  const handleSelectElement = (id: string) => {
    setSelectedElementId(id);
    const selectedElement = textElements.find(element => element.id === id);
    if (selectedElement) {
      setElementText(selectedElement.text);
      setElementX(selectedElement.x);
      setElementY(selectedElement.y);
      setElementFontSize(selectedElement.fontSize);
      setElementFontColor(selectedElement.fontColor);
      setElementFontFamily(selectedElement.fontFamily);
      setElementTextAlign(selectedElement.textAlign);
    }
  };

  const handleRemoveElement = (id: string) => {
    const updatedElements = textElements.filter(element => element.id !== id);
    setTextElements(updatedElements);
    localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
    
    if (selectedElementId === id) {
      setSelectedElementId(updatedElements.length > 0 ? updatedElements[0].id : null);
    }
    toast({
      title: "Success",
      description: "Text element removed",
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setElementText(e.target.value);
    if (isBulkEdit) {
      // Update all text elements
      const updatedElements = textElements.map(element => ({
        ...element,
        text: e.target.value
      }));
      setTextElements(updatedElements);
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
    } else {
      // Update only selected element
      updateElementProperty(selectedElementId, "text", e.target.value);
    }
  };

  const handleFontSizeChange = (value: number) => {
    setElementFontSize(value);
    if (isBulkEdit) {
      // Update all text elements
      const updatedElements = textElements.map(element => ({
        ...element,
        fontSize: value
      }));
      setTextElements(updatedElements);
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
    } else {
      // Update only selected element
      updateElementProperty(selectedElementId, "fontSize", value);
    }
  };

  const handleFontColorChange = (color: string) => {
    setElementFontColor(color);
    if (isBulkEdit) {
      // Update all text elements
      const updatedElements = textElements.map(element => ({
        ...element,
        fontColor: color
      }));
      setTextElements(updatedElements);
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
    } else {
      // Update only selected element
      updateElementProperty(selectedElementId, "fontColor", color);
    }
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    setElementFontFamily(fontFamily);
    if (isBulkEdit) {
      // Update all text elements
      const updatedElements = textElements.map(element => ({
        ...element,
        fontFamily: fontFamily
      }));
      setTextElements(updatedElements);
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
    } else {
      // Update only selected element
      updateElementProperty(selectedElementId, "fontFamily", fontFamily);
    }
  };

  const handleTextAlignChange = (align: CanvasTextAlign) => {
    setElementTextAlign(align);
    if (isBulkEdit) {
      // Update all text elements
      const updatedElements = textElements.map(element => ({
        ...element,
        textAlign: align
      }));
      setTextElements(updatedElements);
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
    } else {
      // Update only selected element
      updateElementProperty(selectedElementId, "textAlign", align);
    }
  };

  const updateElementProperty = (id: string | null, property: string, value: any) => {
    if (!id) return;

    setTextElements(prevElements => {
      const updatedElements = prevElements.map(element => {
        if (element.id === id) {
          return { ...element, [property]: value };
        }
        return element;
      });
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(updatedElements));
      return updatedElements;
    });
  };

  const handleColorPickerToggle = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChangeComplete = (color: any) => {
    handleFontColorChange(color.hex);
    setShowColorPicker(false);
  };

  const handleNextClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmGeneration = () => {
    setIsConfirmModalOpen(false);
    navigate("/export");
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return; // Only left mouse button
    
    setIsDragging(true);
    setSelectedElementId(elementId);
    
    const canvas = e.currentTarget.closest('.template-canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setDragStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId) return;
    
    const canvas = e.currentTarget.closest('.template-canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      updateElementProperty(selectedElementId, "x", Math.max(0, Math.min(100, x)));
      updateElementProperty(selectedElementId, "y", Math.max(0, Math.min(100, y)));
      
      setElementX(Math.max(0, Math.min(100, x)));
      setElementY(Math.max(0, Math.min(100, y)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      // Add global mouse up and mouse move handlers
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!isDragging || !selectedElementId) return;
        
        const canvas = document.querySelector('.template-canvas');
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          updateElementProperty(selectedElementId, "x", Math.max(0, Math.min(100, x)));
          updateElementProperty(selectedElementId, "y", Math.max(0, Math.min(100, y)));
          
          setElementX(Math.max(0, Math.min(100, x)));
          setElementY(Math.max(0, Math.min(100, y)));
        }
      };
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, selectedElementId]);

  const getTextElementStyle = (element: TextElement) => {
    // Find the font family definition
    const allFonts = [...defaultFonts, ...uploadedFonts];
    const fontDef = allFonts.find(f => f.name === element.fontFamily);
    const fontFamily = fontDef ? fontDef.family : element.fontFamily;

    return {
      position: 'absolute' as 'absolute',
      left: `${element.x}%`,
      top: `${element.y}%`,
      fontSize: `${element.fontSize}px`,
      color: element.fontColor,
      fontFamily: fontFamily,
      transform: 'translate(-50%, -50%)',
      cursor: isDragging && selectedElementId === element.id ? 'grabbing' : 'grab',
      userSelect: 'none' as 'none',
      padding: '4px',
      borderRadius: '4px',
      textAlign: element.textAlign
    };
  };

  const moveElement = (direction: 'up' | 'down' | 'left' | 'right', amount: number = 1) => {
    if (!selectedElementId) return;

    let newX = elementX;
    let newY = elementY;

    switch (direction) {
      case 'up':
        newY = Math.max(0, elementY - amount);
        break;
      case 'down':
        newY = Math.min(100, elementY + amount);
        break;
      case 'left':
        newX = Math.max(0, elementX - amount);
        break;
      case 'right':
        newX = Math.min(100, elementX + amount);
        break;
    }

    setElementX(newX);
    setElementY(newY);
    updateElementProperty(selectedElementId, "x", newX);
    updateElementProperty(selectedElementId, "y", newY);
  };

  const handleFontUpload = (fontName: string, fontFamily: string) => {
    const newFont = { name: fontName, family: fontFamily };
    const updatedFonts = [...uploadedFonts, newFont];
    setUploadedFonts(updatedFonts);
    localStorage.setItem("lovable.dev.uploadedFonts", JSON.stringify(updatedFonts));
    toast({
      title: "Success",
      description: `Font "${fontName}" successfully uploaded`,
    });
    setShowFontUploader(false);
  };

  const handleSaveComplete = () => {
    // Save current template and text elements as the complete template
    if (templateImage) {
      localStorage.setItem("lovable.dev.savedTemplate", templateImage);
      localStorage.setItem("lovable.dev.savedTextElements", JSON.stringify(textElements));
      localStorage.setItem("lovable.dev.textElements", JSON.stringify(textElements));
      toast({
        title: "Success",
        description: "Template saved as complete template",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Text Settings</h1>
        <p className="text-gray-500 mt-1">Customize the text elements on your certificate template</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Text Properties</h2>
            <div className="flex items-center space-x-2">
              <Label htmlFor="bulk-edit" className="text-sm">Bulk Edit</Label>
              <Switch 
                id="bulk-edit" 
                checked={isBulkEdit} 
                onCheckedChange={setIsBulkEdit}
              />
            </div>
          </div>

          {selectedElementId || isBulkEdit ? (
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <Label htmlFor="text">Text</Label>
                  <Textarea
                    id="text"
                    value={elementText}
                    onChange={handleTextChange}
                    className="w-full min-h-[40px] resize-x min-w-[120px] max-w-full"
                    style={{overflowWrap: 'break-word', wordBreak: 'break-word'}}
                    rows={2}
                    placeholder="Enter text..."
                  />
                </div>
                <div className="space-y-4">
                  {/* Text Alignment */}
                  <div className="space-y-2">
                    <Label>Text Alignment</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={elementTextAlign === 'left' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => {
                          setElementTextAlign('left');
                          updateElementProperty(selectedElementId, 'textAlign', 'left');
                        }}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={elementTextAlign === 'center' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => {
                          setElementTextAlign('center');
                          updateElementProperty(selectedElementId, 'textAlign', 'center');
                        }}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={elementTextAlign === 'right' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => {
                          setElementTextAlign('right');
                          updateElementProperty(selectedElementId, 'textAlign', 'right');
                        }}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" onClick={() => moveElement('down')} className="flex items-center justify-center">
                      <MoveVertical className="mr-2 h-4 w-4 transform rotate-180" />
                      Move Down
                    </Button>
                    <Button variant="outline" onClick={() => moveElement('left')} className="flex items-center justify-center">
                      <MoveHorizontal className="mr-2 h-4 w-4 transform -scale-x-100" />
                      Move Left
                    </Button>
                    <Button variant="outline" onClick={() => moveElement('right')} className="flex items-center justify-center">
                      <MoveHorizontal className="mr-2 h-4 w-4" />
                      Move Right
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Tip: Drag text elements directly on the template to position them precisely</p>
                </div>

                <div className="mb-4">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="fontSize"
                      defaultValue={[elementFontSize]}
                      value={[elementFontSize]}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleFontSizeChange(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-10 text-right">{elementFontSize}px</span>
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Font Color</Label>
                  <div className="flex items-center space-x-4 mt-1">
                    <Circle size={24} fill={elementFontColor} color={elementFontColor} className="shadow" />
                    <Button variant="outline" onClick={handleColorPickerToggle}>
                      Pick Color
                    </Button>
                    {showColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <ChromePicker color={elementFontColor} onChangeComplete={handleColorChangeComplete} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full">
                        <Input
                          id="fontFamily"
                          value={elementFontFamily}
                          className="cursor-pointer"
                          readOnly
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-56 overflow-y-auto">
                        <DropdownMenuLabel>Select Font</DropdownMenuLabel>
                        
                        {/* Default Fonts Group */}
                        <DropdownMenuLabel className="text-xs text-gray-500">Default Fonts</DropdownMenuLabel>
                        {defaultFonts.map(font => (
                          <DropdownMenuItem 
                            key={font.name}
                            onClick={() => handleFontFamilyChange(font.name)}
                            className="cursor-pointer"
                            style={{ fontFamily: font.family }}
                          >
                            {font.name}
                          </DropdownMenuItem>
                        ))}
                        
                        {uploadedFonts.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs text-gray-500">Uploaded Fonts</DropdownMenuLabel>
                            {uploadedFonts.map(font => (
                              <DropdownMenuItem 
                                key={font.name}
                                onClick={() => handleFontFamilyChange(font.name)}
                                className="cursor-pointer"
                                style={{ fontFamily: font.family }}
                              >
                                {font.name}
                              </DropdownMenuItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Dialog open={showFontUploader} onOpenChange={setShowFontUploader}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Custom Font</DialogTitle>
                        </DialogHeader>
                        <FontUploader onFontUploaded={handleFontUpload} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <Type className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Select a text element to edit its properties</p>
              <Button onClick={handleAddTextElement} className="mt-4">Add New Text Element</Button>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Text Elements</h2>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Manage and select text elements to customize</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleAddTextElement} 
                className="flex items-center"
              >
                <Type className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>
            <Card>
              <CardContent className="p-3">
                {textElements.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {textElements.map(element => (
                      <li
                        key={element.id}
                        className={`py-2 px-3 rounded-md flex items-center justify-between hover:bg-gray-50 ${selectedElementId === element.id ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
                      >
                        <div 
                          className="flex-1 cursor-pointer truncate pr-2" 
                          onClick={() => handleSelectElement(element.id)}
                        >
                          {element.text || "Empty text"}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveElement(element.id)}
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                        >
                          <Circle className="h-4 w-4" fill="red" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-gray-500 text-sm">No text elements added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Template Preview</h2>
            {!templateImage ? (
              <div className="bg-gray-100 p-8 text-center">
                <p className="text-gray-500">No template selected. Please go back and select a template first.</p>
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => navigate('/templates')}
                  >
                    Select Template
                  </Button>
                  <Button
                    variant="default"
                    className="flex items-center"
                    onClick={handleSaveComplete}
                  >
                    Save Template
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mx-auto rounded-lg shadow max-w-full relative">
                <div className="relative" ref={canvasRef}>
                  <div className="relative w-full aspect-[1.414] mx-auto">
                    <CertificateCanvas
                      templateUrl={templateImage}
                      name="Preview"
                      textElements={textElements}
                      onTextClick={handleSelectElement}
                      onTextMove={(id, x, y) => {
                        updateElementProperty(id, 'x', x);
                        updateElementProperty(id, 'y', y);
                      }}
                      onTextResize={(id, width, height) => {
                        updateElementProperty(id, 'width', width);
                        updateElementProperty(id, 'height', height);
                      }}
                      selectedElementId={selectedElementId}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>Click and drag text elements to position them on the template. Use the controls to make fine adjustments.</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                    <span>Add text elements using the "Add New" button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                    <span>Edit text content and appearance in the Text Properties panel</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                    <span>Position text by dragging it directly on the template</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                    <span>Use the move buttons for precise positioning adjustments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">5</span>
                    <span>Toggle "Bulk Edit" to apply changes to all text elements at once</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">6</span>
                    <span>Upload custom fonts using the upload button next to font selector</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/templates')}>
          Back to Templates
        </Button>
        <div className="flex gap-2">
          <Button variant="default" onClick={handleSaveComplete}>
            Save Complete Template
          </Button>
          <Button onClick={() => navigate('/certificate-preview')}>
            Preview
          </Button>
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
