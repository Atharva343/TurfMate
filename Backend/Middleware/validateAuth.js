import Joi from "joi";
import ExpressError from "../utils/ExpressError.js";

export const signupValidation = (req, res, next) => {
  const authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required().min(6),
  });

  const { error } = authSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map((e) => e.message).join(","));
  } else {
    next();
  }
};

export const loginValidation = (req, res, next) => {
  const authSchema = Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required().min(6),
  });

  const { error } = authSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map((e) => e.message).join(","));
  } else {
    next();
  }
};
