require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const { sequelize } = require("./src/sequelize/models");
require("dotenv").config();
const cors = require('cors')
const colors = require("colors");
const cookieParser = require("cookie-parser");
const ridersAuthRoute = require("./src/routes/ridersAuth.routes");
const vendorsAuthRoute = require("./src/routes/vendorsAuth.routes");
const marketplaceRoute = require("./src/routes/marketplace.routes")
const helmet = require("helmet");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://havestav1.netlify.app",
      "https://harvesta-home-web-v1.onrender.com",
      "https://client-portal-v1.onrender.com"
      // "https://nginx-configuration-4f3p.onrender.com", 
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],

  })
);

app.use(cookieParser());



app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const port = process.env.PORT || 4040;
const startServer = async () => {
  try {
    // Try to authenticate the Sequelize connection
    await sequelize.authenticate();
    // await initializeRedisClient();
    console.log("Database connection established successfully.");

    // Start the server if connection is successful
    const server = http.createServer(app);
    app.listen(port, () => {
      console.log(colors.random("Application listening on port 4040"));
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

app.use("/auth_service/api/riders", ridersAuthRoute);
app.use("/auth_service/api/vendors", vendorsAuthRoute);
app.use("/marketplace_service/api/vendors", marketplaceRoute);





startServer();
