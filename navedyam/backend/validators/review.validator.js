const Joi = require('joi');

const reviewSchema = Joi.object({
  order_id:    Joi.string().required(),
  menu_item_id: Joi.string().required(),
  rating:      Joi.number().integer().min(1).max(5).required(),
  comment:     Joi.string().allow('').max(500).optional(),
});

module.exports = { reviewSchema };
