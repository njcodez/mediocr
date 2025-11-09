"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export function UploadOcrCard() {
  const [file, setFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState("");
  const [patientName, setPatientName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onDrop = React.useCallback((accepted: File[]) => {
    setFile(accepted[0] ?? null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  async function handleProcess() {
    try {
      setLoading(true);
      const form = new FormData();
      if (file) form.append("file", file);
      if (text.trim()) form.append("text", text.trim());
      if (patientName.trim()) form.append("patientName", patientName.trim());

      const res = await fetch("/api/ocr", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process");

      toast.success(`Saved record for ${data.patientName}`);
      window.location.href = "/patients";
    } catch (err: any) {
      toast.error(err.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Extract medical data</CardTitle>
        <CardDescription>
          Upload an image or paste text, then process with Gemini to create a structured record.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient name (optional)</label>
            <Input
              value={patientName}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPatientName(e.target.value)}
              placeholder="e.g. Priya Sharma"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste text (optional)</label>
            <Textarea
              value={text}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setText(e.target.value)}
              placeholder="Paste OCR text or notes here"
              rows={4}
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
            isDragActive ? "bg-muted" : "bg-muted/40"
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="text-sm">Selected: {file.name}</div>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">Drag & drop medical image here</p>
              <p className="text-xs text-muted-foreground">PNG, JPG. You can also click to select a file.</p>
            </div>
          )}
        </div>

        <Button onClick={handleProcess} disabled={loading || (!file && !text)}>
          {loading ? "Processing…" : "Process & Save"}
        </Button>
      </CardContent>
    </Card>
  );
}
