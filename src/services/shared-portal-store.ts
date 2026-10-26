import { appsScriptCall } from "@/lib/apps-script-api";

type SharedStoreResponse = {
  exists: boolean;
  revision: number;
  payload: string | null;
  updatedAt: number;
};

export async function getSharedPortalStoreFn(): Promise<SharedStoreResponse> {
  return appsScriptCall<SharedStoreResponse>("store.get");
}

export async function saveSharedPortalStoreFn({ data }: { data: { payload: string; expectedRevision?: number } }) {
  return appsScriptCall<{ ok: true; revision: number; updatedAt: number }>("store.save", data);
}
