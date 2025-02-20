import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { query } from "../../../../lib/db";
import { authOptions } from "../../../../app/api/auth/[...nextauth]/route";
import ViewForm from "../../../../components/ViewForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SubmissionPage({ params }: PageProps) {
  // Validate session first
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any).isAdmin) {
    redirect("/signin");
  }

  // Validate id parameter
  const id = params?.id;
  if (!id || typeof id !== "string") {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">Invalid submission ID</div>
      </div>
    );
  }

  try {
    // Fetch submission data
    const submissions = (await query(`SELECT * FROM form1 WHERE id = ?`, [id])) as any[];

    if (!submissions || submissions.length === 0) {
      return (
        <div className="container mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Submission not found
          </div>
        </div>
      );
    }

    const submission = submissions[0];
    console.log("Raw submission data from database:", submission);

    // Process submission data
    const processedSubmission = {
      ...submission,
      // Personal Information
      idNumber: submission.id_number || "—", // Added idNumber
      issueDateAndPlace: submission.issue_date_and_place || "—", // Added issueDateAndPlace
      educationLevel: submission.education_level || "—", // Added educationLevel
      latestDegree: submission.latest_degree || "—", // Added latestDegree
      experience: submission.experience || "—", // Added experience
      dob: submission.dob ? new Date(submission.dob).toLocaleDateString() : "—", // Fixed: Convert dob to string

      // Activity Properties
      activitySpaces: submission.activity_spaces ? submission.activity_spaces.split(",") : [], // Added activitySpaces
      roomCount: submission.room_count || "—", // Added roomCount
      hallCount: submission.hall_count || "—", // Added hallCount
      capacity: {
        accommodation: submission.capacity_accommodation || "—",
        tents: submission.capacity_tents || "—",
        activitySpaces: submission.capacity_activity_spaces || "—",
      },

      // Services Section
      services: submission.services ? submission.services.split(",") : [], // Added services
      projectNature: submission.project_nature || "—", // Added projectNature
      placecount: submission.placecount || "—", // Added placecount

      // Director Information
      directorName: submission.director_name || "—", // Added directorName
      directorId: submission.director_id || "—", // Added directorId
      directorCertification: submission.director_certification || "—", // Added directorCertification

      // Investment Section
      investmentType: submission.investment_type ? submission.investment_type.split(",") : [], // Added investmentType
      investorInfo: submission.investor_info || "—", // Added investorInfo
      commercialName: submission.commercial_name || "—", // Added commercialName
      socialAddress: submission.social_address || "—", // Added socialAddress
      state: submission.state || "—", // Added state
      district: submission.district || "—", // Added district
      municipality: submission.municipality || "—", // Added municipality
      postalCode: submission.postal_code || "—", // Added postalCode

      // Women & Childhood Activities
      activitiesNature: submission.activities_nature || "—", // Added activitiesNature
      investmentNature: submission.investment_nature ? submission.investment_nature.split(",") : [], // Added investmentNature
      activityNature: submission.activity_nature ? submission.activity_nature.split(",") : [], // Added activityNature
      projectName: submission.project_name || "—", // Added projectName
      projectAddress: submission.project_address || "—", // Added projectAddress
      email: submission.email || "—", // Added email

      // Declaration
      declaration: submission.declaration === 1, // Added declaration
      signatureDate: submission.signature_date ? new Date(submission.signature_date).toLocaleDateString() : "—", // Fixed: Convert signatureDate to string

      // Funding and Expenses
      funding: [
        submission.funding0 || 0,
        submission.funding1 || 0,
        submission.funding2 || 0,
        submission.funding3 || 0,
        submission.funding4 || 0,
        submission.funding5 || 0,
      ], // Fixed: Map funding fields
      expenses: [
        submission.expenses0 || 0,
        submission.expenses1 || 0,
        submission.expenses2 || 0,
        submission.expenses3 || 0,
        submission.expenses4 || 0,
        submission.expenses5 || 0,
      ], // Fixed: Map expenses fields
    };

    console.log("Processed submission data:", JSON.stringify(processedSubmission, null, 2));

    // Check for empty fields
    const emptyFields = Object.entries(processedSubmission)
      .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      console.log("Empty fields detected:", emptyFields);
    } else {
      console.log("All fields have values");
    }

    return (
      <div className="container mx-auto p-4">
        <ViewForm submission={processedSubmission} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching submission details:", error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading submission details. Please try again later.
        </div>
      </div>
    );
  }
}