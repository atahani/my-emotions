import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { UserProfileView } from '@my-emotions/types'

import { GET_PROFILE } from 'utils/gql'
import { setUserProfile } from 'utils/persistData'

const LoginCallback = () => {
    const { push } = useHistory()
    useQuery<{ profile: UserProfileView }>(GET_PROFILE, {
        onCompleted: (data) => {
            setUserProfile(data.profile)
            push('/')
        },
        onError: () => {
            push('/login')
        },
    })
    return null
}

export default LoginCallback
