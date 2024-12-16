import { Router } from 'express';
import {
  getByIdContactController,
  getContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get('/:contactId', ctrlWrapper(getByIdContactController));

export default contactRouter;
