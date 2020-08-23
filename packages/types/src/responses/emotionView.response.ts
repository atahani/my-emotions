import { ObjectType, Field } from '@nestjs/graphql'

import { UserBriefProfileView } from './userBriefProfileView.response'

@ObjectType()
export class EmotionView {
    @Field()
    id: string

    @Field(() => UserBriefProfileView)
    userBriefProfileView: UserBriefProfileView

    @Field()
    text: string

    @Field()
    emoji: string

    @Field()
    createdAt: Date
}
