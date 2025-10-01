"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ContactService, ContactMessageRow } from "@/lib/contact-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Eye,
  Reply,
  CheckCircle,
  Trash2,
  RefreshCw,
  Filter,
  User,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface ContactMessageStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  closed: number;
}

export function ContactMessagesStatic() {
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [stats, setStats] = useState<ContactMessageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessageRow | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesPerPage = 10;

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For static export, we'll use a simple check
        // In production, you might want to implement a different auth method
        const authToken = localStorage.getItem("admin-auth-token");
        setIsAuthenticated(!!authToken);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch contact messages and statistics
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Authentication required to view messages");
      return;
    }

    try {
      setLoading(true);

      // Fetch messages
      const messagesResult = await ContactService.getContactMessages(
        messagesPerPage,
        currentPage * messagesPerPage,
        statusFilter === "all"
          ? undefined
          : (statusFilter as "new" | "read" | "replied" | "closed")
      );

      if (messagesResult.success && messagesResult.data) {
        setMessages(messagesResult.data);
        setTotalPages(Math.ceil(messagesResult.data.length / messagesPerPage));
      } else {
        toast.error(messagesResult.message || "Failed to fetch messages");
      }

      // Fetch statistics
      const statsResult = await ContactService.getContactMessageStats();
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
      toast.error("Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, messagesPerPage, currentPage, statusFilter]);

  // Update message status
  const updateMessageStatus = async (id: string, newStatus: string) => {
    try {
      const result = await ContactService.updateMessageStatus(
        id,
        newStatus as "new" | "read" | "replied" | "closed"
      );

      if (result.success) {
        toast.success("Message status updated successfully");
        fetchData(); // Refresh data
      } else {
        toast.error(result.message || "Failed to update message status");
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      toast.error("Failed to update message status");
    }
  };

  // Delete message
  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const result = await ContactService.deleteContactMessage(id);

      if (result.success) {
        toast.success("Message deleted successfully");
        fetchData(); // Refresh data
      } else {
        toast.error(result.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [currentPage, statusFilter, isAuthenticated, fetchData]);

  // Simple authentication form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-luxe-blue mb-4">
                Admin Access Required
              </h2>
              <p className="text-gray-600 mb-6">
                This is a simplified admin interface for static export. For full
                admin features, consider upgrading to a server-side deployment.
              </p>
              <Button
                onClick={() => {
                  // Simple auth for demo purposes
                  localStorage.setItem("admin-auth-token", "demo-token");
                  setIsAuthenticated(true);
                  toast.success("Demo admin access granted");
                }}
                className="w-full"
              >
                Grant Demo Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-luxe-blue" />
        <span className="ml-2 text-luxe-blue">Loading contact messages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxe-blue">
            Contact Messages (Static)
          </h1>
          <p className="text-gray-600 mt-2">
            Simplified admin interface for static export
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => {
              localStorage.removeItem("admin-auth-token");
              setIsAuthenticated(false);
              toast.success("Logged out");
            }}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-luxe-blue" />
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <p className="text-2xl font-bold text-luxe-blue mt-1">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">New</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.new}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">Read</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {stats.read}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Reply className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Replied
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.replied}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  Closed
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-600 mt-1">
                {stats.closed}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            Filter by status:
          </span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No messages found
              </h3>
              <p className="text-gray-500">
                {statusFilter === "all"
                  ? "No contact messages have been submitted yet."
                  : `No messages with status "${statusFilter}" found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card
              key={message.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getStatusBadgeColor(message.status)}>
                        {message.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-luxe-blue mb-1">
                      {message.subject}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {message.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {message.email}
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2">
                      {message.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {/* View Message Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Contact Message Details
                          </DialogTitle>
                        </DialogHeader>

                        {selectedMessage && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  Name
                                </label>
                                <p className="text-luxe-blue font-medium">
                                  {selectedMessage.name}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  Email
                                </label>
                                <p className="text-luxe-blue font-medium">
                                  {selectedMessage.email}
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Subject
                              </label>
                              <p className="text-luxe-blue font-medium">
                                {selectedMessage.subject}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Message
                              </label>
                              <div className="bg-gray-50 p-3 rounded-lg mt-1">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {selectedMessage.message}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  Status
                                </label>
                                <Badge
                                  className={getStatusBadgeColor(
                                    selectedMessage.status
                                  )}
                                >
                                  {selectedMessage.status}
                                </Badge>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">
                                  Received
                                </label>
                                <p className="text-gray-700">
                                  {formatDate(selectedMessage.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Status Update Dropdown */}
                    <Select
                      value={message.status}
                      onValueChange={(value) =>
                        updateMessageStatus(message.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessage(message.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
