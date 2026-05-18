export type AdminSession = {
  adminId: number | null;
  name: string;
  role: "owner" | "admin" | "editor" | "support";
  email?: string | null;
};

export type AdminProduct = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  stylingTips: string | null;
  primaryTag: string | null;
  categoryId: number | null;
  categoryName: string | null;
  price: number;
  salePrice: number | null;
  priceLabel: string;
  stockQuantity: number;
  coverImageUrl: string | null;
  coverImageKey: string | null;
  status: "draft" | "active" | "archived";
  featured: boolean;
  tags: string[];
  sizes: string[];
  colors: string[];
  metadata: Record<string, unknown>;
  images: Array<{ id: number; url: string; storageKey: string | null; altText: string | null; sortOrder: number }>;
  createdAt: string;
  updatedAt: string;
};

export type DashboardPayload = {
  counts: {
    products: number;
    orders: number;
    customers: number;
    paidPayments: number;
  };
  revenue: {
    total: number;
    last30Days: number;
  };
  recentOrders: Array<Record<string, unknown>>;
  recentPayments: Array<Record<string, unknown>>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = (payload && typeof payload === "object" && "message" in payload && payload.message) ||
      "ABDAN admin request failed.";
    throw new Error(String(message));
  }

  return payload as T;
}

export const adminApi = {
  bootstrap: () => request<{ passcodeConfigured: boolean }>("/api/admin/bootstrap"),
  getSession: () => request<{ session: AdminSession | null }>("/api/admin/session"),
  login: (passcode: string) =>
    request<{ session: AdminSession }>("/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ passcode }),
    }),
  logout: () => request<{ ok: true }>("/api/admin/auth/logout", { method: "POST" }),
  getDashboard: () => request<DashboardPayload>("/api/admin/dashboard"),
  getProducts: () => request<AdminProduct[]>("/api/admin/products"),
  getCategories: () => request<Array<Record<string, unknown>>>("/api/admin/categories"),
  saveProduct: (product: Record<string, unknown> & { id?: number }) =>
    request<{ ok: true; productId?: number }>(
      product.id ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product.id ? "PUT" : "POST",
        body: JSON.stringify(product),
      },
    ),
  archiveProduct: (id: number) => request<{ ok: true }>(`/api/admin/products/${id}`, { method: "DELETE" }),
  getOrders: () => request<Array<Record<string, unknown>>>("/api/admin/orders"),
  updateOrder: (id: number, payload: Record<string, unknown>) =>
    request<{ ok: true }>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  getCustomers: () => request<Array<Record<string, unknown>>>("/api/admin/customers"),
  getPayments: () => request<Array<Record<string, unknown>>>("/api/admin/payments"),
  updatePayment: (id: number, payload: Record<string, unknown>) =>
    request<{ ok: true }>(`/api/admin/payments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  getContent: () => request<Array<Record<string, unknown>>>("/api/admin/content"),
  updateContent: (contentKey: string, payload: Record<string, unknown>) =>
    request<{ ok: true }>(`/api/admin/content/${contentKey}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  getBanners: () => request<Array<Record<string, unknown>>>("/api/admin/banners"),
  saveBanner: (banner: Record<string, unknown> & { id?: number }) =>
    request<{ ok: true; bannerId?: number }>(banner.id ? `/api/admin/banners/${banner.id}` : "/api/admin/banners", {
      method: banner.id ? "PUT" : "POST",
      body: JSON.stringify(banner),
    }),
  uploadFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.message || "Upload failed.");
    }

    return payload as { uploads: Array<{ key: string; url: string; name: string }> };
  },
};
