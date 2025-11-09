import { NextResponse } from "next/server";
import { prisma } from "../../../../server/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.patientRecord.findUnique({
      where: { id: params.id },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (err: any) {
    console.error("Error fetching patient record:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
