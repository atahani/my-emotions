import React, { useCallback, useEffect, useState } from 'react'

import { EmotionView } from '@my-emotions/types'

import { apolloClient } from 'utils/graphql/client'
import { NEW_EMOTION } from 'utils/graphql/gql'

import { Wrapper, Content, EyesIcon } from './styles'

const NewEmotionIndicator: React.FC = () => {
    const [newEmotions, setNewEmotions] = useState<EmotionView[]>([])

    useEffect(() => {
        const newEmotion = apolloClient
            .subscribe<{ newEmotion: EmotionView }>({
                query: NEW_EMOTION,
            })
            .subscribe({
                next: ({ data }) => {
                    if (data) {
                        setNewEmotions((list) => [data.newEmotion, ...list])
                    }
                },
            })
        return () => {
            newEmotion.unsubscribe()
        }
    }, [])

    const handleLoadNewEmotions = useCallback(() => {
        apolloClient.cache.modify({
            fields: {
                emotions(existing) {
                    return {
                        ...existing,
                        items: [...newEmotions, ...existing.items],
                    }
                },
            },
        })
        setNewEmotions([])
    }, [newEmotions, setNewEmotions])

    return (
        <Wrapper>
            {newEmotions.length > 0 && (
                <Content onClick={handleLoadNewEmotions}>
                    {newEmotions.length} New Emotion
                    <EyesIcon />
                </Content>
            )}
        </Wrapper>
    )
}

export default NewEmotionIndicator
