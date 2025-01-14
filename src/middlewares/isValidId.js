import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

//чи може бути це id
export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(createError(400, `Invalid contactId: ${contactId}`));
  }
  next();
};
