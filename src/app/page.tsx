import { UploadOcrCard } from "../components/upload-ocr-card";


export default function HomePage() {
return (
<main className="min-h-dvh bg-gradient-to-b from-background to-muted/40">
<section className="container mx-auto px-4 py-16 text-center">
<h1 className="text-4xl md:text-6xl font-bold tracking-tight">mediocr</h1>
<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
Turn messy medical images or pasted notes into structured, queryable records. Drop an image, click process, and get a clean JSON record saved to your database.
</p>
</section>


<section className="container mx-auto px-4 pb-16">
<UploadOcrCard />
</section>
</main>
);
}