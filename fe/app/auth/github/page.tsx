import { Suspense } from "react";
import { GitHubCallbackFeature } from "@/features/auth/github";

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GitHubCallbackFeature />
    </Suspense>
  );
}
