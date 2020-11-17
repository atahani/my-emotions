import styled from 'styled-components'

import { profileAppBarHeightInRem } from 'utils/style/fixedSizes'

export const UserInfo = styled('div')`
    align-items: center;
    display: flex;
    justify-content: center;
`

export const DisplayName = styled('div')`
    font-size: 1.2rem;
    font-weight: 600;
    margin-left: 0.8rem;
`

export const Content = styled('div')`
    padding-top: ${profileAppBarHeightInRem}rem;
`
