import styled from 'styled-components'

import { appBarHeightInRem } from 'utils/style/fixedSizes'

export const Content = styled('div')`
    padding-top: ${appBarHeightInRem}rem;
`

export const Logo = styled('img').attrs({
    alt: 'my-emotion',
    src: '/static/assets/svg/logo_face_red.svg',
})`
    width: 2.7rem;
`
