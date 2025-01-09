import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/user.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false, // Вимикає поле __v
    timestamps: true,
  },
); // Додає поля createdAt і updatedAt

//додати статуст помилки через хук для додавання якщо валідація не пройшла
userSchema.post('save', handleSaveError);

//перед оновл-ням включаєм валідацію
userSchema.pre('findOneAndUpdate', setUpdateSettings);

//додати статуст помилки через хук для оновлення
userSchema.post('findOneAndUpdate', handleSaveError);

//На основі схеми створ модель( клас)
const UserCollection = model('user', userSchema);

export default UserCollection;
