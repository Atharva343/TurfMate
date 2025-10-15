import User from "../Models/User.js";
import ExpressError from "../utils/ExpressError.js";

export const getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "ticketsCreated",
        populate: { path: "interestedUsers", select: "name email" },
      })
      .populate({
        path: "ticketsInterested",
        populate: { path: "createdBy", select: "name email" },
      });

    if (!user) {
      throw new ExpressError(404, "User Not Found");
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
