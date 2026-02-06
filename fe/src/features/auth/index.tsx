"use client";

import { VerificationModel } from "./components/VerificationModel";
import { useState, useEffect } from "react";
import { EmailLoginForm } from "./components/EmailModel";
import {
  useSendSignupCode,
  useVerifySignup,
  useVerifySignin,
} from "@/hooks/auth";
import { SendCodeResponse } from "../../../../shared/types/user.types";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast/headless";

export const AuthFeature = () => {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const { mutate: sendSignupCode, isPending: isSendingCode } =
    useSendSignupCode();
  const verifySignupMutation = useVerifySignup();
  const {
    mutate: verifySignup,
    isPending: isVerifyingSignup,
    isSuccess: isSignupSuccess,
  } = verifySignupMutation;
  const { mutate: verifySignin, isPending: isVerifyingSignin } =
    useVerifySignin();

  const handleEmailSubmit = (email: string) => {
    setEmail(email);
    sendSignupCode(
      { email },
      {
        onSuccess: (res: SendCodeResponse) => {
          setStep("verify");
          setIsExistingUser(res?.data?.isExistingUser ?? null);
        },
        onError: (error) => {
          console.log("Signup error:", error);
        },
      },
    );
  };

  const handleVerifySubmit = (code: string) => {
    if (isExistingUser) {
      verifySignin(
        { email, verificationCode: code },
        {
          onSuccess: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/dashboard";
            }
          },
          onError: (error) => {
            console.log("Verify signin error:", error);
          },
        },
      );
    } else {
      verifySignup(
        { email, verificationCode: code },
        {
          onSuccess: () => {},
          onError: (error) => {
            console.log("Verify signup error:", error);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("GitHub login failed. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    if (isSignupSuccess) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isSignupSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {step === "email" ? (
        <EmailLoginForm
          onSubmit={handleEmailSubmit}
          isLoading={isSendingCode}
        />
      ) : (
        <VerificationModel
          onSubmit={handleVerifySubmit}
          isLoading={isExistingUser ? isVerifyingSignin : isVerifyingSignup}
        />
      )}
    </div>
  );
};
