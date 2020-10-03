import React from 'react'
import styled from 'styled-components'

import EmojiIcon from 'components/EmojiIcon'

const Button = styled('button')`
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    ${(props) =>
        props.disabled &&
        `
    opacity: 0.4;
    cursor: not-allowed;
  `}
`

type Props = {
    emoji: string
    size?: number
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const EmojiButton: React.FC<Props> = ({ emoji, size, ...props }) => (
    <Button {...props}>
        <EmojiIcon value={emoji} size={size} />
    </Button>
)

export default EmojiButton
