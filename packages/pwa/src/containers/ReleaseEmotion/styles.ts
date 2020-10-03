import styled from 'styled-components'

import { primaryColor, white } from 'utils/style/colors'

export const Wrapper = styled('div')`
    height: 100%;
`

export const Header = styled('div')`
    align-items: center;
    border-bottom: 2px solid #f2464696;
    display: flex;
    flex-direction: row;
    height: 4rem;
    justify-content: space-between;
    padding: 0px 1rem;
`

export const Title = styled('h1')`
    flex: auto;
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0;
    text-align: center;
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
    padding: 1rem 0.5rem;
`

export const Form = styled('form')`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export const NewEmotionTXT = styled('textarea')`
    border: none;
    font-size: 19px;
    height: 8.5rem;
    outline: none;
    padding: 0.8rem;
    resize: none;
    width: 100%;
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
