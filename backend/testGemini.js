import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function main() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔑 Using key:", apiKey ? apiKey.slice(0, 10) + "..." : "❌ Not found");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("⚙️  Testing Gemini model...");

    const prompt = "Write a 2-line motivational quote for developers.";

    const result = await model.generateContent(prompt);

    // Safe access check
    const text =
      result?.response?.text?.() ||
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No text returned";

    console.log("✅ Gemini Response:\n", text);
  } catch (err) {
    console.error("❌ Gemini Error:", err);
  }
}

main();
