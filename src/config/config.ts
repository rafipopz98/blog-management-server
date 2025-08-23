import dotenv from "dotenv";
dotenv.config();

export const PORT = <string>process.env.PORT;
export const DB_URL = <string>process.env.DB_URL;
export const JWT_TOKEN = <string>process.env.JWT_TOKEN;
export const JWT_SECRET = new TextEncoder().encode(JWT_TOKEN);
export const JWT_ALG = <string>process.env.ALG || "HS256";
export const EXPIRES_IN = <string>process.env.EXPIRES_IN || "60 * 60 * 24 * 7";
