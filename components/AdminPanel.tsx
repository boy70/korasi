"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface FormSubmission {
  id: number
  name: string
  surname: string
  email: string
  projectName: string
  submissionDate: string
  status: string
}

export default function AdminPanel({
  formSubmissions,
}: {
  formSubmissions: FormSubmission[]
}) {
  const [submissions, setSubmissions] = useState(formSubmissions)

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch("/api/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setSubmissions(submissions.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub)))
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status. Please try again.")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Surname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{submission.surname}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.projectName}</TableCell>
                <TableCell>{format(new Date(submission.submissionDate), "PPP")}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={submission.status}
                    onValueChange={(value: string) => updateStatus(submission.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/submission/${submission.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View submission</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

