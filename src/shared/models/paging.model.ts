export interface Paging {
    page: number,
    pageSize: number,
    totalPages: number,
    totalCount: number,
}

export const DefaultPagination : Paging = {
    page: 1,
    pageSize: 25,
    totalCount: 0,
    totalPages:0
}
