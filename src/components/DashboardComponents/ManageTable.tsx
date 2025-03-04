"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Pencil, Check, Trash2, CirclePlus, Loader2, Info, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getCustomerSupportQueriesByPurchasedAgent,
  updateCustomerSupportQuery,
  deleteCustomerSupportQuery,
  createCustomerSupportQuery,
} from "@/services/api";

// ----------------------------------------------------------------
// QueryTable Component: handles fetching, displaying, inline editing,
// deletion, and creation of queries for a purchased agent.
interface Query {
  _id: string;
  query: string;
  createdAt?: string;
  updatedAt?: string;
}

interface QueryTableProps {
  purchasedAgentId: string;
  token: string;
  companyId: string;
  agentId: string;
  agentName?: string;
}

const QueryTable = ({ purchasedAgentId, token, companyId, agentId, agentName = "Agent" }: QueryTableProps) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newQueryText, setNewQueryText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchQueries = useCallback(async () => {
    try {
      setError(null);
      const data = await getCustomerSupportQueriesByPurchasedAgent(purchasedAgentId, token);
      setQueries(data || []);
    } catch (error) {
      setError("Failed to load queries. Please try again.");
      toast.error("Failed to load queries");
    } finally {
      setIsLoading(false);
    }
  }, [purchasedAgentId, token]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  const handleEdit = (queryId: string, currentText: string) => {
    setEditingQueryId(queryId);
    setEditingText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingQueryId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (queryId: string) => {
    if (!editingText.trim()) {
      toast.error("Query text cannot be empty");
      return;
    }
    
    try {
      const updatedQuery = await updateCustomerSupportQuery(
        queryId,
        { query: editingText },
        token
      );
      setQueries((prev) =>
        prev.map((q) => (q._id === queryId ? updatedQuery : q))
      );
      toast.success("Query updated successfully");
      setEditingQueryId(null);
      setEditingText("");
    } catch (error) {
      toast.error("Failed to update query");
    }
  };

  const handleDelete = async (queryId: string) => {
    try {
      await deleteCustomerSupportQuery(queryId, token);
      setQueries((prev) => prev.filter((q) => q._id !== queryId));
      toast.success("Query deleted successfully");
    } catch (error) {
      toast.error("Failed to delete query");
    }
  };

  const handleAddQuery = async () => {
    if (newQueryText.trim() === "") {
      toast.error("Please enter a query");
      return;
    }
    
    try {
      const newQuery = await createCustomerSupportQuery(
        {
          query: newQueryText,
          company_id: companyId,
          agent_id: agentId,
          purchased_agent_id: purchasedAgentId,
        },
        token
      );
      setQueries((prev) => [...prev, newQuery]);
      setNewQueryText("");
      toast.success("Query added successfully");
    } catch (error) {
      toast.error("Failed to add query");
    }
  };

  return (
    <Card className="w-full bg-white/85 backdrop-blur-md border border-indigo-100 shadow-lg rounded-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center">
              Sample questions for {agentName}
            </CardTitle>
            <CardDescription className="text-indigo-100 mt-1">
              Manage the sample questions for your agent
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-sm">
                <p>Add sample questions for users. Make them related to what your agent does. Maximum is <strong>3</strong></p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchQueries} 
              className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}

        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new question for your agent..."
              value={newQueryText}
              onChange={(e) => setNewQueryText(e.target.value)}
              className="flex-1 border-indigo-200 focus-visible:ring-indigo-500"
            />
            <Button 
              onClick={handleAddQuery} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <CirclePlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-indigo-600 text-sm">Loading queries...</p>
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-indigo-200 rounded-lg bg-indigo-50/50">
            <Info className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-indigo-700 font-medium mb-1">No queries yet</h3>
            <p className="text-indigo-500 text-sm max-w-md mx-auto">
              Add your first query above to start training your agent
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-indigo-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-indigo-50">
                <TableRow>
                  <TableHead className="text-indigo-700 font-semibold w-full">Query</TableHead>
                  <TableHead className="text-indigo-700 font-semibold text-right w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((query) => (
                  <TableRow key={query._id} className="hover:bg-indigo-50/50 transition-colors">
                    <TableCell>
                      {editingQueryId === query._id ? (
                        <Input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="border-indigo-200 focus-visible:ring-indigo-500"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2 bg-indigo-100 text-indigo-700 border-indigo-200">Q</Badge>
                          <span>{query.query}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingQueryId === query._id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            onClick={() => handleSaveEdit(query._id)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => handleEdit(query._id, query.query)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Query</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this query?")) {
                                      handleDelete(query._id);
                                    }
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete Query</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryTable;