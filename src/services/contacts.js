import ContactCollection from '../db/models/Contact.js';

export const getAllContacts = async () => {
  // throw new Error('Database error');
  // return ContactCollection.find();
  const contact = await ContactCollection.find();
  return contact;
};

export const getByIdContacts = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};
