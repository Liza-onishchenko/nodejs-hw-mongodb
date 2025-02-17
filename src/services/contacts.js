import ContactCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;

  const contactsQuery = ContactCollection.find(); //отрим запит

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  const totalItems = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip) //ск-ки пропустити з початку
    .limit(limit) //ск-ки
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calcPaginationData({ totalItems, page, perPage });

  return {
    data: contacts,
    totalItems,
    ...paginationData,
  };
};

export const getByIdContacts = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};

export const getContact = (filter) => ContactCollection.findOne(filter);

export const addContact = async (payload) => {
  //приходить інформ іd  в payload, зберiг-мо i повер-мо
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (filter, payload, options = {}) => {
  const { upsert = false } = options;

  const result = await ContactCollection.findOneAndUpdate(filter, payload, {
    upsert,
    includeResultMetadata: true,
  });

  if (!result || !result.value) return null;

  const isNew = Boolean(result.lastErrorObject.upserted);

  return { isNew, data: result.value };
};

export const deleteContact = async (filter) => {
  const contact = await ContactCollection.findOneAndDelete(filter);
  return contact;
};
