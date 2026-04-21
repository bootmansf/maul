export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Intentionally falls back to an empty string so the app can build before
// Sanity is configured. Callers must check `isSanityConfigured()` before
// making real requests.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export function isSanityConfigured() {
  return projectId.length > 0;
}
