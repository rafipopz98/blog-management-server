import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import cookieparser from "cookie-parser";
import { connectDB } from "./src/config/connectDb";
import { PORT } from "./src/config/config";

const ExpressApp = (app: Application, server: http.Server) => {
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://ee-staging.maximumaccountability.net",
      ],
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true,
    })
  );

  connectDB();

  app.use(express.json());
  // app.use(errorHandler);
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieparser());
  app.use(express.static("public"));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Credentials");
    next();
  });

  server.listen(PORT, () => {
    console.log(`listening at port: ${PORT}`);
  });
};

const start = () => {
  const app = express();
  const server = http.createServer(app);
  ExpressApp(app, server);
};

start();
