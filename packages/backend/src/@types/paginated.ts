import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Type } from '@nestjs/common'

export default function PaginatedResponse<T>(classRef: Type<T>): any {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponse<T> {
        @Field((type) => Int)
        page: number

        @Field((type) => Int)
        totalPage: number

        @Field((type) => Int)
        totalItems: number

        @Field((type) => [classRef])
        items: T[]
    }
    return PaginatedResponse
}
