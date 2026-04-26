"use server";
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateIndustryInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    // 🔥 STEP 1: Check industry OUTSIDE transaction
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    // 🔥 STEP 2: Call AI OUTSIDE transaction (CRITICAL FIX)
    if (!industryInsight) {
      console.log("🧠 Generating industry insights...");

      const insights = await generateIndustryInsights(data.industry);

      console.log("💾 Creating industry insight...");

      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // 🔥 STEP 3: FAST transaction (DB only)
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        industry: data.industry,
        experienceLevel: data.experienceLevel,
        bio: data.bio,
        skills: data.skills,
      },
    });

    return {
      success: true,
      updatedUser,
      industryInsight,
    };

  } catch (error) {
    console.error("❌ ERROR:", error);
    throw new Error("Failed to update user");
  }
}
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    if (!user) throw new Error("User not found");

    return {
      isOnboarded: !!user?.industry,
    };

  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}