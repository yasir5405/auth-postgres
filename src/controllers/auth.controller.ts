import { Request, Response } from "express";
import { client } from "../config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupUser = async (req: Request, res: Response) => {
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
      VALUES ($1, $2, $3) RETURNING id, name, email
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
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await client.query(
      `
            SELECT id, email, password FROM users WHERE email = $1
        `,
      [email]
    );

    if (user.rows.length < 1) {
      return res.status(403).json({
        status: false,
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(403).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
      },
      "YasirNaseem"
    );

    res.status(200).json({
      status: true,
      message: "Login successful.",
      token: token,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "Internal server error hai.",
      error: error.message,
    });
  }
};

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(401).json({
        status: false,
        message: "Missing or invalid token.",
      });
    }

    const query = await client.query(
      `
            SELECT name, email FROM users WHERE id = $1
        `,
      [id]
    );

    if (query.rows.length < 1) {
      return res.status(403).json({
        status: false,
        message: "Invalid token.",
      });
    }

    res.status(200).json({
      status: true,
      user: query.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "Error in fetching user details.",
      error: error.message,
    });
  }
};

