import styled from 'styled-components'

import EmojiIcon from 'components/EmojiIcon'

export const Wrapper = styled('div')`
    position: relative;
`

export const Image = styled('img')`
    border-radius: 100%;
    height: 3.75rem;
    width: 3.75rem;
`

export const Emoji = styled(EmojiIcon)`
    bottom: 0;
    position: absolute;
    right: 0;
`
