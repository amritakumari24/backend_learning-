const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NGSkillForge API",
      version: "1.0.0",
      description: "Comprehensive REST API for NGSkillForge online learning platform with OTP verification, JWT authentication, course management, enrollments, and file uploads.",
      contact: {
        name: "NGSkillForge Support",
        email: "support@ngskillforge.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
      {
        url: "https://api.ngskillforge.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description: "JWT access token stored in HTTP-only cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            isVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Course: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            instructor: { $ref: "#/components/schemas/User" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Enrollment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            course: { $ref: "#/components/schemas/Course" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Assignment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            course: { $ref: "#/components/schemas/Course" },
            fileUrl: { type: "string" },
            publicId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            statusCode: { type: "number" },
          },
        },
      },
    },
    paths: {
      "/": {
        get: {
          summary: "Health Check",
          tags: ["Health"],
          responses: {
            200: {
              description: "Server is running",
              content: {
                "text/plain": {
                  schema: { type: "string", example: "Backend Server Running" },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "API Health Status",
          tags: ["Health"],
          responses: {
            200: {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      timestamp: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/send-otp": {
        post: {
          summary: "Send OTP to Email",
          tags: ["Authentication"],
          description: "Generate and send a 6-digit OTP to the user's email for registration",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", format: "email" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "OTP sent successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            400: { description: "Invalid email format" },
            500: { description: "Error sending email" },
          },
        },
      },
      "/api/auth/verify-otp": {
        post: {
          summary: "Verify OTP and Register User",
          tags: ["Authentication"],
          description: "Verify OTP code and create a new user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "name", "password", "otp"],
                  properties: {
                    email: { type: "string", format: "email" },
                    name: { type: "string", minLength: 2 },
                    password: { type: "string", minLength: 6 },
                    otp: { type: "string", pattern: "^[0-9]{6}$" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            400: { description: "Invalid OTP or user already exists" },
            404: { description: "OTP not found or expired" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "User Login",
          tags: ["Authentication"],
          description: "Login with email and password. Returns JWT tokens as HTTP-only cookies",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful. Access token and refresh token set as HTTP-only cookies",
              headers: {
                "Set-Cookie": {
                  schema: {
                    type: "string",
                    example: "accessToken=...; HttpOnly; Secure; SameSite=Strict",
                  },
                },
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            400: { description: "Invalid credentials" },
            404: { description: "User not found" },
          },
        },
      },
      "/api/auth/refresh-token": {
        post: {
          summary: "Refresh Access Token",
          tags: ["Authentication"],
          description: "Get a new access token using refresh token",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "New access token issued",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Refresh token invalid or expired" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          summary: "User Logout",
          tags: ["Authentication"],
          description: "Logout user and clear JWT cookies",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/api/users/me": {
        get: {
          summary: "Get Current User Profile",
          tags: ["Users"],
          description: "Get authenticated user's profile information",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Current user profile",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/api/users/{userId}": {
        get: {
          summary: "Get User Profile by ID",
          tags: ["Users"],
          description: "Get any user's public profile (no authentication required)",
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "User profile",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            404: { description: "User not found" },
          },
        },
      },
      "/api/v1/courses": {
        post: {
          summary: "Create Course",
          tags: ["Courses"],
          description: "Create a new course (admin only)",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Course created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Course" },
                },
              },
            },
            400: { description: "Invalid input" },
            401: { description: "Not authenticated" },
            403: { description: "Not authorized (admin only)" },
          },
        },
        get: {
          summary: "List Courses",
          tags: ["Courses"],
          description: "Get paginated list of courses with optional search and sorting",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 10 },
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Search by course title",
            },
            {
              name: "sort",
              in: "query",
              schema: { type: "string", enum: ["latest", "oldest"] },
            },
          ],
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "List of courses",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      courses: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Course" },
                      },
                      totalCourses: { type: "number" },
                      totalPages: { type: "number" },
                      currentPage: { type: "number" },
                    },
                  },
                },
              },
            },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/api/v1/courses/{id}": {
        get: {
          summary: "Get Course by ID",
          tags: ["Courses"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Course details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Course" },
                },
              },
            },
            404: { description: "Course not found" },
            401: { description: "Not authenticated" },
          },
        },
        patch: {
          summary: "Update Course",
          tags: ["Courses"],
          description: "Update course details (admin only)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          security: [{ cookieAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Course updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Course" },
                },
              },
            },
            404: { description: "Course not found" },
            403: { description: "Not authorized" },
          },
        },
        delete: {
          summary: "Delete Course",
          tags: ["Courses"],
          description: "Delete a course (admin only)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: "Course deleted successfully" },
            404: { description: "Course not found" },
            403: { description: "Not authorized" },
          },
        },
      },
      "/api/v1/enrollments": {
        post: {
          summary: "Enroll in Course",
          tags: ["Enrollments"],
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["courseId"],
                  properties: {
                    courseId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Successfully enrolled in course",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Enrollment" },
                },
              },
            },
            400: { description: "Already enrolled or invalid course" },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/api/v1/enrollments/my": {
        get: {
          summary: "Get My Enrollments",
          tags: ["Enrollments"],
          description: "Get list of courses user is enrolled in",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 10 },
            },
          ],
          responses: {
            200: {
              description: "List of enrollments",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      enrollments: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Enrollment" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/api/v1/assignments/upload": {
        post: {
          summary: "Upload Assignment",
          tags: ["Assignments"],
          description: "Upload assignment file to course (PDF, PNG, JPEG max 5MB)",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file", "courseId"],
                  properties: {
                    file: { type: "string", format: "binary" },
                    courseId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Assignment uploaded successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Assignment" },
                },
              },
            },
            400: { description: "Invalid file or missing courseId" },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/api/v1/assignments/my": {
        get: {
          summary: "Get My Assignments",
          tags: ["Assignments"],
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 10 },
            },
          ],
          responses: {
            200: {
              description: "List of assignments",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      assignments: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Assignment" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/profile": {
        get: {
          summary: "Get Profile (Protected Route Test)",
          tags: ["Testing"],
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Authenticated user profile",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Not authenticated" },
          },
        },
      },
      "/admin": {
        get: {
          summary: "Get Admin Only Resource",
          tags: ["Testing"],
          description: "Test endpoint for admin-only access",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Admin resource",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Not authenticated" },
            403: { description: "Admin access required" },
          },
        },
      },
    },
  },
  apis: [],
};

export default swaggerOptions;
