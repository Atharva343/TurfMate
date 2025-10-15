import Ticket from "../Models/Ticket.js";
import User from "../Models/User.js";
import ExpressError from "../utils/ExpressError.js";

const decodeTurfId = (turfId) => turfId.replace("-", "/");

// Create a new ticket
export const createTicket = async (req, res, next) => {
  try {
    const { turfId } = req.params;
    const { turfName, time, numberOfPlayers } = req.body;

    if (!turfId || !turfName || !time || !numberOfPlayers) {
      console.log(
        `Turf ID: ${turfId}, Name: ${turfName}, Time: ${time}, Players: ${numberOfPlayers}`
      );
      console.log(decodeTurfId(turfId));
      throw new ExpressError(
        400,
        "turfId, turfName, time and numberOfPlayers are required"
      );
    }

    const ticket = new Ticket({
      turfId,
      turfName,
      createdBy: req.user._id,
      time,
      numberOfPlayers,
    });

    await ticket.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { ticketsCreated: ticket._id },
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (err) {
    next(err);
  }
};

// Get all tickets for a specific turf
export const getTicketsByTurf = async (req, res, next) => {
  try {
    const { turfId } = req.params;
    if (!turfId) throw new ExpressError(400, "turfId is required");

    const tickets = await Ticket.find({ turfId })
      .populate("createdBy", "name email")
      .populate("interestedUsers", "name email");

    res.json({ count: tickets.length, tickets });
  } catch (err) {
    next(err);
  }
};

// Mark interest in a specific ticket
export const markInterest = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user._id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new ExpressError(404, "Ticket not found");

    if (ticket.createdBy.toString() === userId.toString()) {
      throw new ExpressError(
        400,
        "You cannot mark interest in your own ticket"
      );
    }

    const alreadyInterested = ticket.interestedUsers.some(
      (u) => u.toString() === userId.toString()
    );

    if (alreadyInterested) {
      return res.status(200).json({ message: "You already showed interest" });
    }

    ticket.interestedUsers.push(userId);
    await ticket.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { ticketsInterested: ticket._id },
    });

    res.json({ message: "Interest registered successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all tickets created by the current user
export const getMyTickets = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const tickets = await Ticket.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .populate("interestedUsers", "name email");

    res.json({ count: tickets.length, tickets });
  } catch (err) {
    next(err);
  }
};
