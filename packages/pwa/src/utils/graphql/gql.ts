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
    query Profile($userId: String!) {
        profile(userId: $userId) {
            id
            firstName
            lastName
            displayName
            imageURL
            email
        }
    }
`

export const GET_MY_PROFILE = gql`
    query MyProfile {
        myProfile {
            id
            firstName
            lastName
            displayName
            imageURL
            email
        }
    }
`

export const RELEASE_EMOTION = gql`
    mutation ReleaseEmotion($data: ReleaseEmotionInput!) {
        releaseEmotion(data: $data)
    }
`

export const GET_EMOTIONS = gql`
    query GetEmotions($page: Int, $itemPerPage: Int, $userId: String) {
        emotions(page: $page, itemPerPage: $itemPerPage, userId: $userId) {
            page
            totalItems
            totalPage
            items {
                id
                text
                emoji
                createdAt
                userBriefProfileView {
                    id
                    displayName
                    imageURL
                }
            }
        }
    }
`
