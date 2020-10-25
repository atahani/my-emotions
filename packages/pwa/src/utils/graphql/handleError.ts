import { ApolloError } from '@apollo/client'
import { toast } from 'react-toastify'

import messages from './messages'

export const handleCommonErr = (error: ApolloError, handleMore?: () => void) => {
    if (error.graphQLErrors) {
        if (error.graphQLErrors.some((err) => err.extensions?.code === 'NOT_FOUND_RESOURCE')) {
            // it's better to redirect to /404 notfound page with appropriate image
            window.location.href = '/'
        }
        if (error.graphQLErrors.some((err) => err.extensions?.exception.response.statusCode === 500)) {
            toast.error(messages.internalServer)
        }
    }
    if (error.networkError && error.networkError?.message === 'Failed to fetch') {
        // check is user online
        const isOnline = typeof navigator.onLine === 'boolean' ? navigator.onLine : true
        if (!isOnline) {
            toast.warning(messages.noInternetConnection)
        }
        toast.error(messages.connectionRefused)
    }
    if (handleMore) {
        return handleMore()
    }
    toast.error(messages.unhandledErrorHappened)
}
