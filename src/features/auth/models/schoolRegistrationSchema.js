import Joi from 'joi';

const schoolRegistrationSchema = Joi.object({
  schoolName: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'School name is required.',
    'string.min': 'School name must have at least 3 characters.',
    'string.max': 'School name must have less than 50 characters.',
  }),
  schoolAddress: Joi.string().min(5).max(100).required().messages({
    'string.empty': 'School address is required.',
    'string.min': 'School address must have at least 5 characters.',
    'string.max': 'School address must have less than 100 characters.',
  }),
  schoolEmail: Joi.string()
    .email({ tlds: { allow: ['com', 'org', 'net'] } })
    .required()
    .messages({
      'string.empty': 'School email is required.',
      'string.email': 'Please enter a valid email address.',
    }),
  adminName: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'User name is required.',
    'string.min': 'User name must have at least 3 characters.',
    'string.max': 'User name must have less than 50 characters.',
  }),
  adminEmail: Joi.string()
    .email({ tlds: { allow: ['com', 'org', 'net'] } })
    .required()
    .messages({
      'string.empty': 'User email is required.',
      'string.email': 'Please enter a valid email address.',
    }),
  adminPassword: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must have at least 6 characters.',
    'string.max': 'Password must have less than 30 characters.',
  }),
});

export default schoolRegistrationSchema;
