"use client";
// Types
interface Agent {
  _id: string;
  name: string;
  title: string;
  description: string;
  avatar?: string;
  company_id: string;
  agent_id: string;
}

interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Custom hooks
import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { useVirtualizer } from '@tanstack/react-virtual';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  BriefcaseBusiness, 
  Upload, 
  Eye,
  AlertCircle,
  Wrench,
  Loader2, 
  CirclePlus
} from "lucide-react";
import { getPurchasedAgents, uploadDocument } from "@/services/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import QueryTable from "@/components/DashboardComponents/ManageTable";

// Custom hook for file handling
const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: 'idle'
  });

  const handleFileChange = useCallback((file: File) => {
    setFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }, []);

  const resetUpload = useCallback(() => {
    setFile(null);
    setPreviewUrl("");
    setUploadState({ progress: 0, status: 'idle' });
  }, []);

  return { file, previewUrl, uploadState, setUploadState, handleFileChange, resetUpload };
};

// Agent Card Component
const AgentCard = ({ agent, onTrain }: { agent: Agent; onTrain: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="group border border-zinc-200 hover:border-zinc-300 transition-all duration-200 hover:shadow-md bg-white">
      <CardHeader className="p-4 border-b border-zinc-200">
      <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-10 w-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-base">
                  {agent.name.charAt(0)}
                </span>
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-medium text-zinc-900 text-base group-hover:text-zinc-700 transition-colors">
                {agent.name}
              </span>
              <span className="text-xs text-zinc-500">
                {agent.title}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-zinc-600 max-w-xs line-clamp-2 text-sm">
              {agent.description}
            </p>
            
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-row space-x-5 ">
        <Button
              onClick={onTrain}
              className="bg-zinc-900 hover:bg-zinc-800 text-white transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 text-sm px-3 py-1"
            >
              <BriefcaseBusiness className="h-3 w-3 mr-1" />
              Train
            </Button>
            <Dialog>
              <DialogTrigger>
                <Button className="bg-zinc-900 hover:bg-zinc-800 text-white transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 text-sm px-3 py-1">
                  <Wrench className="h-3 w-3 mr-1" />
                  Manage Queries
                </Button>
              </DialogTrigger>
              <DialogContent>
                <QueryTable purchasedAgentId={agent._id} // Change to agent.purchased_agent_id if available
          token={Cookies.get("accessToken") || ""}
          companyId={agent.company_id}
          agentId = {agent.agent_id} />
              </DialogContent>
            </Dialog>
          
      </CardContent>
    </Card>
  </motion.div>
);


// Upload Dialog Component
const UploadDialog = ({
  isOpen,
  onClose,
  onUpload
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}) => {
  const {
    file,
    previewUrl,
    uploadState,
    setUploadState,
    handleFileChange,
    resetUpload
  } = useFileUpload();
  const [dialogStep, setDialogStep] = useState<'upload' | 'preview'>('upload');
  const [hasConsented, setHasConsented] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag and drop
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      handleFileChange(droppedFile);
    } else {
      toast.error('Please upload a PDF file');
    }
  }, [handleFileChange]);

  const handleClose = useCallback(() => {
    resetUpload();
    setDialogStep('upload');
    setHasConsented(false);
    onClose();
  }, [onClose, resetUpload]);

  const handleUpload = async () => {
    if (!file || !hasConsented) return;
    
    try {
      setUploadState({ progress: 0, status: 'uploading' });
      await onUpload(file);
      setUploadState({ progress: 100, status: 'success' });
      toast.success('Document uploaded successfully');
      handleClose();
    } catch (error) {
      setUploadState({ 
        progress: 0, 
        status: 'error', 
        error: 'Upload failed. Please try again.' 
      });
      toast.error('Upload failed. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {dialogStep === 'upload' ? 'Upload Document' : 'Preview Document'}
          </DialogTitle>
          <DialogDescription>
            {dialogStep === 'upload' 
              ? 'Select a PDF file to upload'
              : 'Review your document before uploading'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {dialogStep === 'upload' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="relative"
              >
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-zinc-500" />
                    <p className="mb-2 text-sm text-zinc-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-zinc-500">PDF files only (max 10MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) handleFileChange(selectedFile);
                    }}
                  />
                </label>
                {uploadState.status === 'error' && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {uploadState.error}
                  </div>
                )}
              </div>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button 
                    onClick={() => setDialogStep('preview')}
                    className="w-full bg-zinc-900 hover:bg-zinc-800"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Document
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-96"
                  title="PDF Preview"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={hasConsented}
                  onCheckedChange={(checked) => setHasConsented(checked as boolean)}
                />
                <label 
                  htmlFor="consent" 
                  className="text-sm text-zinc-600"
                >
                  I confirm this is the correct document to upload
                </label>
              </div>
              {uploadState.status === 'uploading' && (
                <div className="space-y-2">
                  <Progress value={uploadState.progress} />
                  <p className="text-sm text-zinc-500 text-center">
                    Uploading... {uploadState.progress}%
                  </p>
                </div>
              )}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDialogStep('upload')}
                  className="flex-1"
                  disabled={uploadState.status === 'uploading'}
                >
                  Back
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!hasConsented || uploadState.status === 'uploading'}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300"
                >
                  {uploadState.status === 'uploading' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function AgentsOwned() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);
  
  // Virtual list for performance
  const rowVirtualizer = useVirtualizer({
    count: agents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5
  });

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("accessToken") ?? "";
      const info = Cookies.get("loggedUserInfo");
      if (!info) throw new Error("User is not logged in");
      
      const parsedInfo = JSON.parse(info);
      const data = await getPurchasedAgents(parsedInfo.Company_id, accessToken);
      setAgents(data.purchasedAgents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error Occurred");
      toast.error("Failed to load agents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleUpload = async (file: File) => {
    const accessToken = Cookies.get("accessToken") ?? "";
    const info = Cookies.get("loggedUserInfo");
    if (!info) throw new Error("User is not logged in");
    
    const parsedInfo = JSON.parse(info);
    await uploadDocument(
      file, 
      parsedInfo.id, 
      parsedInfo.Company_id, 
      accessToken
    );
  };

  return (
    <div className="min-h-screen w-full p-8 bg-zinc-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="bg-white shadow-xl rounded-xl border-zinc-200">
          <CardHeader className="border-b border-zinc-200 bg-gradient-to-r from-zinc-900 to-zinc-700 p-6 rounded-t-xl">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}>
              <Users className="h-6 w-6 text-white" />
              <CardTitle className="text-2xl font-bold text-white">
                Train Your Agent Here
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg flex items-center"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </motion.div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse"
                  >
                    <div className="h-24 bg-zinc-100 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                ref={parentRef}
                className="h-[calc(100vh-300px)] overflow-auto"
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const agent = agents[virtualRow.index];
                    return (
                      <div
                        key={agent._id}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <AgentCard
                          agent={agent}
                          onTrain={() => {
                            setSelectedAgent(agent);
                            setIsDialogOpen(true);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedAgent(null);
        }}
        onUpload={handleUpload}
      />

      {/* Toast Container for Notifications */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {/* Toast messages will be rendered here by the toast library */}
        </motion.div>
      </div>
    </div>
  );
}