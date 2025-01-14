import {
  addContact,
  deleteContact,
  getAllContacts,
  getByIdContacts,
  getContact,
  updateContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contact.js';
import { parseContactsFilterParams } from '../utils/filter/parseContactsFilterParams.js';
import { contactAddSchema } from '../validation/contact.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseContactsFilterParams(req.query);
  filter.userId = req.user._id; //отримуємо айді

  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getByIdContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;

  const data = await getContact({ _id, userId }); //якщо належит тому хто запитує

  if (!data) {
    throw createError(400, `Contact with id ${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await addContact({ ...req.body, userId }); //дописали айді

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactsController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const { isNew, data } = await updateContact(
    contactId,
    { ...req.body, userId },
    {
      upsert: true,
    },
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status: 200,
    message: 'Successfully upsert a contact!',
    data,
  });
};

export const patchContactsController = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user; // Отримуємо userId

  const result = await updateContact({ _id, userId }, req.body);
  if (!result) {
    throw createError(404, `Contact with id ${_id} not found`);
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  const data = await deleteContact({ _id, userId });

  if (!data) {
    throw createError(404, `Movie with id=${_id} not found`);
  }
  res.status(204).send();
};
