import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import { MutationStatus } from '@my-emotions/types'

import { clearLocalStorage } from 'utils/persistData'
import { handleCommonErr } from 'utils/graphql/handleError'
import { REVOKE_APP } from 'utils/graphql/gql'

const Logout = () => {
    const { replace } = useHistory()
    const [revoke] = useMutation<{ revoke: MutationStatus }>(REVOKE_APP, {
        onCompleted: () => {
            clearLocalStorage()
            replace('/')
        },
        onError: (err) =>
            handleCommonErr(err, () => {
                clearLocalStorage()
                replace('/')
            }),
    })
    useEffect(() => {
        revoke()
    }, [revoke])
    //TODO: can be present a loading
    return null
}

export default Logout
