"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useGitHubCallback } from "@/hooks/auth";

export const GitHubCallbackFeature = () => {
  const searchParams = useSearchParams();
  const { handleCallback } = useGitHubCallback();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    handleCallback(code, error);
  }, [searchParams, handleCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-subtle">Signing in with GitHub...</p>
    </div>
  );
};
