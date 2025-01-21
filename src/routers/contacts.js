import { Router } from 'express';
import {
  deleteContactsController,
  getByIdContactController,
  getContactsController,
  patchContactsController,
  upsertContactsController,
} from '../controllers/contacts.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contact.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { addContactsController } from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload .js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getByIdContactController),
);

contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(addContactsController),
);

contactRouter.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(upsertContactsController),
);

contactRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactsController),
);

contactRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactsController),
);

export default contactRouter;
