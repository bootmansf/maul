import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

let _client: SanityClient | null = null;

export function getClient(): SanityClient {
  if (!isSanityConfigured()) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local."
    );
  }
  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
  }
  return _client;
}
