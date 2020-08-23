import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ActionStatus {
    constructor(message: string) {
        this.message = message
    }

    @Field()
    message: string
}
