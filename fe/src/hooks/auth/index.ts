import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { toast } from "react-hot-toast";

export const useSendSignupCode = () => {
  return useMutation({
    mutationFn: authService.sendSignupCode,
    onSuccess: () => {
      toast.success("Verification code sent to your email!");
    },
   onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification code",
      );
    },
  });
};

export const useVerifySignup = () => {
  return useMutation({
    mutationFn: authService.verifySignup,
    onSuccess: () => {
      toast.success("Account created! Please login.");
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 5000);
    },
    onError: (error) => {
        error instanceof Error ? error.message : "Invalid verification code",
    },
  });
};

export const useSendSigninCode = () => {
  return useMutation({
    mutationFn: authService.sendSigninCode,
    onSuccess: () => {
      toast.success("Verification code sent to your email!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification code",
      );
    },
  });
};

export const useVerifySignin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.verifySignin,
    onSuccess: (data) => {
      setAuth(data.data.accessToken, data.data.user);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Invalid verification code",
      );
    },
  });
};
