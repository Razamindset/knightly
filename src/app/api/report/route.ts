import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const evaluations = await request.json();

    // Validate the evaluation data
    if (!evaluations) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the external reporting API
    const reportResponse = await fetch(`${process.env.API_URL}/api/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": `${process.env.SECRET_TOKEN}`,
      },
      body: JSON.stringify({ positions: evaluations }),
    });

    const report = await reportResponse.json();

    // Return success response
    return NextResponse.json(
      {
        report,
        success: true,
        message: "Evaluation submitted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing evaluation:", error);

    // Return error response
    return NextResponse.json(
      {
        error: "Failed to process evaluation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
