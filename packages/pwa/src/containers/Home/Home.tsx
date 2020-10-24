import { Link } from 'react-router-dom'
import React from 'react'

import AppBar from 'components/AppBar'
import EmojiButton from 'components/EmojiButton'

import { Logo } from './styles'

const Home: React.FC = () => {
    return (
        <>
            <AppBar
                leftNode={<Logo src="/static/assets/svg/logo_face_red.svg" alt="my-emotion" />}
                rightNode={
                    <Link to="/release-emotion">
                        <EmojiButton emoji="🆕" size={28} />
                    </Link>
                }
            />
        </>
    )
}

export default Home
