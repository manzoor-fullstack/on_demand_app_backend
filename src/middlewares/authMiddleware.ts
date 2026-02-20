import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

export interface AuthRequest extends Request {
  user?: any; // ideally: User instance type
}

export const protect = asyncHandler(async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Not authorized", 401);
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  req.user = user;
  next();
});