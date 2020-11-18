import { toast } from 'react-toastify'
import { useMutation, Reference } from '@apollo/react-hooks'
import React, { useCallback } from 'react'

import { ActionStatus, EmotionView } from '@my-emotions/types'

import { FORGOT_EMOTION } from 'utils/graphql/gql'
import { getUserProfile } from 'utils/persistData'
import { handleCommonErr } from 'utils/graphql/handleError'

import AvatarWithEmotion from 'components/AvatarWithEmotion'
import EmojiButton from 'components/EmojiButton'

import { Wrapper, Content, Header, Text, DisplayName } from './styles'

type Props = {
    data: EmotionView
}

const Emotion: React.FC<Props> = ({ data }) => {
    const loggedInProfile = getUserProfile()
    const [forgotEmotion] = useMutation<{ forgotEmotion: ActionStatus }, { id: string }>(FORGOT_EMOTION, {
        onCompleted: ({ forgotEmotion }) => {
            toast.success(forgotEmotion.message)
        },
        onError: handleCommonErr,
        update: (cache) => {
            cache.modify({
                fields: {
                    emotions(existing, { readField }) {
                        return {
                            ...existing,
                            items: existing.items.filter((eRef: Reference) => data.id !== readField('id', eRef)),
                        }
                    },
                },
            })
        },
    })

    const handleDelete = useCallback(() => {
        forgotEmotion({ variables: { id: data.id } })
    }, [data.id, forgotEmotion])

    return (
        <Wrapper>
            <AvatarWithEmotion
                url={data.userBriefProfileView.imageURL}
                name={data.userBriefProfileView.displayName}
                emoji={data.emoji}
            />
            <Content>
                <Header>
                    <DisplayName to={`/users/${data.userBriefProfileView.id}`}>
                        {data.userBriefProfileView.displayName}
                    </DisplayName>
                </Header>
                <Text>{data.text}</Text>
            </Content>
            {loggedInProfile && loggedInProfile.id === data.userBriefProfileView.id && (
                <EmojiButton emoji="🙅‍♂️" onClick={handleDelete} />
            )}
        </Wrapper>
    )
}

export default Emotion
