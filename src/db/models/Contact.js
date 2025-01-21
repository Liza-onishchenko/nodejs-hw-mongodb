import { Schema, model } from 'mongoose';
import { typeList } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
    },
    photo: {
      type: String,
    },
    userId: {
      type: String,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false, // Вимикає поле __v
    timestamps: true,
  }, // Додає поля createdAt і updatedAt
);

//додати статуст помилки через хук для додавання якщо валідація не пройшла
contactSchema.post('save', handleSaveError);

//перед оновл-ням включаєм валідацію
contactSchema.pre('findOneAndUpdate', setUpdateSettings);

//додати статуст помилки через хук для оновлення
contactSchema.post('findOneAndUpdate', handleSaveError);

export const sortByList = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

//На основі схеми створ модель( клас)
const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
