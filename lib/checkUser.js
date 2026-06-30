import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { getGuestSession } from "./guest";
import { seedUserData } from "@/actions/seed";

export const checkUser = async () => {
  let user = null;
  try {
    user = await currentUser();
  } catch (clerkError) {
    console.error("Clerk currentUser fetch failed:", clerkError);
  }

  // If no Clerk user, check for guest session
  if (!user) {
    const guestUser = await getGuestSession();
    return guestUser;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    // Create a default account for the new user
    const defaultAccount = await db.account.create({
      data: {
        name: "Main Account",
        type: "CURRENT",
        balance: 1000,
        isDefault: true,
        userId: newUser.id,
      },
    });

    // Seed demo data for the new user
    try {
      await seedUserData(newUser.id, defaultAccount.id);
    } catch (seedError) {
      console.error("Error seeding new user data:", seedError);
      // Continue without seeding if it fails
    }

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
