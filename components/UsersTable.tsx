"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: number;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: number) => {
    try {
      await fetch("/api/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId,
          isAdmin: users.find(u => u.id === userId)?.is_admin === 1 ? 0 : 1 
        }),
      });

      fetchUsers();
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  return (
    <Table className="w-full border-collapse animate-fade-in">
      <TableHeader className="bg-table-header">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 py-4 text-left text-sm font-medium text-table-text uppercase tracking-wider border-b border-table-border">الاسم</TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-medium text-table-text uppercase tracking-wider border-b border-table-border">البريد الإلكتروني</TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-medium text-table-text uppercase tracking-wider border-b border-table-border">حالة المدير</TableHead>
          <TableHead className="px-6 py-4 text-left text-sm font-medium text-table-text uppercase tracking-wider border-b border-table-border">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              جاري التحميل...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-red-500">
              {error}
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              لا يوجد مستخدمين
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id} className="bg-table-row hover:bg-table-hover transition-all duration-200 ease-in-out">
              <TableCell className="px-6 py-4 text-right text-table-text border-b border-table-border">{user.name}</TableCell>
              <TableCell className="px-6 py-4 text-right text-table-text border极-b border-table-border">{user.email}</TableCell>
              <TableCell className={`px-6 py-4 text-right border-b border-table-border ${user.is_admin ? "font-bold text-table-accent" : "text-table-text"}`}>
                {user.is_admin ? "مدير" : "مستخدم عادي"}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <Button
                  variant={user.is_admin ? "destructive" : "default"}
                  className="hover:shadow-lg transition-all duration-200 ease-in-out min-w-[120px]"
                  onClick={() => toggleAdminStatus(user.id)}
                >
                  {user.is_admin ? "إزالة المدير" : "تعيين كمدير"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
