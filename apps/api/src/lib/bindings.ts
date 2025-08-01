import { InstitutionDraftDO } from "@/durable-objects/InstitutionDraft";
import { AdminRegistryDO } from "@/durable-objects/AdminRegistry";

export interface Env {
  // Bindings for the environment variables
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  DATABASE_URL: string;
  //   Cloudflare bindings
  DOMAIN_CACHE: KVNamespace;
  FOUNDLYDB: D1Database;
  INSTITUTION_DRAFT: DurableObjectNamespace<InstitutionDraftDO>;
  ADMIN_REGISTRY_DO: DurableObjectNamespace<AdminRegistryDO>;
}
