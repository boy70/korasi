import { NextResponse } from "next/server"
import { query } from "../../../lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])
    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error creating user" }, { status: 500 })
  }
}

