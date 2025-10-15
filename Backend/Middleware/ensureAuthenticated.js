import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError.js";

const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    throw new ExpressError(403, "Unauthorized");
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const { status = 500, message = "Unauthorized" } = err;
    throw new ExpressError(status, message);
  }
};

export default ensureAuthenticated;
