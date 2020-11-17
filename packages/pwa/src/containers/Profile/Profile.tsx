import { Redirect, useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import React from 'react'

import { UserProfileView } from '@my-emotions/types'

import Avatar from 'components/Avatar'
import EmotionList from 'components/EmotionList'

import { GET_PROFILE } from 'utils/graphql/gql'
import { getUserProfile, isLoggedIn } from 'utils/persistData'
import { handleCommonErr } from 'utils/graphql/handleError'
import { profileAppBarHeightInRem } from 'utils/style/fixedSizes'

import AppBar from 'components/AppBar'
import EmojiButton from 'components/EmojiButton'

import { Content, DisplayName, UserInfo } from './styles'

const Profile = () => {
    const { id } = useParams<{ id: string }>()
    const { data } = useQuery<{ profile: UserProfileView }, { userId: string }>(GET_PROFILE, {
        onError: handleCommonErr,
        fetchPolicy: 'cache-first',
        variables: { userId: id },
    })

    const loggedInProfile = getUserProfile()

    if (!id && !isLoggedIn()) {
        return <Redirect to="/" />
    }
    return (
        <>
            <AppBar
                backURL="/"
                heightInRem={profileAppBarHeightInRem}
                rightNode={
                    isLoggedIn() &&
                    loggedInProfile?.id === id && (
                        <Link to="/logout">
                            <EmojiButton emoji="🏃🏻‍" size={28} />
                        </Link>
                    )
                }
                titleNode={
                    <UserInfo>
                        <Avatar url={data?.profile.imageURL} name={data?.profile.displayName} size={85} />
                        <DisplayName>{data?.profile.displayName}</DisplayName>
                    </UserInfo>
                }
            />
            {data && (
                <Content>
                    <EmotionList userId={data.profile.id} />
                </Content>
            )}
        </>
    )
}

export default Profile
