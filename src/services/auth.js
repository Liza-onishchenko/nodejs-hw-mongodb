import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/Session.js';
import { randomBytes } from 'crypto';
import { accessTokenLifetime, refreshTokenLifetim } from '../constants/user.js';
import exp from 'constants';

//фу-ція для логіну і рефреш токену
const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'), // створення токену доступу
  refreshToken: randomBytes(30).toString('base64'), // створення refresh токену
  accessTokenValidUntil: Date.now() + accessTokenLifetime, // час дії токену доступу
  refreshTokenValidUntil: Date.now() + refreshTokenLifetim, // час дії refresh токену
});

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

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshToken = async (payload) => {
  const oldSession = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const getUser = (filter) => UserCollection.findOne(filter); //пошук користувача

export const getSession = (filter) => SessionCollection.findOne(filter); //передали умову, є сессія чи нал
