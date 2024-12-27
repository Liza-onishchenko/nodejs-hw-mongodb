const parseContactType = (contactType) => {
  //перевірка на тип
  const isString = typeof contactType === 'string';
  if (!isString) return; //не рядок-поверта unddefined

  const validContactTypes = ['work', 'home', 'personal']; //дозводені типи

  if (validContactTypes.includes(contactType)) return contactType; //якщо є значення -поверта тип,ні-undefined
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string'; //якщо рядок-true,ні-false
  if (!isString) return; //не рядок- undefined

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return; //якщо не true/false поверта undefined
};

export const parseContactsFilterParams = ({ contactType, isFavorite }) => {
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavorite = parseBoolean(isFavorite);

  return {
    //обєкт з обробленим знач-ям
    contactType: parsedContactType,
    isFavorite: parsedIsFavorite,
  };
};
