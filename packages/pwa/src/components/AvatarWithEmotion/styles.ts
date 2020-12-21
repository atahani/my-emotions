import { Link } from 'react-router-dom'
import styled from 'styled-components'

import EmojiIcon from 'components/EmojiIcon'

export const ProfileLink = styled(Link)`
    position: relative;
`

export const Emoji = styled(EmojiIcon)`
    bottom: 0;
    position: absolute;
    right: 0;
`
