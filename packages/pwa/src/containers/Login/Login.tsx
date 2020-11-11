import React from 'react'

import { googleSignInUri } from 'utils/env'

import { Wrapper, LogoWrapper, Logo, Footer, GoogleSignInBtn } from './styles'

const Login: React.FC = () => (
    <Wrapper>
        <LogoWrapper>
            <Logo src="/static/assets/svg/logo_face_white.svg" alt="My Emotion Logo" />
        </LogoWrapper>
        <Footer>
            <GoogleSignInBtn href={googleSignInUri}>
                <div>
                    <img src="/static/assets/svg/google_logo.svg" alt="google logo" />
                </div>
                <p>
                    <b>Sign in with Google</b>
                </p>
            </GoogleSignInBtn>
        </Footer>
    </Wrapper>
)

export default Login
