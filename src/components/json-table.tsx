"use client";
import * as React from "react";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";


// Recursively renders unknown JSON as a compact key/value table
export function JsonTable({ data }: { data: unknown }) {
return (
<Card className="w-full overflow-hidden">
<CardContent className="p-0">
<div className="grid grid-cols-1 divide-y">
<Kv data={data} path={[]} />
</div>
</CardContent>
</Card>
);
}


function Kv({ data, path }: { data: any; path: string[] }) {
if (data === null || typeof data !== "object") {
return (
<div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2 p-3">
<div className="sm:col-span-4 font-medium break-words">{path.join(".") || "value"}</div>
<div className="sm:col-span-8 break-words text-sm">{String(data)}</div>
</div>
);
}


if (Array.isArray(data)) {
return (
<div className="p-3 space-y-3">
<div className="font-medium">{path.join(".") || "list"}</div>
<div className="space-y-2">
{data.map((item, idx) => (
<div key={idx} className="rounded-xl border p-3">
<Kv data={item} path={[...path, String(idx)]} />
</div>
))}
</div>
</div>
);
}


return (
<div className="">
{Object.entries(data as Record<string, any>).map(([k, v]) => (
<div key={k} className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2 p-3">
<div className="sm:col-span-4 font-medium break-words">{[...path, k].join(".")}</div>
<div className="sm:col-span-8">
{typeof v === "object" && v !== null ? (
<div className="rounded-xl border bg-muted/30">
<Kv data={v} path={[...path, k]} />
</div>
) : (
<div className="break-words text-sm">{String(v)}</div>
)}
</div>
</div>
))}
</div>
);
}