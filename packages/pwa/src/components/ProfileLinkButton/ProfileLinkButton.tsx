import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import React from 'react'

import { UserProfileView } from '@my-emotions/types'

import { GET_MY_PROFILE } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { setUserProfile } from 'utils/persistData'

import Avatar from 'components/Avatar'

const ProfileLinkButton = () => {
    const { data } = useQuery<{ myProfile: UserProfileView }>(GET_MY_PROFILE, {
        onCompleted: (data) => {
            setUserProfile(data.myProfile)
        },
        onError: handleCommonErr,
        fetchPolicy: 'cache-first',
    })
    return (
        <Link to={`/users/${data?.myProfile.id}`}>
            <Avatar url={data?.myProfile.imageURL} name={data?.myProfile.displayName} size={36} border />
        </Link>
    )
}

export default ProfileLinkButton
