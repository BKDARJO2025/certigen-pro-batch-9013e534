
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface FontUploaderProps {
  onFontUploaded: (fontName: string, fontFamily: string) => void;
}

const FontUploader = ({ onFontUploaded }: FontUploaderProps) => {
  const [fontName, setFontName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fontName.trim()) {
      toast.error("Please enter a font name");
      return;
    }
    
    if (!fileInputRef.current?.files?.length) {
      toast.error("Please select a font file");
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf') && !file.name.endsWith('.woff') && !file.name.endsWith('.woff2')) {
      toast.error("Please upload a valid font file (.ttf, .otf, .woff, or .woff2)");
      return;
    }
    
    setUploading(true);
    
    try {
      // Read the font as a data URL
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = () => {
        const fontData = reader.result as string;
        
        // Create a style element to inject the font
        const style = document.createElement('style');
        const fontFamily = `custom-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
        
        style.textContent = `
          @font-face {
            font-family: '${fontFamily}';
            src: url('${fontData}') format('${getFontFormat(file.name)}');
            font-weight: normal;
            font-style: normal;
          }
        `;
        
        // Inject the font into the document head
        document.head.appendChild(style);
        
        // Store font data in local storage
        localStorage.setItem(`lovable.dev.font.${fontFamily}`, fontData);
        
        // Notify parent component
        onFontUploaded(fontName, fontFamily);
        
        // Reset form
        setFontName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        setUploading(false);
      };
      
      reader.onerror = () => {
        toast.error("Error reading the font file");
        setUploading(false);
      };
    } catch (error) {
      console.error("Font upload error:", error);
      toast.error("Failed to upload font");
      setUploading(false);
    }
  };
  
  const getFontFormat = (filename: string): string => {
    if (filename.endsWith('.ttf')) return 'truetype';
    if (filename.endsWith('.otf')) return 'opentype';
    if (filename.endsWith('.woff')) return 'woff';
    if (filename.endsWith('.woff2')) return 'woff2';
    return 'truetype'; // fallback
  };
  
  return (
    <form onSubmit={handleUpload} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="font-name">Font Name</Label>
        <Input
          id="font-name"
          value={fontName}
          onChange={(e) => setFontName(e.target.value)}
          placeholder="e.g., My Custom Font"
          disabled={uploading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="font-file">Font File (.ttf, .otf, .woff, .woff2)</Label>
        <Input
          id="font-file"
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          ref={fileInputRef}
          disabled={uploading}
        />
      </div>
      
      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? (
          <span>Uploading...</span>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Font
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-500 mt-2">
        Note: Uploaded fonts are stored in your browser's local storage and will only be available on this device.
      </p>
    </form>
  );
};

export default FontUploader;
