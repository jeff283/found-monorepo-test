import { describe, it, expect } from "vitest";
import {
  canUserUpdateInstitution,
  canAdminChangeStatus,
  getStatusDescription,
} from "@/api/lib/update-permissions";

describe("Permission System Tests", () => {
  it("should export permission functions", async () => {
    expect(typeof canUserUpdateInstitution).toBe("function");
    expect(typeof canAdminChangeStatus).toBe("function");
    expect(typeof getStatusDescription).toBe("function");
  });

  it("should allow updates for draft status", () => {
    const result = canUserUpdateInstitution("draft");
    expect(result.canUpdate).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("should allow updates for pending_verification status", () => {
    const result = canUserUpdateInstitution("pending_verification");
    expect(result.canUpdate).toBe(true);
  });

  it("should block updates for verifying status", () => {
    const result = canUserUpdateInstitution("verifying");
    expect(result.canUpdate).toBe(false);
    expect(result.reason).toContain("currently being reviewed");
  });

  it("should block updates for approved status", () => {
    const result = canUserUpdateInstitution("approved");
    expect(result.canUpdate).toBe(false);
    expect(result.reason).toContain("approved application");
  });

  it("should block updates for rejected status", () => {
    const result = canUserUpdateInstitution("rejected");
    expect(result.canUpdate).toBe(false);
    expect(result.reason).toContain("rejected application");
  });

  it("should provide status descriptions", () => {
    expect(getStatusDescription("draft")).toContain("being prepared");
    expect(getStatusDescription("pending_verification")).toContain(
      "awaiting review"
    );
    expect(getStatusDescription("verifying")).toContain(
      "currently being reviewed"
    );
    expect(getStatusDescription("approved")).toContain("been approved");
    expect(getStatusDescription("rejected")).toContain("been rejected");
  });
});
