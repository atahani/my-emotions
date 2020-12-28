import gql from 'graphql-tag'

export const GET_APPS = gql`
    {
        apps {
            id
        }
    }
`

export const REVOKE_APP = gql`
    mutation {
        revoke {
            isSucceeded
            message
        }
    }
`

export const GET_MY_PROFILE = gql`
    {
        myProfile {
            firstName
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

export const RELEASE_EMOTION = gql`
    mutation ReleaseEmotion($data: ReleaseEmotionInput!) {
        releaseEmotion(data: $data) {
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
`

export const FORGOT_EMOTION = gql`
    mutation ForgotEmotion($id: String!) {
        forgotEmotion(id: $id) {
            message
        }
    }
`

export const GET_EMOTION = gql`
    query GetEmotion($id: String!) {
        emotion(id: $id) {
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

export const NEW_EMOTION = gql`
    subscription {
        newEmotion {
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
`
