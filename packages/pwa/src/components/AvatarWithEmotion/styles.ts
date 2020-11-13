import styled from 'styled-components'

import EmojiIcon from 'components/EmojiIcon'

export const Wrapper = styled('div')`
    position: relative;
`

export const Emoji = styled(EmojiIcon)`
    bottom: 0;
    position: absolute;
    right: 0;
`