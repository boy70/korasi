import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import AdminPanel from "@/components/AdminPanel"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || !(session.user as any).isAdmin) {
    redirect("/signin")
  }

  try {
    const formSubmissions = await query(`
      SELECT 
        id, 
        name, 
        surname, 
        email, 
        project_name as projectName, 
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as submissionDate
      FROM form1
      ORDER BY created_at DESC
    `)

    return <AdminPanel formSubmissions={formSubmissions as any[]} />
  } catch (error) {
    console.error("Error fetching form submissions:", error)
    return <div>Error loading form submissions. Please try again later.</div>
  }
}

