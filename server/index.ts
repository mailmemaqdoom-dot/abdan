import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiRouter from "./api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createStorageProxy() {
  return async (req: express.Request, res: express.Response) => {
    const key = req.path.replace(/^\//, "");

    if (!key) {
      res.status(400).type("text/plain").send("Missing storage key");
      return;
    }

    const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
    const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

    if (!forgeBaseUrl || !forgeKey) {
      res.status(500).type("text/plain").send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL("v1/storage/presign/get", `${forgeBaseUrl}/`);
      forgeUrl.searchParams.set("path", key);

      const response = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${forgeKey}` },
      });

      if (!response.ok) {
        res.status(502).type("text/plain").send("Storage backend error");
        return;
      }

      const payload = (await response.json()) as { url?: string };
      if (!payload.url) {
        res.status(502).type("text/plain").send("Empty storage URL");
        return;
      }

      res.redirect(307, payload.url);
    } catch (error) {
      console.error(error);
      res.status(502).type("text/plain").send("Storage proxy error");
    }
  };
}

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  app.disable("x-powered-by");
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  app.use("/api", apiRouter);
  app.use("/manus-storage", createStorageProxy());

  if (isProduction) {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    app.get("/", (_req, res) => {
      res.json({ ok: true, service: "abdan-api", note: "Frontend dev server runs separately." });
    });
  }

  const port = Number(process.env.PORT || (isProduction ? 3000 : 3001));
  app.listen(port, () => {
    console.log(`ABDAN backend listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
