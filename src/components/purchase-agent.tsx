"use client";
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { getAgents, purchaseAgentWithAccount } from "@/services/api";
import { ShoppingBag, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';

export default function PurchaseAgent() {
  const [agents, setAgents] = useState<Array<any>>([]);
  const [error, setError] = useState<string>("");
  const [enterprisePeriod, setEnterprisePeriod] = useState<number>(30);
  const accessToken = Cookies.get("accessToken") ?? '';
  const router = useRouter()

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

  const handlePurchase = async (
    agentId: string,
    plan: string,
    amount: string,
    period: number
  ) => {
    const data = Cookies.get("loggedUserInfo");
    if (!data) {
      setError("User not logged in.");
      return;
    }
    const info = JSON.parse(data);
    const purchaseData = {
      company_id: info.Company_id,
      plan,
      amount,
      period,
      agent_id: agentId,
    };

    const token = Cookies.get("accessToken") ?? "";
    try {
      const result = await purchaseAgentWithAccount(purchaseData, token);
      /* console.log("Purchase successful:", result); */
        router.push('/agents/manage')
    } catch (error) {
      console.error("Error purchasing agent:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      {!error && (
        <Card className="max-w-7xl mx-auto bg-white shadow-xl">
          <CardHeader className="space-y-4 pb-8 border-b border-zinc-200">
            <CardTitle>
              <h2 className="text-3xl font-bold text-zinc-900">Purchase Agents</h2>
            </CardTitle>
            <CardDescription className="text-zinc-500 text-lg">
              Get yourself a quick agent now
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent._id} className="bg-white border border-zinc-200 hover:border-zinc-300 transition-all duration-300">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl font-semibold text-zinc-900">
                      {agent.name}
                    </CardTitle>
                    <div className="text-zinc-600 font-medium">
                      {agent.title}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 leading-relaxed">
                      {agent.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Buy now
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="bg-white">
                        <div className="mx-auto w-full max-w-lg p-6">
                          <DrawerHeader className="text-center">
                            <DrawerTitle className="text-2xl font-bold text-zinc-900">
                              Finish Your Purchase
                            </DrawerTitle>
                          </DrawerHeader>
                          <div className="mt-8">
                            <Tabs defaultValue="free" className="w-full">
                              <TabsList className="grid grid-cols-2 gap-4 bg-zinc-100 p-1">
                                <TabsTrigger value="free" className="data-[state=active]:bg-white">
                                  Free
                                </TabsTrigger>
                                <TabsTrigger value="enterprise" className="data-[state=active]:bg-white">
                                  Enterprise
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="free">
                                <Card className="mt-4 border-2 border-zinc-200">
                                  <CardHeader>
                                    <Badge className="w-fit bg-zinc-900 text-white mb-2">Free Plan</Badge>
                                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-6">
                                    <ul className="space-y-3">
                                      <li className="flex items-center text-zinc-600">
                                        <Check className="mr-2 h-5 w-5 text-zinc-900" />
                                        Tier 1 Features
                                      </li>
                                      <li className="flex items-center text-zinc-600">
                                        <Check className="mr-2 h-5 w-5 text-zinc-900" />
                                        Basic Benefits
                                      </li>
                                    </ul>
                                    <div className="text-3xl font-bold text-zinc-900">$0.00</div>
                                    <div className="text-zinc-600">Period: 30 days</div>
                                    <Button 
                                      className="w-full bg-zinc-900 hover:bg-zinc-800"
                                      onClick={() => handlePurchase(agent._id, "free", "0.00", 30)}
                                    >
                                      Get Started Free
                                    </Button>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="enterprise">
                                <Card className="mt-4 border-2 border-zinc-900">
                                  <CardHeader>
                                    <Badge className="w-fit bg-zinc-900 text-white mb-2">Enterprise</Badge>
                                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-6">
                                    <ul className="space-y-3">
                                      <li className="flex items-center text-zinc-600">
                                        <Check className="mr-2 h-5 w-5 text-zinc-900" />
                                        Tier 2 Advanced Features
                                      </li>
                                      <li className="flex items-center text-zinc-600">
                                        <Check className="mr-2 h-5 w-5 text-zinc-900" />
                                        Premium Benefits
                                      </li>
                                    </ul>
                                    <div className="text-3xl font-bold text-zinc-900">$10.00</div>
                                    <div className="space-y-2">
                                      <label htmlFor={`period-select-${agent._id}`} className="block text-sm font-medium text-zinc-600">
                                        Select Period
                                      </label>
                                      <select
                                        id={`period-select-${agent._id}`}
                                        value={enterprisePeriod}
                                        onChange={(e) => setEnterprisePeriod(Number(e.target.value))}
                                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:ring-zinc-900"
                                      >
                                        <option value={30}>30 days</option>
                                        <option value={60}>60 days</option>
                                        <option value={90}>90 days</option>
                                      </select>
                                    </div>
                                    <Button
                                      disabled                                    
                                      className="w-full bg-zinc-900 hover:bg-zinc-800"
                                      onClick={() => handlePurchase(agent._id, "enterprise", "10.00", enterprisePeriod)}
                                    >
                                      Purchase Enterprise
                                    </Button>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </div>
                          <DrawerFooter className="mt-8">
                            <DrawerClose asChild>
                              <Button variant="outline" className="w-full border-zinc-200 text-zinc-900 hover:bg-zinc-100">
                                Cancel
                              </Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-200 py-6">
            <p className="text-zinc-600 text-center w-full">Don&apos;t miss your favourite deals.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}