import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserProfileView {
    @Field()
    id: string

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field()
    email: string

    @Field()
    displayName: string

    @Field({ nullable: true })
    imageURL?: string
}
