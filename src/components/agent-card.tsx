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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getAgents } from "@/services/api";
import CopyBox from "./DashboardComponents/cdn";
import { Users, Rocket, Code2 } from "lucide-react";

export default function AgentCard() {
  const [agents, setAgents] = useState<Array<any>>([]);
  const [error, setError] = useState<string>("");
  
  const accessToken = Cookies.get("accessToken") ?? '';
  
  async function fetchAgents() {
    try {
      const data = await getAgents(accessToken);
      const activeAgents = data.filter((agent: any) => agent.status === "active");
      setAgents(activeAgents);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown Error Occurred");
      }
    }
  }
  
  useEffect(() => {
    fetchAgents();
  }, []);
  
  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg rounded-xl border-zinc-200">
          <CardHeader className="border-b border-zinc-200 bg-gradient-to-r from-orange-400 to-yellow-400 p-4 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-zinc-700" />
              <CardTitle className="text-2xl font-bold text-zinc-800">Active Agents</CardTitle>
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
                          <span className="font-medium text-zinc-800 text-lg">{agent.name}</span>
                          <span className="text-sm text-zinc-500">{agent.title}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-zinc-600 max-w-xl">{agent.description}</p>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white">
                              <Rocket className="h-4 w-4 mr-2" />
                              Deploy Now
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="bg-white">
                            <SheetHeader>
                              <SheetTitle className="text-xl flex items-center space-x-2">
                                <Code2 className="h-5 w-5 text-zinc-700" />
                                <span>Deploy Agent</span>
                              </SheetTitle>
                              <SheetDescription>
                                Add this agent to your project using the code below
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-8 space-y-6">
                              <div className="text-sm text-zinc-600">
                                Copy and paste the following code into your HTML file:
                              </div>
                              <CopyBox />
                            </div>
                            <SheetFooter>
                              <SheetClose asChild>
                                <Button className="bg-zinc-900 hover:bg-zinc-800 text-white">
                                  Done
                                </Button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
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