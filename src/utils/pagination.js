export const getPagination = (page, limit)=>{
    const currentPage = parseInt(page) || 1;

    const perPage = parseInt(limit) || 5;

    const skip = (currentPage - 1)*perPage;

    return {
        currentPage,
        perPage,
        skip,
    };
};