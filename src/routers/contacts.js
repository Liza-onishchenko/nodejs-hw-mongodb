import { Router } from 'express';
import {
  deleteContactsController,
  getByIdContactController,
  getContactsController,
  patchContactsController,
  upsertContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { addContactsController } from '../controllers/contacts.js';

const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get('/:contactId', ctrlWrapper(getByIdContactController));

contactRouter.post('/', ctrlWrapper(addContactsController));

contactRouter.put('/:contactId', ctrlWrapper(upsertContactsController));

contactRouter.patch('/:contactId', ctrlWrapper(patchContactsController));

contactRouter.delete('/:contactId', ctrlWrapper(deleteContactsController));

export default contactRouter;
