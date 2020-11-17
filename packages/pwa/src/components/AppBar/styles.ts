import styled from 'styled-components'

import { white } from 'utils/style/colors'

interface WrapperProps {
    heightInRem: number
}

export const Wrapper = styled('div')<WrapperProps>`
    align-items: center;
    border-bottom: 2px solid #f2464696;
    display: flex;
    flex-direction: row;
    height: ${(props) => `${props.heightInRem}rem`};
    justify-content: space-between;
    padding: 0px 1rem;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    z-index: 999;
    background-color: ${white};
`

export const Title = styled('h1')`
    flex: auto;
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0;
    text-align: center;
`
