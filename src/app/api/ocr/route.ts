import { NextResponse } from "next/server";
import { prisma } from "./../../../server/db";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textInput = formData.get("text") as string | null;
    const patientName =
      (formData.get("patientName") as string | null) ?? "Unknown";

    if (!file && !textInput) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
    let extractedText: string = textInput || "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fs = await import("fs/promises");
      const tmpPath = `/tmp/${file.name}`;
      await fs.writeFile(tmpPath, buffer);

      const uploaded = await ai.files.upload({ file: tmpPath });
      if (!uploaded.uri || !uploaded.mimeType) {
        throw new Error("Gemini upload failed or returned incomplete metadata.");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          createUserContent([
            "Extract structured medical information from this image and return strictly as JSON with key–value pairs.",
            createPartFromUri(uploaded.uri, uploaded.mimeType),
          ]),
        ],
        config: { temperature: 0.1 },
      });

      extractedText = response.text ?? "";
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract structured medical information from the following text and return strictly as JSON:\n\n${textInput}`,
        config: { temperature: 0.1 },
      });
      extractedText = response.text ?? "";
    }

    // --- Extract JSON starting after the "json" marker ---
    let cleaned = extractedText;

    // Remove markdown fences and "raw" prefix if present
    cleaned = cleaned
      .replace(/^raw/i, "")
      .replace(/```/g, "")
      .trim();

    // If there's a "json" marker, slice from there onward
    const jsonStart = cleaned.toLowerCase().indexOf("json");
    if (jsonStart !== -1) {
      cleaned = cleaned.slice(jsonStart + 4);
    }

    // Extract only the JSON portion (from first { to last })
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { raw: cleaned };
    }

    const record = await prisma.patientRecord.create({
      data: {
        patientName,
        data: parsed,
      },
    });

    return NextResponse.json({
      id: record.id,
      patientName: record.patientName,
    });
  } catch (err: any) {
    console.error("OCR API Error:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
