import styled from 'styled-components'

import { appBarHeightInRem } from 'utils/style/fixedSizes'
import { primaryColor, white } from 'utils/style/colors'

export const Wrapper = styled('div')`
    height: 100%;
`

export const UnreleasedTitleWrapper = styled('div')`
    align-items: center;
    display: flex;
    justify-content: center;
    img {
        margin-left: 0.4rem;
    }
`

export const Content = styled('div')`
    display: flex;
    justify-content: center;
    padding-top: ${appBarHeightInRem + 1}rem;
`

export const Form = styled('form')`
    display: flex;
    flex-direction: column;
    padding: 0 0.8rem;
    width: 100%;
`

export const NewEmotionTXT = styled('textarea')`
    border: none;
    font-size: 19px;
    height: 8.5rem;
    outline: none;
    padding: 0.8rem;
    resize: none;
`

export const FullWidthSubmit = styled('button')`
    align-items: center;
    background-color: ${white};
    border: 2px solid ${primaryColor};
    box-shadow: none;
    color: ${primaryColor};
    display: flex;
    font-weight: 800;
    height: 2.45rem;
    justify-content: center;
    width: 100%;
    ${(props) =>
        props.disabled
            ? `
    opacity: 0.5;
    cursor: not-allowed;
    `
            : `
    cursor: pointer;
  `};
    &:focus {
        outline: none;
    }
    img {
        margin-left: 0.5rem;
    }
`
