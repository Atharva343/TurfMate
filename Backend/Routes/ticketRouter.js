import express from "express";
import ensureAuthenticated from "../Middleware/ensureAuthenticated.js";
import {
  createTicket,
  getTicketsByTurf,
  markInterest,
  getMyTickets,
} from "../Controllers/ticketController.js";

const router = express.Router();

// Create a new ticket
router.post("/create/:turfId", ensureAuthenticated, createTicket);

// Get all tickets for a specific turf
router.get("/turf/:turfId", ensureAuthenticated, getTicketsByTurf);

// Mark interest in a ticket
router.post("/interest/:ticketId", ensureAuthenticated, markInterest);

// Get all tickets created by the logged-in user
router.get("/my", ensureAuthenticated, getMyTickets);

export default router;
