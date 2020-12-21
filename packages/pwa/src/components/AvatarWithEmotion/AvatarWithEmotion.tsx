import React from 'react'

import Avatar from 'components/Avatar'

import { ProfileLink, Emoji } from './styles'

type Props = {
    url?: string | undefined
    name?: string
    emoji: string
    profilePath: string
}

const AvatarWithEmotion: React.FC<Props> = ({ name = '', url, emoji, profilePath }) => (
    <ProfileLink to={profilePath}>
        <Avatar url={url} name={name} />
        <Emoji value={emoji} size={28} />
    </ProfileLink>
)

export default AvatarWithEmotion
