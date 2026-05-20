import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./src/docs/swagger.js";
import healthRoutes from './src/routes/health.routes.js';
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import errorMiddleware from "./src/middleware/error.middleware.js";
import { isAuthenticated } from "./src/middleware/auth.middleware.js";
import { authorizeRoles } from "./src/middleware/role.middleware.js";
import courseRoutes from "./src/routes/course.routes.js";
import enrollmentRoutes from "./src/routes/enrollment.routes.js";
import assignmentRoutes from "./src/routes/assignment.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import limiter from "./src/middleware/rateLimit.middleware.js";


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/upload", uploadRoutes);
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Backend Server Running");
});


app.get('/profile', isAuthenticated, (req, res)=>{
    res.json({
        success: true,
        user: req.user,
    });
});

app.get(
  "/admin",
  isAuthenticated,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

app.use(errorMiddleware);

export default app;
