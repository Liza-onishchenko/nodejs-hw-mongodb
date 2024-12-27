const sortOrderList = ['asc', 'dsc'];
const sortByList = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

export const parseSortParams = ({ sortBy, sortOrder }, sortByList) => {
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];
  const parsedSortBy = sortByList.includes(sortBy) ? sortBy : '_id';
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
