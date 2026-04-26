import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

/**
 * Syncs the Clerk user with the internal database.
 * Handles the "Unique constraint failed" error by checking for 
 * existing emails before attempting creation.
 */
export const checkUser = async () => {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  try {
    // 1. Check if user exists by Clerk ID (Primary lookup)
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // 2. Critical Fix: Check if user exists by Email to avoid unique constraint error
    // This prevents the crash if the user exists but doesn't have a clerkUserId linked yet.
    const userEmail = user.emailAddresses[0].emailAddress;
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (existingUserByEmail) {
      // Update the existing record with the Clerk ID if it's missing
      return await db.user.update({
        where: { email: userEmail },
        data: { clerkUserId: user.id },
      });
    }

    // 3. Create new user if no match found by ID or Email
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || "Anonymous User",
        imageUrl: user.imageUrl,
        email: userEmail,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser logic:", error);
    throw error;
  }
};