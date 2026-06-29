import React from "react";
import { checkUser } from "@/lib/checkUser";
import SimulatorClient from "./_components/simulator-client";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function SimulatorPage() {
  const user = await checkUser();
  const initialSalary = user?.salary || 60000;

  return <SimulatorClient initialSalary={initialSalary} />;
}
