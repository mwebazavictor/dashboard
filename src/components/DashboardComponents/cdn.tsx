"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Code2 } from "lucide-react";

export default function CopyBox({ text = "<script> This is the link </script>" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-xl">
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Code2 className="h-5 w-5 text-gray-500" />
        <Input 
          value={text} 
          readOnly 
          className="font-mono text-sm bg-white" 
        />
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleCopy}
          className="hover:bg-gray-100"
        >
          {copied ? 
            <Check className="h-4 w-4 text-green-500" /> : 
            <Copy className="h-4 w-4 text-gray-500" />
          }
        </Button>
      </div>
      {copied && (
        <div className="text-sm text-green-600 flex items-center justify-center">
          <Check className="h-4 w-4 mr-2" /> Copied to clipboard!
        </div>
      )}
    </div>
  );
}
