import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Circle } from 'lucide-react';
import { ChromePicker } from 'react-color';
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal";

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
}

const defaultFont = "Arial";

export default function TextSettingsPage() {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elementText, setElementText] = useState<string>("");
  const [elementX, setElementX] = useState<number>(50);
  const [elementY, setElementY] = useState<number>(50);
  const [elementFontSize, setElementFontSize] = useState<number>(16);
  const [elementFontColor, setElementFontColor] = useState<string>("#000000");
  const [elementFontFamily, setElementFontFamily] = useState<string>(defaultFont);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    toast.success("New text element added");
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
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setElementText(e.target.value);
    updateElementProperty(selectedElementId, "text", e.target.value);
  };

  const handleXChange = (value: number) => {
    setElementX(value);
    updateElementProperty(selectedElementId, "x", value);
  };

  const handleYChange = (value: number) => {
    setElementY(value);
    updateElementProperty(selectedElementId, "y", value);
  };

  const handleFontSizeChange = (value: number) => {
    setElementFontSize(value);
    updateElementProperty(selectedElementId, "fontSize", value);
  };

  const handleFontColorChange = (color: string) => {
    setElementFontColor(color);
    updateElementProperty(selectedElementId, "fontColor", color);
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    setElementFontFamily(fontFamily);
    updateElementProperty(selectedElementId, "fontFamily", fontFamily);
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Text Settings</h1>
        <p className="text-gray-500 mt-1">Customize the text elements on your certificate template</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Label htmlFor="text">Text</Label>
                <Textarea
                  id="text"
                  placeholder="Enter text"
                  value={elementText}
                  onChange={handleTextChange}
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <Label>Position</Label>
                <div className="flex items-center space-x-4 mt-1">
                  <div>
                    <Label htmlFor="x">X:</Label>
                    <Slider
                      id="x"
                      defaultValue={[elementX]}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleXChange(value[0])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="y">Y:</Label>
                    <Slider
                      id="y"
                      defaultValue={[elementY]}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleYChange(value[0])}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="fontSize">Font Size</Label>
                <Slider
                  id="fontSize"
                  defaultValue={[elementFontSize]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleFontSizeChange(value[0])}
                />
              </div>

              <div className="mb-4">
                <Label>Font Color</Label>
                <div className="flex items-center space-x-4 mt-1">
                  <Circle size={24} color={elementFontColor} className="shadow" />
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
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <Input
                      id="fontFamily"
                      value={elementFontFamily}
                      className="cursor-pointer"
                      readOnly
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select Font</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleFontFamilyChange("Arial")}>Arial</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFontFamilyChange("Helvetica")}>Helvetica</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFontFamilyChange("Times New Roman")}>Times New Roman</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleFontFamilyChange(defaultFont)}>Default Font</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Text Elements</h2>
            <p className="text-gray-500">Manage and select text elements to customize</p>
            <Button onClick={handleAddTextElement} className="mt-4">Add Text Element</Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <ul>
                {textElements.map(element => (
                  <li
                    key={element.id}
                    className={`py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 ${selectedElementId === element.id ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSelectElement(element.id)}
                  >
                    {element.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button onClick={handleNextClick}>
        Next: Generate Template
      </Button>
      
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
