export const calculatePaginationData = ({
  totalItems,
  page,
  perPage,
}: {
  totalItems: number;
  page: number;
  perPage: number;
}) => {
    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = page >= totalPages;
    const hasPrevPage = page > 1;
    return {
        page,
        perPage,
        totalItems,
        hasNextPage,
        hasPrevPage

    }
};
