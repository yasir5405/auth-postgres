import { Router } from "express";
import {
  hashPassword,
  validateLogin,
  validateSignup,
  verifyJWT,
} from "../middlewares/auth.middleware";
import {
  fetchUser,
  loginUser,
  signupUser,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", validateSignup, hashPassword, signupUser);

authRouter.post("/login", validateLogin, loginUser);

authRouter.get("/me", verifyJWT, fetchUser);

export { authRouter };
