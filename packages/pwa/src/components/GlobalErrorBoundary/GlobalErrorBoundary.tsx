import { toast } from 'react-toastify'
import React, { Component } from 'react'

import graphqlMessages from 'utils/graphql/messages'

type Props = {
    children: React.ReactNode
}

class GlobalErrorBoundary extends Component<Props> {
    componentDidCatch(error: any) {
        // the signature componentDidCatch(error: Error | null, errorInfo: object)
        // in the future we can log the error to reporting service
        toast.error(graphqlMessages.unhandledErrorHappened)
    }

    render() {
        return this.props.children
    }
}

export default GlobalErrorBoundary
