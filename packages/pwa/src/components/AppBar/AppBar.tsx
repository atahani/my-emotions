import { useHistory } from 'react-router-dom'
import React, { useCallback } from 'react'

import EmojiButton from 'components/EmojiButton'

import { appBarHeightInRem } from 'utils/style/fixedSizes'

import { Wrapper, Title } from './styles'

type Props = {
    backButton?: boolean
    backURL?: string
    leftNode?: React.ReactNode
    rightNode?: React.ReactNode
    title?: string
    titleNode?: React.ReactNode
    heightInRem?: number
}

const AppBar: React.FC<Props> = ({
    backURL,
    backButton = false,
    leftNode,
    title,
    rightNode,
    titleNode,
    heightInRem = appBarHeightInRem,
}) => {
    const { replace, goBack } = useHistory()
    const onBackClick = useCallback(() => {
        if (backURL) {
            replace(backURL)
        } else {
            goBack()
        }
    }, [backURL, goBack, replace])

    return (
        <Wrapper heightInRem={heightInRem}>
            {(backURL || backButton) && <EmojiButton emoji="👈" size={28} onClick={onBackClick} />}
            {leftNode}
            {title && <Title>{title}</Title>}
            {titleNode && <Title>{titleNode}</Title>}
            {rightNode}
        </Wrapper>
    )
}

export default AppBar
