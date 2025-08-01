CREATE TYPE "public"."join_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TABLE "join_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"clerk_user_id" text NOT NULL,
	"user_email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"status" "join_request_status" DEFAULT 'pending',
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" text
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"clerk_user_id" text,
	"role" "member_role" DEFAULT 'member',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"description" text,
	"logo_url" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"job_title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_reviewed_by_user_profiles_clerk_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user_profiles"("clerk_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_clerk_user_id_user_profiles_clerk_user_id_fk" FOREIGN KEY ("clerk_user_id") REFERENCES "public"."user_profiles"("clerk_user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_created_by_user_profiles_clerk_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("clerk_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_join_requests_organization_id" ON "join_requests" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_join_requests_clerk_user_id" ON "join_requests" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "idx_join_requests_status" ON "join_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_organization_members_organization_id" ON "organization_members" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_organization_members_clerk_user_id" ON "organization_members" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_organization_member" ON "organization_members" USING btree ("organization_id","clerk_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_organizations_domain" ON "organizations" USING btree ("domain");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_profiles_clerk_user_id" ON "user_profiles" USING btree ("clerk_user_id");