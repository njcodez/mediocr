"use client";

import { useEffect, useState, type JSX } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";

export default function PatientDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/patients/${id}`);
      const data = await res.json();
      setRecord(data);
    }
    fetchData();
  }, [id]);

  if (!record) return <div className="p-6">Loading...</div>;

  const renderJSON = (obj: any): JSX.Element => {
    if (typeof obj !== "object" || obj === null) {
      return <span>{String(obj)}</span>;
    }

    if (Array.isArray(obj)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {obj.map((item, i) => (
            <li key={i}>{renderJSON(item)}</li>
          ))}
        </ul>
      );
    }

    return (
      <table className="w-full border border-muted rounded-lg my-2">
        <tbody>
          {Object.entries(obj).map(([key, value]) => (
            <tr key={key} className="border-b border-muted/40">
              <td className="p-2 font-medium text-sm align-top w-1/3">{key}</td>
              <td className="p-2 text-sm">{renderJSON(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {record.patientName ?? "Unknown Patient"}
          </CardTitle>
          <Separator className="my-2" />
        </CardHeader>
        <CardContent>{renderJSON(record.data)}</CardContent>
      </Card>
    </div>
  );
}
