import EmojiIcon from 'components/EmojiIcon'
import styled from 'styled-components'
import { primaryColor } from 'utils/style/colors'

import { appBarHeightInRem } from 'utils/style/fixedSizes'

export const Wrapper = styled('div')`
    align-items: center;
    display: flex;
    justify-content: center;
`

export const Content = styled('button')`
    align-items: center;
    background: ${primaryColor};
    border-radius: 15px;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    font-size: 0.9rem;
    font-weight: 800;
    padding: 0.7rem;
    position: fixed;
    top: ${appBarHeightInRem + 0.5}rem;
    z-index: 999;
    &:focus {
        outline: 0;
    }
`

export const EyesIcon = styled(EmojiIcon).attrs({
    value: '👀',
    size: 20,
})`
    margin-left: 0.5rem;
`
