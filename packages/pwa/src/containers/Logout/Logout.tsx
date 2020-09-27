import { Redirect, useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import React, { useEffect } from 'react'

import { MutationStatus } from '@my-emotions/types'

import { getAppId, clearLocalStorage } from 'utils/persistData'
import { REVOKE_APP } from 'utils/gql'

const Logout = () => {
    const { replace } = useHistory()
    const [revoke] = useMutation<{ revoke: MutationStatus }, { appId: string }>(REVOKE_APP, {
        onCompleted: () => {
            clearLocalStorage()
            replace('/')
        },
        onError: (err) => {
            clearLocalStorage()
            replace('/')
        },
    })
    useEffect(() => {
        const appId = getAppId()
        if (appId) {
            revoke({ variables: { appId } })
        }
    }, [revoke])
    if (!getAppId()) {
        return <Redirect to="/" />
    }
    //TODO: can be present a loading
    return null
}

export default Logout
