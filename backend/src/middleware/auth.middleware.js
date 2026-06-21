import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { isSessionValid } from "../service/auth.service.js";

export async function authMiddleware(req, res, next){
      try{
            const authHeader = req.headers.authorization;
            if(!authHeader){
                  return res.status(401).json({
                        success: false,
                        message:"Access Token Required"
                  });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);

            req.userId = decoded.id;
            req.tokenId = decoded.tokenId;

            if (decoded.tokenId) {
                  const valid = await isSessionValid(decoded.tokenId);
                  if (!valid) {
                        return res.status(401).json({
                              success: false,
                              message: "Session has been revoked or is invalid"
                        });
                  }
            }

            next();
      }catch(error){
            console.error("Auth Middleware Error:", error.message);
            return res.status(401).json({
                  success: false,
                  message: error.message,
            });

      }
}
