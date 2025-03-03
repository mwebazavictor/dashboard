"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Pencil, Check, Trash2, CirclePlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Import your API service functions
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
}

interface QueryTableProps {
  purchasedAgentId: string;
  token: string;
  companyId: string;
  agentId: string;
}

const QueryTable = ({ purchasedAgentId, token,companyId,agentId }: QueryTableProps) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newQueryText, setNewQueryText] = useState("");

  const fetchQueries = useCallback(async () => {
    try {
      const data = await getCustomerSupportQueriesByPurchasedAgent(purchasedAgentId, token);
      setQueries(data || []);
    } catch (error) {
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
    if (!window.confirm("Are you sure you want to update the query?")) {
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
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      await deleteCustomerSupportQuery(queryId, token);
      setQueries((prev) => prev.filter((q) => q._id !== queryId));
      toast.success("Query deleted successfully");
    } catch (error) {
      toast.error("Failed to delete query");
    }
  };

  const handleAddQuery = async () => {
    if (newQueryText.trim() === "") return;
    try {
      const newQuery = await createCustomerSupportQuery(
        {
          query: newQueryText,
          company_id: companyId, // supply as needed
          agent_id: agentId,   // supply as needed
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
    <div>
      {isLoading ? (
        <p>Loading queries...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <th className="text-zinc-600 font-bold">Query</th>
              <th className="text-zinc-600 font-bold">Actions</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query._id}>
                <td>
                  {editingQueryId === query._id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    query.query
                  )}
                </td>
                <td className="flex items-center space-x-2">
                  {editingQueryId === query._id ? (
                    <>
                      <Button
                        onClick={() => handleSaveEdit(query._id)}
                        variant="outline"
                        size="sm"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(query._id, query.query)}
                        variant="ghost"
                        size="sm"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(query._id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </td>
              </TableRow>
            ))}
            {/* Row for adding a new query */}
            <TableRow>
              <td>
                <input
                  type="text"
                  placeholder="New Query"
                  value={newQueryText}
                  onChange={(e) => setNewQueryText(e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </td>
              <td>
                <Button onClick={handleAddQuery} variant="outline" size="sm">
                  <CirclePlus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </td>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default QueryTable;
