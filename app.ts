import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import cookieparser from "cookie-parser";
import { connectDB } from "./src/config/connectDb";
import { PORT } from "./src/config/config";
import { UserService } from "./src/services/user";
import { UserApi } from "./src/api/routes/user";
import { CommentService } from "./src/services/comment";
import { BlogService } from "./src/services/blogs";
import { CommentApi } from "./src/api/routes/comments";
import { BlogApi } from "./src/api/routes/blogs";

const ExpressApp = (app: Application, server: http.Server) => {
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "rafi-blog-management.vercel.app",
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
    console.log(`${req.method} ${req.url}`);
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

  const userService = new UserService();
  const blogService = new BlogService();
  const commentService = new CommentService();

  UserApi(app, userService);
  BlogApi(app, blogService);
  CommentApi(app, commentService);
};

start();
