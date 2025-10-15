import express from "express";
const router = express.Router();
import { showTurfs } from "../Controllers/turfController.js";
import { getTurfs } from "../Controllers/searchTurfController.js";

router.get("/show", showTurfs);
router.get("/search", getTurfs);

export default router;
