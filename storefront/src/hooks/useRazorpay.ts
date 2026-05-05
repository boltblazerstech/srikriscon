"use client";

import { useCallback, useRef, useState } from "react";
import api from "@/src/lib/api";
import { theme } from "@/src/config/theme";
import type {
  PaymentInitResponse,
  PaymentVerifyRequest,
  RazorpayCheckoutOptions,
} from "@/src/types";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => { open(): void };
  }
}

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)) {
      return resolve(Boolean(window.Razorpay));
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface PayOptions {
  orderId: number;       // Our backend order ID
  name?: string;         // Customer name (for prefill)
  email?: string;
  contact?: string;
  description?: string;
  onSuccess?: (data: PaymentVerifyRequest) => void;
  onError?: (error: Error) => void;
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const scriptLoaded = useRef(false);

  const pay = useCallback(async (opts: PayOptions) => {
    setLoading(true);
    try {
      // 1. Load Razorpay SDK
      if (!scriptLoaded.current) {
        const ok = await loadScript();
        if (!ok) throw new Error("Failed to load Razorpay SDK");
        scriptLoaded.current = true;
      }

      // 2. Create a Razorpay order on our backend
      const init: PaymentInitResponse = await api
        .post<PaymentInitResponse>(`/api/payments/initiate/${opts.orderId}`)
        .then((r) => r.data);

      // 3. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzpOptions: RazorpayCheckoutOptions = {
          key: init.keyId,
          amount: init.amount,
          currency: init.currency,
          name: theme.business.name,
          description: opts.description ?? "Order payment",
          order_id: init.razorpayOrderId,
          prefill: {
            name: opts.name,
            email: opts.email,
            contact: opts.contact,
          },
          theme: { color: theme.colors.primary },
          handler: async (response) => {
            try {
              // 4. Verify payment with our backend
              const verifyPayload: PaymentVerifyRequest = {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              };
              await api.post("/api/payments/verify", verifyPayload);
              opts.onSuccess?.(verifyPayload);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment was cancelled")),
          },
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.open();
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      opts.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { pay, loading };
}
