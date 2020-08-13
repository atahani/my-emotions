import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'

@Resolver()
export class AuthResolver {
    @Query(() => String)
    async hello(): Promise<string> {
        return 'hello graphql from NestJS'
    }
}
