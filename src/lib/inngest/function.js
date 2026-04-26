import { db } from "@/lib/prisma";
import { inngest } from "./client";

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights-cron" },
  { cron: "0 0 * * 0" }, // Sunday midnight
  async ({ step }) => {

    // 🔹 Step 1: Fetch industries
    const industries = await step.run("fetch-industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    // 🔹 Step 2: Process each industry
    for (const { industry } of industries) {

      await step.run(`process-${industry}`, async () => {
        try {
          console.log(`🧠 Generating insights for ${industry}`);

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `
Analyze the current state of the ${industry} industry and return ONLY valid JSON:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1"],
  "recommendedSkills": ["skill1"]
}
                        `,
                      },
                    ],
                  },
                ],
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`API failed: ${response.status}`);
          }

          const result = await response.json();

          const text =
            result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // 🔥 Extract JSON safely
          const jsonMatch = text.match(/\{[\s\S]*\}/);

          if (!jsonMatch) {
            throw new Error("No JSON found");
          }

          let insights;
          try {
            insights = JSON.parse(jsonMatch[0]);
          } catch (err) {
            console.error("❌ JSON Parse Error:", jsonMatch[0]);
            throw new Error("Invalid JSON");
          }

          // 🔹 Step 3: Update DB
          await db.industryInsight.update({
            where: { industry },
            data: {
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });

          console.log(`✅ Updated ${industry}`);

        } catch (error) {
          console.error(`❌ Failed for ${industry}:`, error.message);
          // 👉 Important: don't throw → continue loop
        }
      });
    }

    return { success: true };
  }
);