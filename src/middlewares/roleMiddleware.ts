import { Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.Role?.name)) {
      throw new AppError("Forbidden", 403);
    }
    next();
  };
};