import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini-client";

export async function POST(req: Request) {
  try {
    const { report, question, messages } = await req.json();

    const model = getGeminiModel("chat");

    if (!model) {
      return NextResponse.json({
        answer:
          "Gemini API key is missing. Add GEMINI_API_KEY in .env.local and restart the server.",
      });
    }

    const prompt = `
You are Launch Lens Copilot.

Answer based only on this startup report.

Report:
${JSON.stringify(report, null, 2)}

Recent messages:
${JSON.stringify(messages?.slice(-8), null, 2)}

Question:
${question}

Give useful, practical, short advice.
`;

    const result = await model.generateContent(prompt);

    return NextResponse.json({
      answer: result.response.text(),
    });
  } catch (error: any) {
    console.error("Copilot error:", error);

    return NextResponse.json({
      answer:
        error?.message ||
        "Copilot failed because the AI request could not complete.",
    });
  }
}