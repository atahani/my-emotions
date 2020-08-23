import { InputType, Field } from '@nestjs/graphql'
import { Length } from 'class-validator'

@InputType()
export class ReleaseEmotionInput {
    @Length(1, 140)
    @Field()
    text: string

    @Length(1, 2)
    @Field()
    emoji: string
}
