import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ScanLine, X } from "lucide-react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

// Type for barcode data
interface BarcodeData {
  name?: string;
  category?: string;
  quantity?: string;
  unit?: string;
}

interface BarcodeScannerProps {
  onBarcodeDetected: (data: BarcodeData) => void;
}

export const BarcodeScanner = ({ onBarcodeDetected }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const handleScan = useCallback((err: any, result: any) => {
    if (result) {
      try {
        // Try to parse the barcode data
        // In a real app, you might have a specific format or API call here
        // This is a simple example that assumes the barcode contains a JSON string
        const barcodeText = result.text;
        console.log("Barcode detected:", barcodeText);
        
        try {
          // First attempt to parse as JSON
          const jsonData = JSON.parse(barcodeText);
          onBarcodeDetected(jsonData);
          setIsOpen(false);
          setIsScanning(false);
        } catch (e) {
          // If not JSON, try to parse structured text format
          // Example format: "NAME:Cascade Hops|CATEGORY:Hops|QUANTITY:5|UNIT:kg"
          const data: BarcodeData = {};
          const parts = barcodeText.split('|');
          
          parts.forEach((part: string) => {
            const [key, value] = part.split(':');
            if (key && value) {
              const lowerKey = key.toLowerCase();
              if (lowerKey === 'name') data.name = value;
              if (lowerKey === 'category') data.category = value;
              if (lowerKey === 'quantity') data.quantity = value;
              if (lowerKey === 'unit') data.unit = value;
            }
          });
          
          if (data.name) {
            onBarcodeDetected(data);
            setIsOpen(false);
            setIsScanning(false);
          } else {
            // If all else fails, just use the barcode as the name
            onBarcodeDetected({ name: barcodeText });
            setIsOpen(false);
            setIsScanning(false);
          }
        }
      } catch (err) {
        console.error("Error parsing barcode:", err);
        setError("Couldn't read barcode format");
      }
    }
    if (err) {
      console.error("Scanner error:", err);
    }
  }, [onBarcodeDetected]);

  const handleError = (err: any) => {
    console.error(err);
    setError("Camera access denied or not available");
  };

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <ScanLine className="mr-2 h-4 w-4" />
          Scan Barcode
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Item Barcode</DialogTitle>
          <DialogDescription>
            Position the barcode within the scanner area.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          {!isScanning ? (
            <div className="flex flex-col items-center p-4">
              {error && <p className="text-destructive mb-4">{error}</p>}
              <Button onClick={startScanning}>
                Start Scanner
              </Button>
            </div>
          ) : (
            <div className="relative w-full max-w-sm" ref={scannerRef}>
              <div className="relative overflow-hidden rounded-lg border border-border">
                <BarcodeScannerComponent
                  width="100%"
                  height={300}
                  onUpdate={handleScan}
                  onError={handleError}
                  facingMode="environment"
                />
                <div className="absolute inset-0 border-2 border-dashed border-primary-light pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary-light/50"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary-light/50"></div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 rounded-full bg-background/80"
                onClick={stopScanning}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {isScanning ? "Scanning..." : "Ready to scan"}
          </p>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;