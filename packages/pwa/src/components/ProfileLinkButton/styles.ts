import styled from 'styled-components'

import { primaryColor } from 'utils/style/colors'

import EmojiIcon from 'components/EmojiIcon'

export const Image = styled('img')`
    border-radius: 100%;
    border: 2px solid ${primaryColor};
    height: 2.25rem;
    width: 2.25rem;
`

export const ProfileEmoji = styled(EmojiIcon).attrs({
    size: 36,
    value: '🙂',
})`
    border-radius: 100%;
`
