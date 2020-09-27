import styled from 'styled-components'

import { primaryColor, googleBlue, googleBlueActive, white } from 'utils/style/colors'

export const Wrapper = styled('div')`
    align-items: center;
    background-color: ${primaryColor};
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    overflow: hidden;
`

export const LogoWrapper = styled('div')`
    margin-top: 4.5rem;
`

export const Logo = styled('img')`
    width: 180px;
`

export const Footer = styled('div')`
    align-items: center;
    align-self: center;
    display: flex;
    flex-direction: column;
    height: 7.5rem;
    padding-bottom: 1.5rem;
`

export const GoogleSignInBtn = styled('a')`
    background-color: ${googleBlue};
    border-radius: 2px;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
    height: 42px;
    width: 184px;
    div {
        background-color: ${white};
        border-radius: 2px;
        height: 40px;
        margin-left: 1px;
        margin-top: 1px;
        position: absolute;
        width: 40px;
        img {
            height: 18px;
            margin-left: 11px;
            margin-top: 11px;
            position: absolute;
            width: 18px;
        }
    }
    p {
        color: ${white};
        float: right;
        font-family: 'Roboto';
        font-size: 14px;
        letter-spacing: 0.2px;
        margin: 12px 11px 0 0;
    }
    &:hover {
        box-shadow: 0 0 6px ${googleBlue};
    }
    &:active {
        background: ${googleBlueActive};
    }
`
