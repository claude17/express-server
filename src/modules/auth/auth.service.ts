import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payLoad: { email: string; password: string }) => {
  const { email, password } = payLoad;

  // 1.check if the user exists
  // 2.compare the password
  // 3. Generate Token

  const userData = await pool.query(
    `
    SELECT * FROM users where email=$1
    `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // Generate Token

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jwtpayload, config.secret as string, { expiresIn: "1d" });

  const refreshToken = jwt.sign(jwtpayload, config.refresh_secret as string, { expiresIn: "10d" });

  return { accessToken, refreshToken };
};

const generateFreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized!");
  }

  const decoded = jwt.verify(token as string, config.refresh_secret as string) as JwtPayload;
  // console.log(decoded);

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [decoded.email],
  );
  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("User not found!");
  }

  if (!user.is_active) {
    throw new Error("Forbidden!");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jwtpayload, config.secret as string, { expiresIn: "1d" });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateFreshToken,
};
