export const httpServerGraphqlUri = process.env['REACT_APP_SERVER_GRAPHQL_URI_HTTP']

if (!httpServerGraphqlUri || httpServerGraphqlUri === '') {
    throw Error('Please set REACT_APP_SERVER_GRAPHQL_URI_HTTP environment variable')
}

export const wsServerGraphqlUri = process.env['REACT_APP_SERVER_GRAPHQL_URI_WS']

if (!wsServerGraphqlUri || wsServerGraphqlUri === '') {
    throw new Error('Please set REACT_APP_SERVER_GRAPHQL_URI_WS environment variable')
}

export const googleSignInUri = process.env['REACT_APP_GOOGLE_SIGN_IN_URI']

if (!googleSignInUri || googleSignInUri === '') {
    throw Error('Please set REACT_APP_GOOGLE_SIGN_IN_URI variable')
}
