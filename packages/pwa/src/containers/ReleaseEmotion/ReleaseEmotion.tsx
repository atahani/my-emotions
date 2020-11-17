import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { EmotionView, ReleaseEmotionInput } from '@my-emotions/types'

import AppBar from 'components/AppBar'
import EmojiButton from 'components/EmojiButton'
import EmojiIcon from 'components/EmojiIcon'
import EmojiSelector from 'components/EmojiSelector'

import { handleCommonErr } from 'utils/graphql/handleError'
import { RELEASE_EMOTION } from 'utils/graphql/gql'
import { stripEmoji } from 'utils/parser'

import { Wrapper, Content, Form, NewEmotionTXT, UnreleasedTitleWrapper, FullWidthSubmit } from './styles'

const ReleaseEmotion = () => {
    const { replace } = useHistory()
    const [step, setStep] = useState<number>(1)
    const [emotion, setEmotion] = useState<ReleaseEmotionInput>({ emoji: '🙂', text: '' })
    const [releaseEmotion, { loading }] = useMutation<{ releaseEmotion: EmotionView }, { data: ReleaseEmotionInput }>(
        RELEASE_EMOTION,
        {
            onCompleted: (data) => {
                if (data) {
                    replace('/')
                }
            },
            onError: handleCommonErr,
            update: (cache, { data }) => {
                if (data) {
                    cache.modify({
                        fields: {
                            emotions(existing) {
                                return {
                                    ...existing,
                                    items: [data?.releaseEmotion, ...existing.items],
                                }
                            },
                        },
                    })
                }
            },
        },
    )

    const newEmotionTXTRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
        if (newEmotionTXTRef.current) {
            newEmotionTXTRef.current.focus()
        }
    }, [newEmotionTXTRef])

    const onBackClick = useCallback(() => {
        if (step === 1) {
            replace('/')
        }
        setStep(1)
    }, [setStep, replace, step])

    const onEmojiChange = useCallback(
        (value: string) => {
            setEmotion((data) => ({ ...data, emoji: value }))
        },
        [setEmotion],
    )

    const onTextAreaChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const text = stripEmoji(e.target.value || '')
            if (text.length <= 140) {
                setEmotion({ emoji: emotion.emoji, text })
            }
        },
        [setEmotion, emotion.emoji],
    )

    const onNextStep = useCallback(() => {
        setStep(2)
    }, [setStep])

    const onReleaseEmotion = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            releaseEmotion({
                variables: { data: emotion },
            })
        },
        [releaseEmotion, emotion],
    )

    return (
        <Wrapper>
            <AppBar
                leftNode={<EmojiButton emoji="👈" size={28} onClick={onBackClick} />}
                title={step === 1 ? 'Your Emoji?' : undefined}
                titleNode={
                    step === 2 && (
                        <UnreleasedTitleWrapper>
                            <span>Unreleased Emotion</span>
                            <EmojiIcon value={emotion.emoji} size={28} />
                        </UnreleasedTitleWrapper>
                    )
                }
                rightNode={
                    step === 1 ? (
                        <EmojiButton emoji="▶️" size={28} onClick={onNextStep} />
                    ) : (
                        <EmojiButton
                            emoji="✔️"
                            size={28}
                            disabled={emotion.text.length === 0 || loading}
                            onClick={onReleaseEmotion}
                        />
                    )
                }
            />
            <Content>
                {step === 1 && <EmojiSelector value={emotion.emoji} onChange={onEmojiChange} />}
                {step === 2 && (
                    <Form>
                        <NewEmotionTXT
                            ref={newEmotionTXTRef}
                            value={emotion.text}
                            onChange={onTextAreaChange}
                            dir="auto"
                        />
                        <FullWidthSubmit onClick={onReleaseEmotion} disabled={emotion.text.length === 0 || loading}>
                            RELEASE IT
                            <EmojiIcon value={emotion.emoji} size={22} />
                        </FullWidthSubmit>
                    </Form>
                )}
            </Content>
        </Wrapper>
    )
}

export default ReleaseEmotion
