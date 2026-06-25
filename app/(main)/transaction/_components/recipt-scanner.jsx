"use client";

import { useRef, useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedResult,
    error: scanError,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image");
      return;
    }

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('file', file);
      await scanReceiptFn(formData);
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Failed to scan receipt. Please enter details manually.");
      setIsSupported(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle scan results
  useEffect(() => {
    if (scannedResult && !scanReceiptLoading) {
      if (scannedResult.success && scannedResult.data) {
        // Call the callback directly without memoization
        if (onScanComplete) {
          onScanComplete(scannedResult.data);
        }
        toast.success("Receipt scanned successfully!");
      } else {
        const errorMessage = scannedResult.error || "Failed to scan receipt";
        toast.error(errorMessage);
        
        // If API is not configured, disable the feature
        if (errorMessage.includes("not configured")) {
          setIsSupported(false);
        }
      }
    }
  }, [scannedResult, scanReceiptLoading]); // Removed onScanComplete from dependencies

  // Handle scan errors
  useEffect(() => {
    if (scanError) {
      console.error("Scan error:", scanError);
      toast.error("Failed to scan receipt. Please enter details manually.");
      setIsSupported(false);
    }
  }, [scanError]);

  // Don't render if AI scanning is not supported
  if (!isSupported) {
    return null;
  }

  const isLoading = scanReceiptLoading || isProcessing;

  return (
    <div className="glass-panel border border-white/10 hover:border-purple-500/30 rounded-2xl overflow-hidden shadow-lg p-6 relative group transition-all duration-300">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleReceiptScan(file);
            e.target.value = '';
          }
        }}
      />
      {isLoading ? (
        <div className="relative flex flex-col items-center justify-center py-6 text-center">
          <div className="scanner-laser" />
          <Loader2 className="h-10 w-10 text-purple-400 animate-spin mb-4" />
          <h4 className="text-base font-bold text-white uppercase tracking-wider animate-pulse-glow">
            Scanning Receipt with AI
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Analyzing items, merchant names, amounts, and dates...
          </p>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="flex flex-col items-center justify-center py-6 text-center cursor-pointer group-hover:bg-purple-500/[0.02] rounded-xl transition-all"
        >
          <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 group-hover:border-purple-500/40 rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-105 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <Camera className="h-6 w-6 text-purple-400 group-hover:text-pink-400 transition-colors" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
            AI Receipt Scanning Terminal
          </h4>
          <p className="text-xs text-gray-400 mt-2 max-w-sm">
            Tap here to snap or upload a receipt. Gemini will automatically extract amount, date, category and merchant details!
          </p>
        </div>
      )}
    </div>
  );
}
