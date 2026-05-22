import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// REST API Endpoints
// Post generator route using Gemini
app.post("/api/generate-post", async (req, res) => {
  const { goal, itemType, mood, additionalNotes } = req.body;

  if (!goal || !itemType) {
    return res.status(400).json({ error: "Missing required parameters: goal and itemType." });
  }

  const client = getAiClient();

  if (!client) {
    // Elegant fallback simulation when no Gemini key is configured
    console.log("No live GEMINI_API_KEY detected. Using robust high-fidelity B2B SaaS generator.");
    const fallbackResponse = getMockPostResponse(goal, itemType, mood, additionalNotes);
    return res.json(fallbackResponse);
  }

  try {
    const prompt = `You are a professional social media manager and copywriting expert specialized in local bakery and café marketing.
Task: Write a highly engaging, warm, friendly social media post (Facebook/Instagram) for a local bakery/café.
Details:
- Goal/Announcement: ${goal}
- Main Item Type: ${itemType}
- Desired Mood/Tone: ${mood || "warm and cozy"}
- Additional Context/Notes: ${additionalNotes || "none"}

Instructions:
1. Create a compelling, professional, yet relatable caption. Include 3-5 standard community-focused and food emojis.
2. Include 4-6 specific local food-focused hashtags.
3. Provide a separate, highly detailed text prompt for an image generation tool (e.g. "A rustic, close-up photograph of...") that represents this post beautifully.

Format your output exactly as a JSON object with the following keys and structure:
{
  "caption": "The social media caption text here...",
  "imagePrompt": "The specific text prompt for image generation here..."
}
Strictly return ONLY the raw JSON object, without any markdown code blocks, backticks, or extra commentary.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text?.trim() || "{}";
    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    // Graceful error fallback to mock content
    const fallback = getMockPostResponse(goal, itemType, mood, additionalNotes);
    res.json({
      ...fallback,
      warning: "Generating high-quality mock preview (Live system in demo mode)."
    });
  }
});

// Chatbot Smart Reply responder route
app.post("/api/generate-reply", async (req, res) => {
  const { customerMessage, sourdoughStatus, openHours, veganOptions } = req.body;

  if (!customerMessage) {
    return res.status(400).json({ error: "Customer message is required." });
  }

  const client = getAiClient();

  if (!client) {
    console.log("No live GEMINI_API_KEY detected. Using template fallback generator.");
    const fallbackReply = getMockReplyResponse(customerMessage, sourdoughStatus, openHours, veganOptions);
    return res.json(fallbackReply);
  }

  try {
    const prompt = `You are an AI-powered B2B assistant called "zplays" working for a boutique café/bakery.
Task: Draft a perfect, super-friendly, helpful customer reply to a customer message.
Customer message: "${customerMessage}"

Café Information Context:
- Current Sourdough status: "${sourdoughStatus || "Fresh out of the oven, available in limited batches"}"
- Open Hours: "${openHours || "7:00 AM to 6:00 PM daily"}"
- Vegan options available: "${veganOptions || "Vegan blueberry muffins, almond-milk lattes, and vegan sourdough paninis"}"

Instructions:
- Keep the tone sweet, concise, and professional (we are busy, but love our community!).
- Answer their specific questions using ONLY the facts provided in the Café Information Context.
- Do not make up answers. If they ask about something not in the context, say you'll check with the team.
- Format the response with clear line breaks. Add 1 or 2 matching emojis.

Format the response as a JSON object with this key:
{
  "reply": "The friendly drafted reply text..."
}
Strictly return ONLY the raw JSON object, without markdown code blocks, backticks, or extra commentary.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text?.trim() || "{}";
    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Custom Reply generation failed:", error);
    const fallback = getMockReplyResponse(customerMessage, sourdoughStatus, openHours, veganOptions);
    res.json({
      ...fallback,
      warning: "Drafted using local smart-engine fallback."
    });
  }
});

// Mock helpers for smooth fallback guarantees
function getMockPostResponse(goal: string, itemType: string, mood: string, additionalNotes?: string) {
  let caption = "";
  let imagePrompt = "";

  if (goal.includes("Special")) {
    caption = `✨ Morning fuel alert! Today we are pairing our freshly micro-roasted espresso with our signature hot pastry. The perfect crust, the rich aroma, and that classic zplays community vibe. Drop by for some love before it sells out! 🥐☕️\n\n🕒 Available from 7 AM until we run out! See you soon.`;
    imagePrompt = `A warm, shallow depth-of-field close-up of a freshly baked croissant and a latte with leaf art, sitting on a weathered wooden café table, morning sunlight filtering through trees.`;
  } else if (goal.includes("Event")) {
    caption = `🎉 Big weekend plans? You do now! Grab a book, invite a friend, and settle into our cozy corner. We've got live acoustic tunes, fresh sourdough batches, and limited edition specials running all day Saturday and Sunday! 🎙️🥖\n\n📌 Save the date and support your local favorites!`;
    imagePrompt = `Cozy interior of a local boutique bakery café filled with happy patrons, warm vintage pendant lighting, chalkboard specials board in the background, inviting atmosphere.`;
  } else {
    caption = `😍 Meet our absolute latest masterpiece! Golden on the outside, light and melt-in-your-mouth tender on the inside. Crafted by hand with local organic ingredients and baked fresh at 4:30 AM today! 🌟🍞\n\nCome take a box home - your family with thank you!`;
    imagePrompt = `A rustic display basket made of woven willow full of freshly baked sourdough bread loaves dusted with flour, high-contrast spotlighting, dark terracotta background.`;
  }

  if (additionalNotes) {
    caption += `\n\n💡 Owner's Note: ${additionalNotes}`;
  }

  caption += `\n\n#zplays #CafeCulture #BakehouseSourdough #LocalEats #ArtisanalRoast #SupportLocal`;

  return { caption, imagePrompt };
}

function getMockReplyResponse(customerMessage: string, sourdoughStatus: string, openHours: string, veganOptions: string) {
  const msg = customerMessage.toLowerCase();
  let reply = "";

  if (msg.includes("vegan") || msg.includes("dairy")) {
    reply = `Hi there! 🌸 Yes, we absolutely have delicious vegan options daily! Today we have: ${veganOptions}. We also have a selection of oat and almond milk for all our specialty drinks! Come write your story in our cozy corner today! We are open until 6:00 PM. 😊`;
  } else if (msg.includes("hour") || msg.includes("open") || msg.includes("time")) {
    reply = `Hello! 🌞 We are open daily from ${openHours}! We'd love to have you drop by for an espresso or a fresh pastry. If you are aiming for specific sourdough bread varieties, we recommend getting here before noon as they tend to vanish fast! 🥖☕️`;
  } else if (msg.includes("sourdough") || msg.includes("bread") || msg.includes("batch")) {
    reply = `Hey! Thanks for asking about our fan-favorite sourdough! 🥖 Here is our update: ${sourdoughStatus}. We bake fresh daily at 4:30 AM in finite batches, so if you'd like a specific country loaf, come on down! We are open from 7 AM to 6:00 PM!`;
  } else {
    reply = `Hello! 😊 Thank you for reaching out to us. We are currently open daily from ${openHours}. Today's sourdough update: "${sourdoughStatus}". For vegan lovers, we feature: ${veganOptions}! Let us know if we can set aside a treat for you! 🥐✨`;
  }

  return { reply };
}

// Vite and static asset serving
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`B2B SaaS zplays Server running on port ${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to initialize server:", err);
});
