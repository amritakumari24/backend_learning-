import { isAuthenticated } from "../src/middleware/auth.middleware.js";
import { authorizeRoles } from "../src/middleware/role.middleware.js";

describe("Auth Middleware", () => {
  describe("isAuthenticated", () => {
    it("should verify valid access token", async () => {
      // Test: Extract token from cookie
      // Test: Verify with JWT_ACCESS_SECRET
      // Test: Attach user object to req with id and role
    });

    it("should reject missing token", async () => {
      // Test: Return 401 if no accessToken cookie
    });

    it("should reject invalid token", async () => {
      // Test: Return 401 if JWT verification fails
    });

    it("should reject expired token", async () => {
      // Test: Return 401 if token exp claim expired
    });
  });
});

describe("Role Middleware", () => {
  describe("authorizeRoles", () => {
    it("should allow user with matching role", async () => {
      // Test: Pass if req.user.role in allowed roles
    });

    it("should reject user with different role", async () => {
      // Test: Return 403 if req.user.role not in allowed roles
    });

    it("should support multiple allowed roles", async () => {
      // Test: authorizeRoles("admin", "user") accepts both
    });
  });
});
