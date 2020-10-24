import styled from 'styled-components'

import { appBarHeightInRem } from 'utils/style/fixedSizes'

export const List = styled('div')`
    display: flex;
    flex-direction: column;
    padding-top: ${appBarHeightInRem}rem;
`

export const Logo = styled('img')`
    width: 2.7rem;
`
