import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function getGeminiModel(type: "report" | "chat" = "report") {
  if (!genAI) return null;

  return genAI.getGenerativeModel({
    model: type === "chat" ? "gemini-2.5-flash-lite" : "gemini-2.5-flash",
  });
}