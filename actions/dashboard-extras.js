"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser, isAuthenticated } from "@/lib/auth";

// --- GOALS ACTIONS ---

export async function getUserGoals() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) return [];

    const user = await getUser();
    if (!user) return [];

    const goals = await db.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return goals.map(g => ({
      ...g,
      target: g.target.toNumber(),
      current: g.current.toNumber(),
    }));
  } catch (error) {
    console.error("Error in getUserGoals:", error);
    return [];
  }
}

export async function createGoal(data) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) throw new Error("Unauthorized");

    const user = await getUser();
    if (!user) throw new Error("User not found");

    const goal = await db.goal.create({
      data: {
        name: data.name,
        target: parseFloat(data.target),
        current: parseFloat(data.current) || 0,
        deadline: data.deadline ? new Date(data.deadline) : null,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { ...goal, target: goal.target.toNumber(), current: goal.current.toNumber() } };
  } catch (error) {
    console.error("Error in createGoal:", error);
    throw new Error(error.message);
  }
}

export async function updateGoalProgress(goalId, newAmount) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) throw new Error("Unauthorized");

    const goal = await db.goal.update({
      where: { id: goalId },
      data: {
        current: parseFloat(newAmount),
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { ...goal, target: goal.target.toNumber(), current: goal.current.toNumber() } };
  } catch (error) {
    console.error("Error in updateGoalProgress:", error);
    throw new Error(error.message);
  }
}

export async function deleteGoal(goalId) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) throw new Error("Unauthorized");

    await db.goal.delete({
      where: { id: goalId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteGoal:", error);
    throw new Error(error.message);
  }
}

// --- SUBSCRIPTIONS ACTIONS ---

export async function getUserSubscriptions() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) return [];

    const user = await getUser();
    if (!user) return [];

    const subscriptions = await db.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return subscriptions.map(s => ({
      ...s,
      amount: s.amount.toNumber(),
    }));
  } catch (error) {
    console.error("Error in getUserSubscriptions:", error);
    return [];
  }
}

export async function createSubscription(data) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) throw new Error("Unauthorized");

    const user = await getUser();
    if (!user) throw new Error("User not found");

    const sub = await db.subscription.create({
      data: {
        name: data.name,
        amount: parseFloat(data.amount),
        billingCycle: data.billingCycle,
        startDate: new Date(data.startDate),
        nextPayment: new Date(data.nextPayment),
        category: data.category || "entertainment",
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { ...sub, amount: sub.amount.toNumber() } };
  } catch (error) {
    console.error("Error in createSubscription:", error);
    throw new Error(error.message);
  }
}

export async function deleteSubscription(subId) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) throw new Error("Unauthorized");

    await db.subscription.delete({
      where: { id: subId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteSubscription:", error);
    throw new Error(error.message);
  }
}
