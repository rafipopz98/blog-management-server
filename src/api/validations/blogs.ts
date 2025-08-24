import Joi from "joi";

export const getAllBlogsValidations = Joi.object({
  skip: Joi.number().min(0).optional(),
  limit: Joi.number().min(2).max(5).optional(),
  category: Joi.string().optional(),
  author: Joi.string().optional(),
  searchQuery: Joi.string().optional(),
  sortQuery: Joi.string().valid("asc", "desc").optional(),
  featured: Joi.boolean().optional(),
});
