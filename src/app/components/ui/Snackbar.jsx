"use client";

import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import usePackageStore from "@/stores/usePackageStore";

export default function Snackbar() {
  const { snackbar, closeSnackbar } = usePackageStore();

  useEffect(() => {
    if (snackbar.open) {
      // show toast dynamically based on type
      switch (snackbar.type) {
        case "success":
          toast.success(snackbar.message);
          break;
        case "error":
          toast.error(snackbar.message);
          break;
        default:
          toast.message(snackbar.message);
      }

      // auto-close snackbar state after display
      const timer = setTimeout(() => closeSnackbar(), 1000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  // ✅ Place Toaster once (Sonner handles internal stack)
  return <Toaster position="top-center" richColors expand />;
}
