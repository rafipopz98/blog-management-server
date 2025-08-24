import dotenv from "dotenv";
dotenv.config();

export const PORT = <string>process.env.PORT || 8080;
export const DB_URL = <string>process.env.DB_URL || "mongodb+srv://rafi:rafi@blogs.ei1khrp.mongodb.net/";
export const JWT_TOKEN = <string>process.env.JWT_TOKEN || "330db28265f8f54dc74fe6665f4cbfa4b356e539f1af027d309652d9e18dc872";
export const JWT_SECRET = new TextEncoder().encode(JWT_TOKEN) || new TextEncoder().encode("330db28265f8f54dc74fe6665f4cbfa4b356e539f1af027d309652d9e18dc872");
export const JWT_ALG = <string>process.env.ALG || "HS256";
export const EXPIRES_IN = <string>process.env.EXPIRES_IN || "60 * 60 * 24 * 7";
