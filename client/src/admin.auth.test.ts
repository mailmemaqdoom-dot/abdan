import http from "node:http";
import express from "express";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import apiRouter from "../../server/api";

let server: http.Server;
let baseUrl = "";

beforeAll(async () => {
  const app = express();
  app.use("/api", apiRouter);

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Could not determine admin test server address.");
      }
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
}, 20000);

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

describe("admin authentication", () => {
  it("rejects unauthenticated access to protected admin endpoints", async () => {
    const protectedPaths = [
      "/api/admin/dashboard",
      "/api/admin/products",
      "/api/admin/orders",
      "/api/admin/payments",
      "/api/admin/customers",
      "/api/admin/content",
      "/api/admin/banners",
    ];

    for (const path of protectedPaths) {
      const response = await fetch(`${baseUrl}${path}`);
      expect(response.status).toBe(401);
    }
  }, 20000);

  it("accepts the configured admin passcode through the API and returns a signed session cookie", async () => {
    const passcode = process.env.ADMIN_PANEL_PASSCODE;
    expect(passcode).toBeTruthy();

    const bootstrapResponse = await fetch(`${baseUrl}/api/admin/bootstrap`);
    expect(bootstrapResponse.ok).toBe(true);
    const bootstrapPayload = (await bootstrapResponse.json()) as { passcodeConfigured: boolean };
    expect(bootstrapPayload.passcodeConfigured).toBe(true);

    const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    expect(loginResponse.ok).toBe(true);
    expect(loginResponse.headers.get("set-cookie")).toContain("abdan_admin_session=");

    const loginPayload = (await loginResponse.json()) as {
      session: { role: string; name: string };
    };

    expect(loginPayload.session.role).toBe("owner");
    expect(loginPayload.session.name).toBeTruthy();
  }, 20000);
});
