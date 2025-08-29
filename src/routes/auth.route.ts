import { Router } from "express";
import {
  hashPassword,
  validateLogin,
  validateSignup,
  validateTodo,
  verifyJWT,
} from "../middlewares/auth.middleware";
import {
  addTodo,
  fetchUser,
  getTodos,
  loginUser,
  signupUser,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", validateSignup, hashPassword, signupUser);

authRouter.post("/login", validateLogin, loginUser);

authRouter.get("/me", verifyJWT, fetchUser);

authRouter.post("/todos", verifyJWT, validateTodo, addTodo);

authRouter.get("/todos", verifyJWT, getTodos);

export { authRouter };
