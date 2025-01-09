import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, //що це саме Id
      ref: 'user', // з якої колекції
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date, // час - тип Date
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false, // Вимикає поле __v
    timestamps: true, // Додає поля createdAt і updatedAt
  },
);

//додати статуст помилки через хук для додавання якщо валідація не пройшла
sessionSchema.post('save', handleSaveError);

//перед оновл-ням включаєм валідацію
sessionSchema.pre('findOneAndUpdate', setUpdateSettings);

//додати статуст помилки через хук для оновлення
sessionSchema.post('findOneAndUpdate', handleSaveError);

//На основі схеми створ модель( клас)
const SessionCollection = model('session', sessionSchema);

export default SessionCollection;
