import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { UserProfileView } from '@my-emotions/types'

import { GET_MY_PROFILE } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { setUserProfile } from 'utils/persistData'

const LoginCallback = () => {
    const { push } = useHistory()
    useQuery<{ myProfile: UserProfileView }>(GET_MY_PROFILE, {
        onCompleted: (data) => {
            setUserProfile(data.myProfile)
            push('/')
        },
        onError: (err) =>
            handleCommonErr(err, () => {
                push('/login')
            }),
    })
    return null
}

export default LoginCallback
