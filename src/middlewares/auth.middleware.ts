import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import z from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Missing or invalid token.",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "YasirNaseem") as JwtPayload;
    const id = decoded.id;

    (req.body as any).id = id;
    next();
  } catch (error: any) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};

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

export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requiredBody = z.object({
    name: z
      .string({ message: "Name is required." })
      .min(2, { message: "Name should be at least 2 characters long." })
      .max(100, { message: "Name should be less than 100 characters." }),
    email: z
      .string({ message: "Email is required." })
      .email({ message: "Please enter a valid email." }),
    password: z
      .string({ message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password must be less than 100 characters long." }),
  });

  const parsedBody = requiredBody.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(401).json({
      status: false,
      message: "Invalid data format.",
      error: parsedBody.error.issues[0].message,
    });
  }

  req.body = parsedBody.data;
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requiredBody = z.object({
    email: z
      .string({ message: "Email is required." })
      .email({ message: "Please enter a valid email." }),
    password: z
      .string({ message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password must be less than 100 characters long." }),
  });

  const parsedBody = requiredBody.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(401).json({
      status: false,
      message: "Invalid data format.",
      error: parsedBody.error.issues[0].message,
    });
  }

  req.body = parsedBody.data;
  next();
};
