import User from "../Models/User.js";
import ExpressError from "../utils/ExpressError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      throw new ExpressError(400, "User already exists");
    }
    const newUser = new User({ name, email, password });
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

    const jwtToken = jwt.sign(
      { _id: newUser._id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res
      .status(201)
      .json({ message: "User Signup Successful", jwtToken, newUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const exsistingUser = await User.findOne({ email });
    if (!exsistingUser) {
      throw new ExpressError(400, "Invalid email or password");
    }
    const isPassEqual = await bcrypt.compare(password, exsistingUser.password);
    if (!isPassEqual) {
      throw new ExpressError(400, "Invalid email or password");
    }

    const jwtToken = jwt.sign(
      {
        _id: exsistingUser._id,
        email: exsistingUser.email,
        name: exsistingUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "User login Successful",
      jwtToken,
      newUser: {
        id: exsistingUser._id,
        email: exsistingUser.email,
        name: exsistingUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
