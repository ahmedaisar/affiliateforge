/**
 * The only network boundary in the browser. In development, /api is proxied by
 * Vite to the control-plane backend on 127.0.0.1:8787 (see vite.config.mts).
 * Every screen reads through this file; no fixture may be imported by a page.
 */
import type { Store, ActivityLine, StoreState } from "./data";
import type { CatalogueRow, BuildStep } from "./screenData";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, init);
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchStores(): Promise<Store[]> {
  return request<Store[]>("/stores");
}

export async function fetchStore(id: string): Promise<Store> {
  return request<Store>(`/stores/${encodeURIComponent(id)}`);
}

export async function fetchActivity(): Promise<ActivityLine[]> {
  const rows = await request<{ time: string; what: string; state: StoreState; stateLabel: string }[]>("/activity");
  return rows;
}

export async function fetchCatalogue(storeId: string): Promise<CatalogueRow[]> {
  return request<CatalogueRow[]>(`/stores/${encodeURIComponent(storeId)}/catalogue`);
}

export async function removeProduct(storeId: string, productId: string): Promise<void> {
  await request(`/stores/${encodeURIComponent(storeId)}/catalogue/${encodeURIComponent(productId)}`, { method: "DELETE" });
}

export async function approveCatalogue(storeId: string): Promise<void> {
  await request(`/stores/${encodeURIComponent(storeId)}/catalogue?action=approve`, { method: "POST" });
}

export async function fetchBuild(storeId: string): Promise<BuildStep[]> {
  return request<BuildStep[]>(`/stores/${encodeURIComponent(storeId)}/build`);
}

export async function startBuild(storeId: string): Promise<void> {
  await request(`/stores/${encodeURIComponent(storeId)}/build`, { method: "POST" });
}
