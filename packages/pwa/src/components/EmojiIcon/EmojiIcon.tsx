import emoji from 'react-easy-emoji'
import React from 'react'
import styled from 'styled-components'

type ImgProps = {
    size?: number
}

const Img = styled('img')<ImgProps>`
    height: ${(props) => (props.size ? `${props.size}px` : '1rem')};
    width: ${(props) => (props.size ? `${props.size}px` : '1rem')};
`

type Props = {
    className?: string
    value: string
    size?: number
}

const EmojiIcon: React.FC<Props> = ({ className, value, size }) =>
    emoji(value, (code, string, key) => (
        <Img
            className={className}
            src={`https://twemoji.maxcdn.com/2/svg/${code}.svg`}
            size={size}
            alt={string}
            key={key}
        />
    ))

export default EmojiIcon
