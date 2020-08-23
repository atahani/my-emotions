import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class UserBriefProfileView {
    @Field()
    id: string

    @Field()
    displayName: string

    @Field({ nullable: true })
    imageURL?: string
}
