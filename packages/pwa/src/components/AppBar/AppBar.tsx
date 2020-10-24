import { useHistory } from 'react-router-dom'
import React, { useCallback } from 'react'

import EmojiButton from 'components/EmojiButton'

import { Wrapper, Title } from './styles'

type Props = {
    backButton?: boolean
    backURL?: string
    leftNode?: React.ReactNode
    rightNode?: React.ReactNode
    title?: string
    titleNode?: React.ReactNode
}

const AppBar: React.FC<Props> = ({ backURL, backButton = false, leftNode, title, rightNode, titleNode }) => {
    const { replace, goBack } = useHistory()
    const onBackClick = useCallback(() => {
        if (backURL) {
            replace(backURL)
        } else {
            goBack()
        }
    }, [backURL, goBack, replace])

    return (
        <Wrapper>
            {(backURL || backButton) && <EmojiButton emoji="👈" size={28} onClick={onBackClick} />}
            {leftNode}
            {title && <Title>{title}</Title>}
            {titleNode && <Title>{titleNode}</Title>}
            {rightNode}
        </Wrapper>
    )
}

export default AppBar
