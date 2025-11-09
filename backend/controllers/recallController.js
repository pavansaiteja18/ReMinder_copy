import dotenv from "dotenv";
import fetch from "node-fetch";
import Task from "../models/Task.js";

dotenv.config();

/**
 * ✅ Gemini-only Recall Controller (Stable + Clean)
 */
export const recallSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // ✅ Fetch tasks
    const tasks = await Task.find().lean();
    if (!tasks.length) {
      return res.status(200).json({
        answer: "No tasks found in the database.",
        sources: [],
      });
    }

    // ✅ Build structured prompt
    const prompt = `
You are an intelligent task management assistant.
Below is a list of tasks in JSON format:
${JSON.stringify(tasks, null, 2)}

Answer the following query briefly and clearly:
"${query}"

Include deadlines, owners, and priorities where relevant.
`;

    // ✅ Load Google API Key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GOOGLE_API_KEY in environment variables.");
    }

    // ✅ Gemini API Endpoint (Stable)
    // const url = `https://generativelanguage.googleapis.com/v1/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;



    // ✅ Send request
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    // 🔍 Debug response if something goes wrong
    if (!data.candidates) {
      console.error("🚨 Gemini API Raw Response:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || "Empty response from Gemini API");
    }

    // ✅ Extract AI response text safely
    const aiResponse =
      data.candidates[0]?.content?.parts
        ?.map((p) => p.text)
        ?.join(" ")
        ?.trim() || "⚠️ Gemini returned no  text.";
        

    // ✅ Prepare sources for reference
    const sources = tasks.slice(0, 5).map((t) => ({
      id: t._id,
      title: t.title,
      date: t.deadline ? new Date(t.deadline).toDateString() : "No deadline",
      excerpt: `Owner: ${t.owner}, Priority: ${t.priority}, Status: ${t.status}`,
    }));

    // ✅ Send response
    res.json({
      answer: aiResponse,
      sources,
      provider: "Gemini",
    });
  } catch (error) {
    console.error("❌ Recall Search Error:", error);
    res.status(500).json({
      message: "Recall search failed",
      error: error.message,
    });
  }
};
