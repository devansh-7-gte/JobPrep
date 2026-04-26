import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

/**
 * Generates industry insights using Gemini
 */
export const generateIndustryInsights = async (industry) => {
  const apiKey = process.env.GEMINI_API_KEY;
  

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT:
- Return ONLY JSON
- At least 5 roles
- At least 5 skills and trends
`;

  const fetchWithRetry = async (retries = 5, delay = 1000) => {
    try {
      console.log("🚀 Calling Gemini API...");

      // ⏱ Timeout setup
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      });

      clearTimeout(timeout);

      console.log("📡 Status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ API Error:", errText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("🧾 Raw Result:", result);

      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      console.log("🤖 AI Raw Text:", text);

      // 🧠 Extract JSON safely (handles bad formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        console.error("❌ No JSON found in response");
        throw new Error("Invalid AI response format");
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error("❌ JSON Parse Error:", jsonMatch[0]);
        throw new Error("Failed to parse AI JSON");
      }

      console.log("✅ Parsed JSON:", parsed);

      return parsed;

    } catch (error) {
      console.error(`⚠️ Retry attempt failed: ${error.message}`);

      if (retries > 0) {
        console.log(`🔁 Retrying... (${retries} left)`);
        await new Promise((res) => setTimeout(res, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }

      console.error("🔥 All retries failed");
      throw error;
    }
  };

  return await fetchWithRetry();
};

/**
 * Retrieves industry insights for the authenticated user
 */
export async function getIndustryInsights(industry) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("👤 User ID:", userId);

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  console.log("📦 Existing Insight:", user.industryInsight);

  // If no insights exist → generate
  if (!user.industryInsight) {
    try {
      console.log("🧠 Generating new insights...");

      const insights = await generateIndustryInsights(industry);

      console.log("💾 Saving to DB...");

      const industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry || industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          userId: user.id,
        },
      });

      console.log("✅ Saved successfully");

      return industryInsight;

    } catch (error) {
      console.error("❌ Failed to generate/save insights:", error);
      throw new Error("Insight generation failed");
    }
  }

  // Optional: refresh if outdated
  if (
    user.industryInsight.nextUpdate &&
    new Date(user.industryInsight.nextUpdate) < new Date()
  ) {
    console.log("🔄 Insight outdated (you can refresh in background)");
  }

  return user.industryInsight;
}