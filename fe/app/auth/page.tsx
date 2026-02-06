import { AuthFeature } from "@/features/auth";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthFeature />
    </Suspense>
  );
}
