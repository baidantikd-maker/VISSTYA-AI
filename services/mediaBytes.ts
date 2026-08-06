import { Buffer } from "buffer";

const RETRY_ATTEMPTS = 3;

const sleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));


const isRetryableStatus = (status: number) =>
  status === 408 || status === 429 || (status >= 500 && status < 600);

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempts: number = RETRY_ATTEMPTS
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, init);
      if (!isRetryableStatus(response.status) || attempt >= attempts) {
        return response;
      }
      try {
        await response.body?.cancel();
      } catch {
        // Body already settled; nothing to clean up.
      }
      const delay = Math.min(1000 * 2 ** attempt, 8000) + Math.random() * 250;
      console.warn(
        `Media fetch retry ${attempt + 1}/${attempts} after status ${response.status}`
      );
      await sleep(delay);
    } catch (error) {
      if (attempt >= attempts) throw error;
      const delay = Math.min(1000 * 2 ** attempt, 8000);
      console.warn(
        `Media fetch retry ${attempt + 1}/${attempts} after network error`
      );
      await sleep(delay);
    }
  }
}

export interface MediaBytes {
  bytes: Buffer;
  mimeType: string;
}

/** Download media from a URL (shared by metadata extraction and vision). */
export async function fetchMediaBytes(mediaUrl: string): Promise<MediaBytes> {
  const response = await fetchWithRetry(mediaUrl, {
    headers: { "User-Agent": "Visstya-AI-Verification/1.0" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download media (${response.status} ${response.statusText})`
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const mimeType =
    response.headers.get("content-type")?.split(";")[0]?.trim() ||
    "application/octet-stream";

  return { bytes, mimeType };
}
