import Joi from "joi";

export const userRegisterValidation = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const userLoginValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const resetPasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export const isUserName = Joi.object({
  username: Joi.string().required(),
});
