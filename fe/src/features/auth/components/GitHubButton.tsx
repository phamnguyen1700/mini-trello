"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const GITHUB_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;

export const GitHubButton = () => {
  const handleClick = () => {
    window.location.href = GITHUB_AUTH_URL;
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      <Github className="w-5 h-5" />
      Sign in with GitHub
    </Button>
  );
};
