import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET: Secret =
  process.env.JWT_REFRESH_SECRET || "refresh_secret";
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "1h";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "1d";
const REFRESH_EXPIRES_IN_REMEMBER =
  process.env.JWT_REFRESH_EXPIRES_IN_REMEMBER || "7d";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (
  payload: object,
  rememberMe: boolean = false,
) => {
  const expiresIn = rememberMe
    ? REFRESH_EXPIRES_IN_REMEMBER
    : REFRESH_EXPIRES_IN;
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: expiresIn as any });
};

export const generateTokens = (
  payload: object,
  rememberMe: boolean = false,
) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload, rememberMe);
  return { accessToken, refreshToken };
};
