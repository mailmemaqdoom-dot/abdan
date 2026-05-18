import { BRAND } from "@/data/abdan";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export type CheckoutCustomerInput = {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
};

export type CheckoutItemInput = {
  productId: string;
  name: string;
  priceLabel: string;
  size: string;
  color: string;
  quantity: number;
  image: string;
};

export type CheckoutSession = {
  ok: true;
  orderId: number;
  orderNumber: string;
  paymentId: number;
  paymentStatus: string;
  total: number;
  formattedTotal: string;
  customer: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
  };
};

let razorpayScriptPromise: Promise<boolean> | null = null;

async function request<T>(url: string, init: RequestInit) {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  const payload = (await response.json().catch(() => null)) as { message?: string } | T | null;
  if (!response.ok) {
    throw new Error((payload as { message?: string } | null)?.message || "ABDAN checkout could not be completed.");
  }

  return payload as T;
}

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

export async function createStorefrontCheckout(input: {
  source: "product" | "bag";
  customer: CheckoutCustomerInput;
  payment: {
    provider: "razorpay" | "upi" | "manual";
    method: "razorpay" | "upi";
    reference?: string | null;
  };
  items: CheckoutItemInput[];
  totals: {
    subtotal: number;
    total: number;
    currency: string;
  };
}) {
  return await request<CheckoutSession>("/api/storefront/checkout", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function confirmStorefrontPayment(input: {
  orderId: number;
  provider: "razorpay" | "upi" | "manual";
  method: "razorpay" | "upi";
  providerPaymentId: string;
  reference?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
}) {
  return await request<{ ok: true; orderId: number; orderNumber: string | null; paymentId: string }>(
    "/api/storefront/payments/confirm",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function openRazorpayCheckout(total: number) {
  const ready = await ensureRazorpayLoaded();
  if (!ready || !window.Razorpay) {
    return {
      ok: false,
      message: "Secure payment is not ready right now. Please use the UPI option below.",
    } as const;
  }

  return new Promise<{ ok: true; paymentId: string } | { ok: false; message: string }>((resolve) => {
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
          resolve({ ok: true, paymentId: response.razorpay_payment_id });
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
