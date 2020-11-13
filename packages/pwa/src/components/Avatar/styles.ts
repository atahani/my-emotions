import styled from 'styled-components'

import { primaryColor } from 'utils/style/colors'

import EmojiIcon from 'components/EmojiIcon'

interface ImageCustomProps {
    size: number
    border: boolean
}

export const Image = styled('img')<ImageCustomProps>`
    border-radius: 100%;
    height: ${(props) => `${props.size}px`};
    width: ${(props) => `${props.size}px`};
    ${(props) => props.border && `border: 2px solid ${primaryColor};`}
`

export const FaceEmoji = styled(EmojiIcon).attrs({
    value: '🙂',
})`
    border-radius: 100%;
`
