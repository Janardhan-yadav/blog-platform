const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  
  return schema.validate(data);
};

const postValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: Joi.string().min(10).required(),
    tags: Joi.array().items(Joi.string().max(50)).max(10),
    imageUrl: Joi.string().uri().allow('')
  });
  
  return schema.validate(data);
};

const commentValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string().min(1).max(1000).required()
  });
  
  return schema.validate(data);
};

const profileUpdateValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100),
    bio: Joi.string().max(500).allow(''),
    profilePicture: Joi.string().uri().allow('')
  });
  
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  postValidation,
  commentValidation,
  profileUpdateValidation
};