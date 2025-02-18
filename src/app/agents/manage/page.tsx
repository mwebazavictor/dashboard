"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
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
import { Users, BriefcaseBusiness } from "lucide-react";
import { getPurchasedAgents, uploadDocument } from "@/services/api";

export default function AgentsOwned() {
  const [agents, setAgents] = useState<Array<any>>([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(""); // State for PDF preview URL

  // Fetch purchased agents from the backend
  async function fetchPurchasedAgents() {
    try {
      const accessToken = Cookies.get("accessToken") ?? "";
      const info = Cookies.get("loggedUserInfo");
      console.log(info);
      if (!info) {
        console.log(info);
        setError("User is not logged in");
        return; // Exit early if no user info is found
      }
      const parsedInfo = JSON.parse(info ?? "{}");
      const companyId = parsedInfo.Company_id; // Ensure the property name matches your cookie data
      const data = await getPurchasedAgents(companyId, accessToken);
      const purchasedAgents = data.purchasedAgents || [];
      setAgents(purchasedAgents);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error Occurred");
      }
    }
  }

  useEffect(() => {
    fetchPurchasedAgents();
  }, []);

  // Handle file input changes and set the preview URL
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      // Create a preview URL for the selected PDF file
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }
  };

  // Handle the upload of the PDF document
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    try {
      const accessToken = Cookies.get("accessToken") ?? "";
      const info = Cookies.get("loggedUserInfo");
      console.log(info);
      if (!info) {
        console.log(info);
        setError("User is not logged in");
        return;
      }
      const parsedInfo = JSON.parse(info ?? "{}");
      const companyId = parsedInfo.Company_id; // Ensure property name matches your cookie data
      const userId = parsedInfo.id;
      console.log(userId,companyId)
      const response = await uploadDocument(file, userId, companyId, accessToken);
      console.log("File uploaded successfully:", response);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg rounded-xl border-zinc-200">
          <CardHeader className="border-b border-zinc-200 bg-gradient-to-r from-orange-400 to-yellow-400 p-4 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-zinc-700" />
              <CardTitle className="text-2xl font-bold text-zinc-800">
                Train Your Agent Here
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <span className="mr-2">⚠️</span> Error: {error}
              </div>
            )}
            <div className="grid gap-6">
              {agents.map((agent) => (
                <Card
                  key={agent._id}
                  className="border border-zinc-200 hover:border-zinc-300 transition-all duration-200 hover:shadow-md bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <span className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center">
                          <span className="text-zinc-700 font-semibold text-lg">
                            {agent.name.charAt(0)}
                          </span>
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-800 text-lg">
                            {agent.name}
                          </span>
                          <span className="text-sm text-zinc-500">
                            {agent.title}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-zinc-600 max-w-xl">
                          {agent.description}
                        </p>
                        <Dialog>
                          <DialogTrigger>
                            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white">
                              <BriefcaseBusiness className="h-4 w-4 mr-2" />
                              Train Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload PDF Document</DialogTitle>
                              <DialogDescription>
                                Please select a PDF file to preview and submit.
                              </DialogDescription>
                            </DialogHeader>
                            {/* PDF File Input */}
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handleFileChange}
                            />
                            {/* PDF Preview */}
                            {previewUrl && (
                              <div className="mt-4">
                                <p className="mb-2 font-medium">PDF Preview:</p>
                                <iframe
                                  src={previewUrl}
                                  width="100%"
                                  height="400px"
                                  className="border rounded"
                                />
                              </div>
                            )}
                            {/* Upload Button */}
                            <Button onClick={handleUpload} className="mt-4">
                              Upload PDF
                            </Button>
                            {/*
                              The above code allows the user to:
                              1. Select a PDF file using the file input.
                              2. Preview the selected PDF in an iframe.
                              3. Click the "Upload PDF" button to submit the file.
                            */}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
