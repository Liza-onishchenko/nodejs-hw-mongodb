import ContactCollection from '../db/models/Contact.js';

export const getAllContacts = async () => {
  const contact = await ContactCollection.find();
  return contact;
  // throw new Error('Database error');
  // return ContactCollection.find();
};

export const getByIdContacts = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};

export const addContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (_contactId, payload, options = {}) => {
  const { upsert = false } = options;
  const result = await ContactCollection.findOneAndUpdate(
    { _id: _contactId },
    payload,
    {
      new: true,
      upsert,
      includeResultMetadata: true,
    },
  );

  if (!result || !result.value) return null;

  const isNew = Boolean(result.lastErrorObject.upserted);

  return { isNew, data: result.value };
};

export const deleteContact = async (filter) => {
  const contact = await ContactCollection.findOneAndDelete(filter);
  return contact;
};
