import express from "express";
import ensureAuthenticated from "../Middleware/ensureAuthenticated.js";
import { getMyInfo } from "../Controllers/userController.js";

const router = express.Router();

router.get("/me", ensureAuthenticated, getMyInfo);

export default router;
