import dotenv from "dotenv";
dotenv.config();

export const microsoftConfig = {
  clientID: process.env.MICROSOFT_CLIENT_ID || "cambiame-en-produccion",
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "cambiame-en-produccion",
  callbackURL: process.env.MICROSOFT_CALLBACK_URL || "http://localhost:5000/api/v1/auth/microsoft/callback",
  tenant: process.env.MICROSOFT_TENANT || "common", 
};