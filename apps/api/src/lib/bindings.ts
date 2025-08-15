import { InstitutionDraftDO } from "@/api/durable-objects/InstitutionDraft";
import { AdminRegistryDO } from "@/api/durable-objects/AdminRegistry";

export interface Env {
  // Bindings for the environment variables
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  DATABASE_URL: string;
  // Clerk
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  // Resend
  RESEND_API_KEY: string;
  //   Cloudflare bindings
  DOMAIN_CACHE: KVNamespace;
  FOUNDLYDB: D1Database;
  INSTITUTION_DRAFT: DurableObjectNamespace<InstitutionDraftDO>;
  ADMIN_REGISTRY_DO: DurableObjectNamespace<AdminRegistryDO>;
}
