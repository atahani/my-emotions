import gql from 'graphql-tag'

export const REVOKE_APP = gql`
    mutation Revoke {
        revoke {
            isSucceeded
            message
        }
    }
`

export const GET_PROFILE = gql`
    query Profile {
        profile {
            id
            firstName
            lastName
            displayName
            imageURL
            email
        }
    }
`
