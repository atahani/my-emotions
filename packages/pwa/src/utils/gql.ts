import gql from 'graphql-tag'

export const REVOKE_APP = gql`
    mutation Revoke($appId: String!) {
        revoke(appId: $appId) {
            isSucceeded
            message
        }
    }
`
