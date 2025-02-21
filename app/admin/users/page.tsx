import { getServerSession } from "next-auth/next";

import { redirect } from "next/navigation";
import UsersTable from "/components/UsersTable";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as any).isAdmin) {
    redirect("/admin");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة المستخدمين</h1>
      <UsersTable />
    </div>
  );
}
