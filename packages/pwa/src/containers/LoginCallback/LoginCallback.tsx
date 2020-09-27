import { Redirect, useLocation } from 'react-router-dom'
import React from 'react'

import { setUserInformation } from 'utils/persistData'

const LoginCallback = () => {
    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const userId = query.get('userId')
    const appId = query.get('appId')
    if (userId && appId) {
        setUserInformation(userId, appId)
        return <Redirect to="/" />
    } else {
        return <Redirect to="/login" />
    }
}

export default LoginCallback
