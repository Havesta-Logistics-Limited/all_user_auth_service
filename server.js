import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import models from "./src/sequelize/models/index.js";
const { sequelize } = models;

import db_config from "./src/sequelize/config/config.js";
import customerRoutes from "./src/routes/customer.routes.js";
import ridersAuthRoute from "./src/routes/ridersAuth.routes.js";
import vendorsAuthRoute from "./src/routes/vendorsAuth.routes.js";
import marketplaceRoute from "./src/routes/marketplace.routes.js";
import logoutRoute from "./src/routes/logout.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://havestav1.netlify.app",
      "https://harvesta-home-web-v1.onrender.com",
      "https://client-portal-v1.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

const port = process.env.PORT || 4040;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(colors.green(`Application listening on port ${port}`));
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
});

const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing server...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await sequelize.close();
      console.log("Sequelize connection pool closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error closing Sequelize:", err);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// ROUTES
app.use("/auth_service/api/riders", ridersAuthRoute);
app.use("/auth_service/api/vendors", vendorsAuthRoute);
app.use("/marketplace_service/api/vendors", marketplaceRoute);
app.use("/auth_service/api", logoutRoute);
app.use("/auth_service/api/customers", customerRoutes);
