export const calcPaginationData = ({ totalItems, page, perPage }) => {
  const totalPage = Math.ceil(totalItems / perPage); //загальна к-сть стр
  const hasNextPage = page < totalPage; //чи є наступна стр
  const hasPreviousPage = page > 1; //є попередня стр
  return {
    page,
    perPage,
    totalPage,
    hasNextPage,
    hasPreviousPage,
  };
};
