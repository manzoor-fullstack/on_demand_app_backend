import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const userRole = await Role.findOne({ where: { name: role || "USER" } });
  if (!userRole) {
    throw new AppError("Invalid role", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role_id: userRole.id,
  });

  res.status(201).json({
    message: "User registered successfully",
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new AppError("Email and password required", 400);
    }
  
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role }],
    });
  
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }
  
    const token = jwt.sign(
      { id: user.id, role: user.Role?.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
  
    res.json({
      message: "Login successful",
      token,
      role: user.Role?.name,
    });
  });