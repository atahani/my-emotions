import { Link } from 'react-router-dom'
import React from 'react'

import { isLoggedIn } from 'utils/persistData'

import AppBar from 'components/AppBar'
import EmojiButton from 'components/EmojiButton'
import EmotionList from 'components/EmotionList'
import ProfileLinkButton from 'components/ProfileLinkButton'

import { Logo, Content } from './styles'

const Home: React.FC = () => (
    <>
        <AppBar
            leftNode={isLoggedIn() ? <ProfileLinkButton /> : <Logo />}
            titleNode={isLoggedIn() && <Logo />}
            rightNode={
                isLoggedIn() ? (
                    <Link to="/release-emotion">
                        <EmojiButton emoji="🆕" size={28} />
                    </Link>
                ) : (
                    <Link to="/login">
                        <EmojiButton emoji="👣" size={28} />
                    </Link>
                )
            }
        />
        <Content>
            <EmotionList />
        </Content>
    </>
)

export default Home
