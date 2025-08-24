import Joi from "joi";

export const getAllBlogsValidations = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  category: Joi.string().optional(),
  author: Joi.string().optional(),
  searchQuery: Joi.string().optional(),
  sortQuery: Joi.string().valid("asc", "desc").optional(),
  featured: Joi.boolean().optional(),
});
