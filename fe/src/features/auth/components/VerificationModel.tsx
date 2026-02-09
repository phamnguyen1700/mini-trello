"use client";

import { useState } from "react";
import { codeSchema } from "@/lib/validation/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VerificationModelProps {
  onSubmit: (code: string) => void;
  isLoading?: boolean;
}

export const VerificationModel = ({
  onSubmit,
  isLoading,
}: VerificationModelProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = codeSchema.safeParse({ code });
    if (!result.success) {
      setError("Must contain 6 numbers");
      return;
    }
    setError("");
    onSubmit(code);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-2">
        <h1 className="text-center text-4xl font-bold mb-2">
          Email Verification
        </h1>
        <div className="text-center text-lg text-soft mb-2">
          Please enter your code that send to your email address
        </div>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter code verification"
          value={code}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setCode(val);
          }}
          required
          disabled={isLoading}
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
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
        <div className="pt-4 text-center">
          <div className="text-sm text-soft mb-1">Privacy Policy</div>
          <div className="text-xs text-subtle">
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
