import express from "express";
const router = express.Router();
import {
  loginValidation,
  signupValidation,
} from "../Middleware/validateAuth.js";

import { login, signup } from "../Controllers/authController.js";

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

export default router;
