import { registerEnumType } from '@nestjs/graphql'

export enum ThirdPartyAuthenticatorType {
    GOOGLE = 'google',
}

registerEnumType(ThirdPartyAuthenticatorType, {
    name: 'ThirdPartyAuthenticatorType',
})
