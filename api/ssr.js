// Vercel serverless function — bridges Node.js req/res to the TanStack Start
// Web Fetch API handler that lives in dist/server/index.js after build.
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built server entry is one level up from api/ inside dist/server/
const serverEntryPath = path.resolve(__dirname, "../dist/server/server.js");

let handlerPromise;

function getHandler() {
  if (!handlerPromise) {
    handlerPromise = import(serverEntryPath).then((mod) => {
      const entry = mod.default ?? mod;
      if (typeof entry.fetch === "function") return entry;
      if (typeof entry === "function") return { fetch: entry };
      throw new Error("Server entry does not export a fetch handler");
    });
  }
  return handlerPromise;
}

/**
 * Convert a Node.js IncomingMessage to a Web API Request.
 */
async function nodeRequestToWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
  const url = `${protocol}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  const method = req.method ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";

  let body = undefined;
  if (hasBody) {
    body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }

  return new Request(url, { method, headers, body: hasBody ? body : undefined });
}

/**
 * Write a Web API Response back to the Node.js ServerResponse.
 */
async function webResponseToNodeResponse(webRes, res) {
  res.statusCode = webRes.status;
  for (const [key, value] of webRes.headers.entries()) {
    res.setHeader(key, value);
  }
  if (webRes.body) {
    const reader = webRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}

export default async function handler(req, res) {
  try {
    const { fetch } = await getHandler();
    const webRequest = await nodeRequestToWebRequest(req);
    const webResponse = await fetch(webRequest);
    await webResponseToNodeResponse(webResponse, res);
  } catch (err) {
    console.error("[ssr] Unhandled error:", err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal Server Error");
  }
}
