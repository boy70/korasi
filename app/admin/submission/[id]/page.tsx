import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { query } from "../../../../lib/db"
import { authOptions } from "../../../../app/api/auth/[...nextauth]/route"
import ViewForm from "../../../../components/ViewForm"

interface PageProps {
  params: {
    id: string
  }
}

export default async function SubmissionPage({ params }: PageProps) {
  // Validate session first
  const session = await getServerSession(authOptions)

  if (!session || !(session.user as any).isAdmin) {
    redirect("/signin")
  }

  // Validate id parameter
  const id = params?.id
  if (!id || typeof id !== "string") {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">Invalid submission ID</div>
      </div>
    )
  }

  try {
    // Fetch submission data
    const submissions = (await query(`SELECT * FROM form1 WHERE id = ?`, [id])) as any[]

    if (!submissions || submissions.length === 0) {
      return (
        <div className="container mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Submission not found
          </div>
        </div>
      )
    }

    const submission = submissions[0]
    console.log("Raw submission data from database:", submission)

    // Process submission data
    const processedSubmission = {
      ...submission,
      // Convert string fields to arrays
      activitySpaces: submission.activitySpaces?.split(",") || [],
      services: submission.services?.split(",") || [],
      investmentType: submission.investmentType?.split(",") || [],
      investmentNature: submission.investmentNature?.split(",") || [],
      activityNature: submission.activityNature?.split(",") || [],

      // Convert funding and expenses to arrays of numbers
      funding: submission.funding?.split(",").map(Number) || Array(6).fill(0),
      expenses: submission.expenses?.split(",").map(Number) || Array(6).fill(0),

      // Parse capacity object
      capacity: {
        accommodation: submission.capacity_accommodation || "",
        tents: submission.capacity_tents || "",
        activitySpaces: submission.capacity_activity_spaces || "",
      },

      // Convert declaration to boolean
      declaration: Boolean(submission.declaration),
    }

    console.log("Processed submission data:", processedSubmission)

    // Check for empty fields
    const emptyFields = Object.entries(processedSubmission)
      .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
      .map(([key]) => key)

    if (emptyFields.length > 0) {
      console.log("Empty fields detected:", emptyFields)
    } else {
      console.log("All fields have values")
    }

    return (
      <div className="container mx-auto p-4">
        <ViewForm submission={processedSubmission} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching submission details:", error)
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading submission details. Please try again later.
        </div>
      </div>
    )
  }
}