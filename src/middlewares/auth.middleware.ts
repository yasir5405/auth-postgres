import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

export const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    req.body.password = hashedPassword;
    next();
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "Interal server error",
      error: error.message,
    });
  }
};
