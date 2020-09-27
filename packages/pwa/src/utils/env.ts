export const serverGraphqlUri = process.env['REACT_APP_SERVER_GRAPHQL_URI']

if (!serverGraphqlUri || serverGraphqlUri === '') {
    throw Error('Please set REACT_APP_SERVER_GRAPHQL_URI environment variable')
}

export const googleSignInUri = process.env['REACT_APP_GOOGLE_SIGN_IN_URI']

if (!googleSignInUri || googleSignInUri === '') {
    throw Error('Please set REACT_APP_GOOGLE_SIGN_IN_URI variable')
}
