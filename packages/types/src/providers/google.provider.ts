export class GoogleUserProfile {
    id: string
    displayName: string
    name: {
        familyName: string
        givenName: string
    }
    emails: [{ value: string; verified: boolean }]
    photos: [{ value: string }]
    provider: 'google'
}
