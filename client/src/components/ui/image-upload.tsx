import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (url: string | null) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ imageUrl, onImageChange, className, label = "Product Image" }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For simplicity, we're just using a FileReader to create a data URL
    // In a real application, you'd upload the file to a server or a storage service
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url || null);
    onImageChange(url || null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="image">{label}</Label>
      
      {previewUrl ? (
        <div className="relative border rounded-md overflow-hidden h-64 bg-muted/20">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain" 
            onError={() => setPreviewUrl(null)}
          />
          <Button 
            size="icon" 
            variant="destructive" 
            className="absolute top-2 right-2 w-8 h-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="border border-dashed rounded-md h-64 flex flex-col items-center justify-center cursor-pointer bg-muted/5 hover:bg-muted/10 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload an image</p>
          <p className="text-xs text-muted-foreground mt-1">or paste an image URL below</p>
        </div>
      )}
      
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Input 
          id="imageUrl" 
          placeholder="Or enter image URL here" 
          value={previewUrl || ""} 
          onChange={handleUrlChange}
          className="flex-1"
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex gap-1 items-center"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
      
      <Input 
        ref={fileInputRef}
        type="file" 
        id="image" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  );
}