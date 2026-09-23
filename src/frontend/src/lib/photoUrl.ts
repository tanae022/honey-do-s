import { loadConfig } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";

/**
 * Resolves a stored object-storage photo hash into a full gateway URL that an
 * `<img>` can load on any device.
 *
 * `StorageClient.putFile` returns a bare content hash (e.g. `sha256:<64hex>`),
 * not a URL, so the hash must be turned into a gateway URL through
 * `StorageClient.getDirectURL`. The runtime config is loaded once and cached
 * for the lifetime of the page.
 */

let clientPromise: Promise<StorageClient> | null = null;

async function getStorageClient(): Promise<StorageClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => undefined);
      }
      return new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
    })().catch((error) => {
      // Allow a later attempt to retry if config loading failed transiently.
      clientPromise = null;
      throw error;
    });
  }
  return clientPromise;
}

/**
 * Turns a stored photo hash into a direct gateway URL.
 *
 * Throws when the hash is empty or malformed, or when the runtime config
 * cannot be loaded — callers should surface a genuine failure state rather
 * than silently rendering a broken image.
 */
export async function resolvePhotoUrl(hash: string): Promise<string> {
  const trimmed = hash.trim();
  if (trimmed.length === 0) {
    throw new Error("Photo hash is empty");
  }
  const client = await getStorageClient();
  return client.getDirectURL(trimmed);
}
