import React from 'react'

import EmojiIcon from 'components/EmojiIcon'

import { Wrapper, Image, Emoji } from './styles'

type Props = {
    imageURL?: string
    name: string
    emoji: string
}

const Avatar: React.FC<Props> = ({ name, imageURL, emoji }) => (
    <Wrapper>
        {imageURL ? (
            <>
                <Image src={imageURL} alt={name} />
                <Emoji value={emoji} size={24} />
            </>
        ) : (
            <EmojiIcon value={emoji} size={60} />
        )}
    </Wrapper>
)

export default Avatar
