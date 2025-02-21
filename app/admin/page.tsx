import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AdminPanel from "../../components/AdminPanel";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any).isAdmin) {
    redirect("/signin");
  }

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/submit-form`, {
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch form submissions");
    }

    const formSubmissions = await response.json();

    return <AdminPanel formSubmissions={formSubmissions} />;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return <div>Error loading form submissions. Please try again later.</div>;
  }
}
