import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserAccessData')
export class UserAccessData {
    constructor(userId: string, appId: string, accessToken: string) {
        this.userId = userId
        this.appId = appId
        this.accessToken = accessToken
    }
    @Field()
    userId: string

    @Field()
    appId: string

    @Field()
    accessToken: string
}
