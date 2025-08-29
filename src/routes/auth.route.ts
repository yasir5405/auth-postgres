import { Router } from "express";
import { z } from "zod";
import { client } from "../config/config";
import { hashPassword } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post(
  "/signup",
  async (req, res, next) => {
    const requiredBody = z.object({
      name: z
        .string()
        .min(2, { message: "Name should be at least 2 characters long." })
        .max(100),
      email: z.string().email({ message: "Please enter a valid email." }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100),
    });

    const parsedBody = requiredBody.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(401).json({
        status: false,
        message: "Invalid data format.",
        error: parsedBody.error.issues[0].message,
      });
    }

    // put validated body back into req.body
    req.body = parsedBody.data;

    next();
  },
  hashPassword,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userExists = await client.query(
        `SELECT email FROM users WHERE email = $1`,
        [email]
      );
      if (userExists.rows.length > 0) {
        return res.status(403).json({
          status: false,
          message: "Email is already registered.",
        });
      }

      const signupQuery = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3) RETURNING *
    `;
      const response = await client.query(signupQuery, [name, email, password]);

      res.status(201).json({
        status: true,
        message: "User registered successfully.",
        user: response.rows[0],
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

export { authRouter };
