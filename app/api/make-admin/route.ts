import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const { userId } = await req.json()

  try {
    await query("UPDATE users SET is_admin = TRUE WHERE id = ?", [userId])
    return NextResponse.json({ message: "User is now an admin" }, { status: 200 })
  } catch (error) {
    console.error("Error making user admin:", error)
    return NextResponse.json({ error: "Failed to make user an admin" }, { status: 500 })
  }
}

