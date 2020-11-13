import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import React from 'react'

import { UserProfileView } from '@my-emotions/types'

import { GET_PROFILE } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { setUserProfile } from 'utils/persistData'

import Avatar from 'components/Avatar'

const ProfileLinkButton = () => {
    const { data } = useQuery<{ profile: UserProfileView }>(GET_PROFILE, {
        onCompleted: (data) => {
            setUserProfile(data.profile)
        },
        onError: handleCommonErr,
        fetchPolicy: 'cache-first',
    })
    return (
        <Link to="/profile">
            <Avatar url={data?.profile.imageURL} name={data?.profile.displayName} size={36} border />
        </Link>
    )
}

export default ProfileLinkButton
