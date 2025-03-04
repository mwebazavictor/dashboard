// hooks/useApiErrorHandler.ts
import { useRouter } from "next/navigation";

export function useApiErrorHandler() {
  const router = useRouter();
  const handleApiError = (error: any) => {
    if (error.isForbidden || error.message.toLowerCase().includes("forbidden")) {
      router.push("/login");
    } else {
      console.error("API Error:", error);
      // Optionally show a toast or notification
    }
  };

  return handleApiError;
}
