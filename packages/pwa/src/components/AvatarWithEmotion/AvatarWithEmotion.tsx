import React from 'react'

import Avatar from 'components/Avatar'

import { Wrapper, Emoji } from './styles'

type Props = {
    url?: string | undefined
    name?: string
    emoji: string
}

const AvatarWithEmotion: React.FC<Props> = ({ name = '', url, emoji }) => (
    <Wrapper>
        <Avatar url={url} name={name} />
        <Emoji value={emoji} size={28} />
    </Wrapper>
)

export default AvatarWithEmotion
