import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
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
    `);
    
    return NextResponse.json(formSubmissions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch form submissions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, surname, email, projectName } = await req.json();
    
    await query(
      "INSERT INTO form1 (name, surname, email, project_name) VALUES (?, ?, ?, ?)",
      [name, surname, email, projectName]
    );

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
