# 🩺 MediOCR — Intelligent Medical Document OCR & Structuring

MediOCR is an AI-powered medical document parser built with **Next.js**, **Google Gemini 2.5**, and **Prisma**. It extracts structured clinical data (e.g., patient demographics, vitals, diagnosis, and treatment plans) from uploaded medical reports or typed text, and saves the results in a database for further analysis or display.

---

## 🚀 Features

* **AI-driven OCR & parsing** — Uses **Google Gemini 2.5 Flash** to extract structured JSON from handwritten or printed documents.
* **Multimodal input** — Accepts both **image uploads** and **text input**.
* **Automatic JSON extraction** — Cleans Gemini output, removing Markdown fences like `````json````, and stores clean JSON.
* **Secure storage** — Persists extracted data in a **Prisma-powered database**.
* **Next.js API route** — Modular, server-side API (`/api/ocr`) for text extraction and parsing.
* **Modern TypeScript stack** — Built using the latest Next.js conventions and Google’s official `@google/genai` SDK.

---

## 🧠 How It Works

1. User uploads a medical document (e.g., OPD report, prescription) **or** enters text manually.
2. The `/api/ocr` route:

   * Uploads the image to **Gemini’s file endpoint**.
   * Prompts Gemini with:
     *“Extract structured medical information and return strictly as JSON.”*
3. Gemini responds with structured JSON (e.g., patient details, diagnosis, vitals, plan).
4. The route cleans and parses the response, removing extra formatting like ``raw `json ...` ```.
5. The parsed data is stored in the database and linked to the patient record.

---

## 🧩 Tech Stack

| Layer              | Technology                                         |
| ------------------ | -------------------------------------------------- |
| **Frontend / API** | Next.js (App Router, TypeScript)                   |
| **AI Model**       | Google Gemini 2.5 Flash via `@google/genai`        |
| **Database**       | Prisma ORM (SQLite / PostgreSQL / MySQL supported) |
| **Environment**    | Node.js 18+                                        |
| **Deployment**     | Vercel / Docker / Local                            |

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mediocr.git
cd mediocr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
# .env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_google_genai_api_key_here"
```

> To obtain a Gemini API key, visit: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 4. Initialize Prisma

```bash
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
```

The app will be live at [http://localhost:3000](http://localhost:3000)

---

## 🧾 API Reference

### **POST** `/api/ocr`

Extracts structured data from a file or text.

#### Request

| Field         | Type                  | Description                                   |
| ------------- | --------------------- | --------------------------------------------- |
| `file`        | `File` *(optional)*   | Uploaded medical document (e.g., image, PDF). |
| `text`        | `string` *(optional)* | Direct text input instead of file upload.     |
| `patientName` | `string` *(optional)* | Optional patient identifier.                  |

#### Response

```json
{
  "id": "cmhrk85ct0000glawud2dgypq",
  "patientName": "Rajaram"
}
```

The detailed structured data is stored in the database (`patientRecord.data`).

---

## 🧰 Example Gemini Output

```json
{
  "patient_information": {
    "date": "06/11/2025",
    "time": "1000",
    "name": "Rajaram",
    "age": "56 years",
    "sex": "Male",
    "hospital_number": "6543210"
  },
  "presenting_complaint": "Dizziness, headache, increased BP noted at workplace",
  "observations_vitals": {
    "blood_pressure": {
      "current": "160/92 mmHg",
      "reported": "158/90 mmHg"
    },
    "heart_rate": "80 bpm",
    "respiratory_rate": "16 cpm",
    "temperature": "36.7 °C",
    "bmi": "29.4 kg/m²"
  },
  "diagnosis": "Stage 1 HTN (Hypertension)",
  "management_plan": {
    "medication": [
      {
        "name": "Amlodipine",
        "dosage": "5 mg",
        "frequency": "OD"
      }
    ],
    "advice": "Lifestyle modification advice",
    "follow_up": "Review in 4 weeks"
  }
}
```

---

## 🧪 Debugging Notes

* If you see `"raw ```json {...}`"`output, the parser in`route.ts` automatically strips the markdown.
* For Next.js route conflicts (`route` vs `page`), ensure there is **no `page.tsx`** under `/patients/[id]` if you use an API route there.
* To inspect available Gemini models, run:

```bash
node listmodels.mjs
```

---

## 🧭 Project Structure

```
mediocr/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ocr/
│   │   │       └── route.ts      # Core OCR logic
│   │   ├── patients/              # Patient record pages
│   │   └── page.tsx               # Home UI
│   └── server/
│       └── db.ts                  # Prisma client
├── prisma/
│   └── schema.prisma
├── .env
├── README.md
└── package.json
```

---

## 📚 Resources

* [Gemini API Reference](https://ai.google.dev/gemini-api/docs)
* [Next.js App Router Docs](https://nextjs.org/docs/app)
* [Prisma Documentation](https://www.prisma.io/docs)

---

## 🩹 License

Licensed under the **MIT License**.
Copyright © 2025.


