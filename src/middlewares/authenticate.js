import createHttpError from 'http-errors';
import { getSession, getUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization'); //отримали заголовок
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header not found'));
  }

  const [bearer, accessToken] = authHeader.split(' '); //строку перетво-ти на 2 слова,деструкту-ція масиву
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must be Bearer type'));
  }

  //чи наш токен
  const session = await getSession({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired')); //чи не вийшов термін дії токену
  }

  const user = await getUser({ _id: session.userId }); //чи є в кол-ії user з таким id
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user; //зберігаємо id  користувача

  next();
};
