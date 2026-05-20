import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { IUser, userRole } from "../modules/user/user.interface";

const auth = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(roles);
    try {
      // console.log("This is protected");
      // console.log(req.headers.authorization);
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized access!",
        });
      }

      const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload;
      // console.log(decoded);

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decoded.email],
      );
      // console.log(userData.rows[0]);

      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      if (!userData.rows[0].is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden!",
        });
      }

      req.user = decoded; // keeping the user info from decoded jwt payload in to the request. this "user" was custom created at /middleware/index.d.ts

      //   console.log(req.user);
      //   console.log(req.user.role);
      //   console.log(userData.rows[0].role);

      if (roles.length && !roles.includes(userData.rows[0].role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden! This role have no access",
        });
      }
      //   if (roles !== userRole.Admin) {
      //     res.status(403).json({
      //       success: false,
      //       message: "Forbidden!",
      //     });
      //   }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
