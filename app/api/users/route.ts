import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { log } from "console";






export async function GET() {
  const session = await getServerSession(authOptions);
  log("Session details:", session);
  
  if (!session?.user || !(session.user as any).isAdmin) {
    log("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }




  try {
    console.log("Fetching users from database");
    const sql = "SELECT id, name, email, is_admin FROM users";

    log("Executing SQL query:", sql);
    const users = await query(sql);
    return NextResponse.json(users);
  } catch (error) {
    log("Database query error:", error);
    return NextResponse.json(
      { error: "Database query failed. Please check server logs." },
      { status: 500 }
    );


  }
}
