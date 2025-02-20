import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await req.json();

    // Process array fields
    const processedData = {
      ...formData,
      activitySpaces: formData.activitySpaces ? formData.activitySpaces.split(",") : [],
      services: formData.services ? formData.services.split(",") : [],
      investmentType: formData.investmentType ? formData.investmentType.split(",") : [],
      investmentNature: formData.investmentNature ? formData.investmentNature.split(",") : [],
      activityNature: formData.activityNature ? formData.activityNature.split(",") : [],
    };

    const sql = `

      INSERT INTO form1 (
        name, surname, dob, id_number, issue_date_and_place, address, education_level,
        latest_degree, experience, activity_spaces, room_count, hall_count,
        capacity_accommodation, capacity_tents, capacity_activity_spaces, services,
        project_nature, placecount, director_name, director_id, director_certification,
        investment_type, investor_info, commercial_name, social_address, state, district,
        municipality, postal_code, activities_nature, investment_nature, activity_nature,
        project_name, project_address, email, declaration, signature_date,
        funding0, funding1, funding2, funding3, funding4, funding5,
        expenses0, expenses1, expenses2, expenses3, expenses4, expenses5
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      processedData.name,
      processedData.surname,
      processedData.dob,
      processedData.idNumber,
      processedData.issueDateAndPlace,
      processedData.address,
      processedData.educationLevel,
      processedData.latestDegree,
      processedData.experience,
      processedData.activitySpaces.join(","),
      Number(processedData.roomCount),
      Number(processedData.hallCount),
      Number(processedData.capacity.accommodation),
      Number(processedData.capacity.tents),
      Number(processedData.capacity.activitySpaces),
      processedData.services.join(","),
      processedData.projectNature,
      Number(processedData.placecount),
      processedData.directorName,
      processedData.directorId,
      processedData.directorCertification,
      processedData.investmentType.join(","),
      processedData.investorInfo,
      processedData.commercialName,
      processedData.socialAddress,
      processedData.state,
      processedData.district,
      processedData.municipality,
      processedData.postalCode,
      processedData.activitiesNature,
      processedData.investmentNature.join(","),
      processedData.activityNature.join(","),
      processedData.projectName,
      processedData.projectAddress,
      processedData.email,
      processedData.declaration ? 1 : 0,
      processedData.signatureDate,

      ...formData.funding.map((value: string) => Number(value || 0)),
      ...formData.expenses.map((value: string) => Number(value || 0)),
    ];

    await query(sql, values);

    return NextResponse.json({ message: "Form data saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Error saving form data.", error: (error as Error).message }, { status: 500 });
  }
}
