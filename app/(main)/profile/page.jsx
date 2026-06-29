import React from "react";
import { checkUser } from "@/lib/checkUser";
import ProfileClient from "./_components/profile-client";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await checkUser();

  return <ProfileClient initialUser={user} />;
}
