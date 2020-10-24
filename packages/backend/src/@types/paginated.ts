import { Field, ObjectType } from '@nestjs/graphql'

export interface ClassType<T = any> {
    new (...args: any[]): T
}

export default function PaginatedResponse<TItemsFieldValue>(itemsFieldValue: ClassType<TItemsFieldValue>): any {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponse<T> {
        @Field()
        page: number

        @Field()
        totalPage: number

        @Field()
        totalItems: number

        @Field(() => [itemsFieldValue])
        items: TItemsFieldValue[]
    }
    return PaginatedResponse
}
