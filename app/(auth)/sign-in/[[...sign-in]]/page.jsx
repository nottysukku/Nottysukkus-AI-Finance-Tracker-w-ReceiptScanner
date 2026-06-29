import { SignIn } from "@clerk/nextjs";
import GuestSignIn from "@/components/guest-signin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getGuestSession } from "@/lib/guest";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function Page() {
  const guestSession = await getGuestSession();
  if (guestSession) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <SignIn />
      
      {/* Guest Sign-In Option */}
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Or try without signing up</CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore the platform with a guest account. Your data will be temporary.
          </p>
        </CardHeader>
        <CardContent>
          <GuestSignIn />
        </CardContent>
      </Card>
    </div>
  );
}
