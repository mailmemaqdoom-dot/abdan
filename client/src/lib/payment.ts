import { BRAND } from "@/data/abdan";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

export function ensureRazorpayLoaded() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-abdan-razorpay="true"]',
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.abdanRazorpay = "true";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export function buildWhatsAppUrl(message: string) {
  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export async function openRazorpayCheckout(total: number) {
  const ready = await ensureRazorpayLoaded();
  if (!ready || !window.Razorpay) {
    return {
      ok: false,
      message: "Secure payment is not ready right now. Please use the UPI option below.",
    } as const;
  }

  return new Promise<{ ok: true } | { ok: false; message: string }>((resolve) => {
    try {
      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        resolve({ ok: false, message: "Secure payment is not ready right now. Please use the UPI option below." });
        return;
      }

      const instance = new Razorpay({
        key: BRAND.razorpayKey,
        amount: Math.max(total, 1) * 100,
        currency: "INR",
        name: BRAND.name,
        description: "Secure Payment",
        theme: { color: "#023D3A" },
        handler: (response: { razorpay_payment_id: string }) => {
          const message = `Hello, I have completed payment via Razorpay.%0A%0APlease confirm my order.%0A%0APayment ID: ${response.razorpay_payment_id}`;
          window.open(`${BRAND.whatsappUrl}?text=${message}`, "_blank", "noopener,noreferrer");
          resolve({ ok: true });
        },
        modal: {
          ondismiss: () => {
            resolve({ ok: false, message: "Payment window closed before completion." });
          },
        },
      });

      instance.open();
    } catch {
      resolve({
        ok: false,
        message: "Payment gateway could not open. Please continue with UPI or WhatsApp support.",
      });
    }
  });
}
