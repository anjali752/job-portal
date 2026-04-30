import ErrorHandler from "./error.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return next(new ErrorHandler(errorMessage, 400));
    }
    
    next();
  };
};
