"use client";

import { useState } from "react";
import { emailSchema } from "@/lib/validation/auth";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmailLoginFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export const EmailLoginForm = ({
  onSubmit,
  isLoading,
}: EmailLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError("Invalid email address");
      return;
    }
    setError("");
    onSubmit(email);
  };

  return (
    <Card className="p-10">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg object-contain"
            priority
          />
        </div>

        <h1 className="text-center text-xl font-medium">Log in to continue</h1>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="input-auth"
        />
        {error && (
          <div className="text-red-500 text-sm text-center mt-1">{error}</div>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="btn-auth w-full"
          >
            {isLoading ? "Loading..." : "Continue"}
          </Button>
        </div>

        <div className="pt-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Privacy Policy</div>
          <div className="text-xs text-gray-500">
            <span>
              This site is protected by reCAPTCHA and the Google
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mx-1"
              >
                Privacy Policy
              </a>
            </span>
            <br />
            <span>
              and
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mx-1"
              >
                Terms of Service
              </a>
              apply.
            </span>
          </div>
        </div>
      </form>
    </Card>
  );
};
