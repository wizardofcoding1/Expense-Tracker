import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
      createUser,
      getUserByEmail
} from "../models/user.model.js"

import config from "../config/config.js";

// 
export async function registerUser(data){
      const existingUser = await getUserByEmail(
            data.email
      );

      if (existingUser) {
            throw new Error("Email already exists");
      }

      const passwordHash = await bcrypt.hash(
            data.password,
            10
      )

      const user = await createUser({
            ...data,
            passwordHash,
      });

      const {password_hash, ...safeUser} = user;

      return safeUser;
}

import pool from "../config/db.js";

// Custom parser to identify device, OS, and browser from user-agent string
export function parseUserAgent(ua) {
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let device = "Desktop";

  if (/mobile/i.test(ua)) device = "Mobile";
  if (/tablet/i.test(ua)) device = "Tablet";

  if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edge/i.test(ua)) browser = "Edge";

  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";

  return { browser, os, device };
}

// Access Token
export function createAccessToken(userId, tokenId = null){
      return jwt.sign(
            {id: userId, tokenId},
            config.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
      )
}

// Refresh Token
export async function createRefreshToken(userId, tokenId, reqInfo = {}){
      const { userAgent = "", ipAddress = "" } = reqInfo;
      const { browser, os, device } = parseUserAgent(userAgent);
      
      // Store session in Postgres
      await pool.query(
            `INSERT INTO user_sessions (user_id, token_id, device_name, browser, os, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, tokenId, device, browser, os, ipAddress]
      );

      return jwt.sign(
            {id: userId, tokenId},
            config.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
      )
}

// Refresh Token Cookie 
export function getRefreshCookieOption(res, refreshToken){
      return res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
      })
}

// Verify Refresh Token
export function verifyRefreshToken(token){
      try {
            return jwt.verify(token, config.JWT_REFRESH_SECRET);
      } catch (error) {
            return null;
      }
}

// Check session in PostgreSQL
export async function isSessionValid(tokenId) {
      try {
            const res = await pool.query("SELECT id FROM user_sessions WHERE token_id = $1", [tokenId]);
            return res.rows.length > 0;
      } catch (error) {
            console.error("Check session error:", error);
            return false;
      }
}