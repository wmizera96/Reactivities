export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    constructor(public data: T, public pagination: Pagination){ }
}

export class PagingParams {
    constructor(public pageNumber: number = 1, public pageSize: number = 5) {}
}