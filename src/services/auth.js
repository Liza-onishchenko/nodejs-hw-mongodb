import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/Session.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { accessTokenLifetime, refreshTokenLifetim } from '../constants/user.js';
import { randomBytes } from 'crypto';
import { getEnvVar } from '../utils/getEnvVar.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { sendEmail } from '../utils/sendMail.js';

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

//Перевіряє наявність користувача,генерує токен,надсилає email.
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email }); //пошук кори-чча за поштою в бд
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  //Якщо користувача знайдено, створюємо JWT токен для скидання пароля
  const resetToken = jwt.sign(
    // генерації нового токена
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'), // Секретний ключ для підпису токена
    {
      expiresIn: '15m', //Термін дії
    },
  );
  // Надсилання електронного листа із токеном

  const resetPasswordTemplatePath = path.join(
    //зберігається шлях до шаблону
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  // зчитаний шаблон --> handlebars.compile(), щоб створити фу-цію,яка генерує HTML-код.
  const template = handlebars.compile(templateSource);
  const html = template({
    //підстановка в шаблон
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  // HTML код згенеровано, він відправляється через функцію sendEmail
  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPasswod = async (payload) => {
  let entries; //потрапляють декодовані дані з токену

  try {
    //перевірки та розшифровки токену
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw err;
  }
  // з розшифрованого токену пошук користувача в базі даних
  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  //видалення сесії
  await SessionCollection.deleteOne({ userId: user._id });

  //хешування нового паролю
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  //оновлення паролю в Базі даних
  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
