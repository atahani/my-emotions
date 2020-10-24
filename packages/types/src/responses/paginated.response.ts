export class PaginatedResponse<T> {
    page: number

    totalPage: number

    totalItems: number

    items: T[]
}
