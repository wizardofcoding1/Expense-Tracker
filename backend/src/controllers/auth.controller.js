import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";

import { getUserByEmail, getUserById, updateUserPassword, updateUser } from "../models/user.model.js";
import {
      registerUser,
      createAccessToken,
      createRefreshToken,
      getRefreshCookieOption,
      verifyRefreshToken,
      isSessionValid
} from "../service/auth.service.js";

export async function register(req, res){
      try{
            const {
                  firstName, 
                  lastName,
                  dateOfBirth,
                  gender, 
                  email,
                  password
            } = req.body || {};

            const user = await registerUser({
                  firstName, 
                  lastName,
                  dateOfBirth,
                  gender, 
                  email,
                  password
            });

            const tokenId = crypto.randomUUID();
            const userAgent = req.headers['user-agent'] || '';
            const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

            const accessToken = createAccessToken(user.id, tokenId);
            const refreshToken = await createRefreshToken(user.id, tokenId, { userAgent, ipAddress });

            getRefreshCookieOption(res, refreshToken);

            res.status(201).json({
                  success: true,
                  user,
                  accessToken
            });
      }catch(error){
            console.error("Registration Error Details:", error);
            res.status(404).json({
                  success: false,
                  message: error.message,
            })
      }   
}


export async function login(req, res){
      try{
            const {
                  email, 
                  password
            } = req.body || {};

            if(!email || !password){
                  return res.status(400).json({
                        message:"Email and Password are Required"
                  });
            }

            const user = await getUserByEmail(email);
            if(!user){
                  return res.status(401).json({
                        success: false,
                        message: "User not Found"
                  });
            }
            
            const isPasswordValid = await bcrypt.compare(
                  password,
                  user.password_hash
            );

            if(!isPasswordValid){
                  return res.status(401).json({
                        success: false,
                        message: "Invalid Password"
                  });
            }
            
            const tokenId = crypto.randomUUID();
            const userAgent = req.headers['user-agent'] || '';
            const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

            const accessToken = createAccessToken(user.id, tokenId);
            const refreshToken = await createRefreshToken(user.id, tokenId, { userAgent, ipAddress });

            getRefreshCookieOption(res, refreshToken)
      

            const {password_hash, ...safeUser} = user;

            return res.status(200).json({
                  success: true,
                  user: safeUser,
                  accessToken,
                  
            });
      }
      catch(error){
            console.error("Login Error Details:", error);
            res.status( 404).json({
                  success: false,
                  message: error.message,
            })
      }
}

// Refresh Token Controller 
export async function refresh(req, res){
      try{
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                  return res.status(401).json({
                        success: false,
                        message: "Refresh Token is Required"
                  });
            }

            const decoded = verifyRefreshToken(refreshToken);
            if(!decoded){
                  return res.status(403).json({
                        success: false,
                        message: "Invalid or Expired Refresh Token"
                  });
            }

            const sessionValid = await isSessionValid(decoded.tokenId);
            if (!sessionValid) {
                  return res.status(403).json({
                        success: false,
                        message: "Session has been revoked"
                  });
            }

            // Update session activity
            await pool.query("UPDATE user_sessions SET last_active = CURRENT_TIMESTAMP WHERE token_id = $1", [decoded.tokenId]);

            const accessToken = createAccessToken(decoded.id, decoded.tokenId);

            return res.status(200).json({
                  success: true,
                  accessToken
            });
      }
      catch(error){
            console.error("Refresh Token Error Details:", error);
            res.status(500).json({
                  success: false,
                  message: error.message,
            })
      }
}

//  log out 
export async function logout(req, res){
      try{
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                  const decoded = verifyRefreshToken(refreshToken);
                  if (decoded && decoded.tokenId) {
                        await pool.query("DELETE FROM user_sessions WHERE token_id = $1", [decoded.tokenId]);
                  }
            }

            res.clearCookie("refreshToken")

            return res.status(200).json({
                  success: true,
                  message: "Logout Successfull",
            });
      }catch(error){
            res.status(404).json({
                  success: false,
                  message: error.message,
            })
      }
}

export async function changePassword(req, res) {
      try {
            const { currentPassword, newPassword } = req.body || {};
            if (!currentPassword || !newPassword) {
                  return res.status(400).json({
                        success: false,
                        message: "Current password and new password are required"
                  });
            }

            if (newPassword.length < 6) {
                  return res.status(400).json({
                        success: false,
                        message: "New password must be at least 6 characters long"
                  });
            }

            const user = await getUserById(req.userId);
            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "User not found"
                  });
            }

            const isPasswordValid = await bcrypt.compare(
                  currentPassword,
                  user.password_hash
            );

            if (!isPasswordValid) {
                  return res.status(400).json({
                        success: false,
                        message: "Invalid current password"
                  });
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            await updateUserPassword(req.userId, newPasswordHash);

            return res.status(200).json({
                  success: true,
                  message: "Password changed successfully"
            });
      } catch (error) {
            console.error("Change Password Error:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function getSessions(req, res) {
      try {
            const result = await pool.query(
                  `SELECT id, device_name, browser, os, ip_address, last_active, created_at, 
                          (token_id = $1) AS is_current
                   FROM user_sessions 
                   WHERE user_id = $2
                   ORDER BY last_active DESC`,
                  [req.tokenId, req.userId]
            );
            return res.status(200).json({
                  success: true,
                  data: result.rows
            });
      } catch (error) {
            console.error("Get Sessions Error:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function revokeSession(req, res) {
      try {
            const { id } = req.params;
            const checkRes = await pool.query("SELECT user_id FROM user_sessions WHERE id = $1", [id]);
            if (checkRes.rows.length === 0) {
                  return res.status(404).json({
                        success: false,
                        message: "Session not found"
                  });
            }

            if (checkRes.rows[0].user_id !== req.userId) {
                  return res.status(403).json({
                        success: false,
                        message: "Unauthorized to revoke this session"
                  });
            }

            await pool.query("DELETE FROM user_sessions WHERE id = $1", [id]);

            return res.status(200).json({
                  success: true,
                  message: "Session revoked successfully"
            });
      } catch (error) {
            console.error("Revoke Session Error:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}

export async function updateProfile(req, res) {
      try {
            const { firstName, lastName, dateOfBirth, gender } = req.body || {};

            if (!firstName || !firstName.trim()) {
                  return res.status(400).json({
                        success: false,
                        message: "First name is required"
                  });
            }
            if (!lastName || !lastName.trim()) {
                  return res.status(400).json({
                        success: false,
                        message: "Last name is required"
                  });
            }

            // Validate date of birth is not in the future (with a 30-hour timezone buffer)
            if (dateOfBirth) {
                  const dobDate = new Date(dateOfBirth);
                  const today = new Date();
                  today.setHours(today.getHours() + 30);
                  if (dobDate > today) {
                        return res.status(400).json({
                              success: false,
                              message: "Date of birth cannot be in the future"
                        });
                  }
            }

            const updatedUser = await updateUser(req.userId, {
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  dateOfBirth: dateOfBirth || null,
                  gender: gender || null
            });

            if (!updatedUser) {
                  return res.status(404).json({
                        success: false,
                        message: "User not found"
                  });
            }

            const { password_hash, ...safeUser } = updatedUser;

            return res.status(200).json({
                  success: true,
                  message: "Profile updated successfully",
                  user: safeUser
            });
      } catch (error) {
            console.error("Update Profile Error:", error);
            return res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
}
