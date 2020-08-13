import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('MutationStatus')
export class MutationStatus {
    constructor(isSucceeded: boolean, message: string) {
        this.isSucceeded = isSucceeded
        this.message = message
        return this
    }

    __typename: 'MutationStatus'

    @Field()
    isSucceeded: boolean

    @Field()
    message: string
}
