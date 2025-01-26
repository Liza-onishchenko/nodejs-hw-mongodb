import createHttpError from 'http-errors';
import { SWAGGER_PATH } from '../constants/index.js';
import { readFileSync } from 'node:fs';
import swaggerUiExpress from 'swagger-ui-express';

export const swaggerDocs = () => {
  try {
    const docs = JSON.parse(readFileSync(SWAGGER_PATH, 'utf-8'));
    return [...swaggerUiExpress.serve, swaggerUiExpress.setup(docs)];
  } catch (error) {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
