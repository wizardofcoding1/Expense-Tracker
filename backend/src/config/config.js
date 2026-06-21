import dotenv from "dotenv";

dotenv.config()

if (!process.env.PORT) {
      throw new Error("Environment Does Not Declare The PORT Number");
}

if (!process.env.DATABASE_URL) {
      throw new Error("Environment Does Not Declare The DATABASE_URL");
}

if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("Access Token is Not Declared");
}

if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("Refresh Token is Not Declared");
}

if (!process.env.FRONTEND_URL) {
      throw new Error("The Frontend URL is Not Declared");
}

const config = {
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      FRONTEND_URL: process.env.FRONTEND_URL
}


export default config