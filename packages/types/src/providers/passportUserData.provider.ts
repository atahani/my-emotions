import { ThirdPartyAuthenticatorType } from '../enums'

export class PassportUserData {
    id: string
    email: string
    firstName: string
    lastName: string
    displayName: string
    imageURL?: string
    accessToken: string
    refreshToken?: string
    thirdPartyAuthenticatorType: ThirdPartyAuthenticatorType
}
