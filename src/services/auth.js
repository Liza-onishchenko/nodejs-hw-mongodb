import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/Session.js';
import { randomBytes } from 'crypto';
import { accessTokenLifetime, refreshTokenLifetim } from '../constants/user.js';

//реєстрація
export const register = async (payload) => {
  const { email, password } = payload; //перевірка чи є така пошта в БД, статус та помилка
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  }); //юзер,емейл,пароль

  return newUser;
};

//Логін Аутентифікація
export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id }); //видалення сесії якщо вже є

  const accessToken = randomBytes(30).toString('base64'); //створ-ли 2 токени
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    //створ=мо і зберігаємо сесію вказуємо час життя
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetim,
  });
};
