import { prisma } from "../../server/db";
import Link from "next/link";


export const dynamic = "force-dynamic";


export default async function PatientsPage() {
const patients = await prisma.patientRecord.findMany({ orderBy: { createdAt: "desc" } });


return (
<main className="container mx-auto px-4 py-10">
<h1 className="text-3xl font-semibold">Patients</h1>
<div className="mt-6 divide-y rounded-2xl border bg-card">
{patients.length === 0 && (
<div className="p-6 text-sm text-muted-foreground">No records yet. Create one from the home page.</div>
)}
{patients.map((p) => (
<Link key={p.id} href={`/patients/${p.id}`} className="block p-4 hover:bg-muted/50">
<div className="flex items-center justify-between">
<div>
<div className="font-medium">{p.patientName}</div>
<div className="text-xs text-muted-foreground">{p.id}</div>
</div>
<div className="text-xs text-muted-foreground">{p.createdAt.toISOString()}</div>
</div>
</Link>
))}
</div>
</main>
);
}