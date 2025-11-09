import { NextResponse } from "next/server";
import { prisma } from "../../../../server/db";

// Explicitly name the second argument `context` and use type inference
export async function GET(
  req: Request,
  context: any // avoid explicit structural typing to satisfy Next.js route typing
) {
  try {
    const id = context?.params?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    const record = await prisma.patientRecord.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (err: any) {
    console.error("Error fetching patient record:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
