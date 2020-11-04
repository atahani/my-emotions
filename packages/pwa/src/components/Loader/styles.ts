import styled from 'styled-components'

import { rotate } from 'utils/style/keyframes'

import EmojiIcon from 'components/EmojiIcon'

export const Wrapper = styled('div')`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.8rem;
`

export const RotatingEmoji = styled(EmojiIcon)`
    animation: ${rotate} 0.65s linear infinite;
    display: inline-block;
`
