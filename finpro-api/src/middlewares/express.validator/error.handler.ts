import { validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const errorValidatorHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array()); // ADA CONSOLE DISINI
    if (!errors.isEmpty()) {
      throw { isExpose: true, status: 406, message: errors.array()[0].msg };
    } 
    next();
  } catch (error) {
    next(error);
  }
};
