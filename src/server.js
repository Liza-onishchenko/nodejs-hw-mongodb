import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from '../src/routers/auth.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config(); //для роботи з змін.оточ

export const setupServer = () => {
  const app = express(); // створення express серверу

  app.use(cors());

  app.use(express.json());

  app.use(express.static('uploads'));

  app.use(cookieParser());

  // app.use(logger);

  app.use('/auth', authRouter);

  app.use('/contacts', contactRouter);

  app.use('/api-docs', swaggerDocs());
  // обробка неіснуючих шляхів
  app.use(notFoundHandler);

  // обробка неіснуючих шляхів
  app.use(errorHandler);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
