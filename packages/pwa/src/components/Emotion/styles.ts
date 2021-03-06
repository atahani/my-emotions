import styled from 'styled-components'

import { Link } from 'react-router-dom'

export const Wrapper = styled('div')`
    align-items: center;
    box-shadow: inset 0 -1px 0 0 #00000038;
    display: flex;
    height: 6.25rem;
    justify-content: start;
    padding: 0 1rem;
`

export const Content = styled('div')`
    display: flex;
    flex: 1 auto;
    flex-direction: column;
    font-size: 0.94rem;
    height: 100%;
    margin-left: 0.8rem;
    min-height: 100%;
`

export const Header = styled('div')`
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
    margin-top: 0.7rem;
    time {
        color: #0e0e0e;
        font-size: 0.85rem;
        font-weight: 400;
        margin-left: 0.8rem;
    }
`

export const DisplayName = styled(Link)`
    color: inherit;
    font-weight: 700;
    text-decoration: none;
    text-decoration: none;
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`

export const Text = styled('div')`
    flex: 1;
    font-weight: 400;
`
