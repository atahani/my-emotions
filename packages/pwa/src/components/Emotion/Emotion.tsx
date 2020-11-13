import React from 'react'

import { EmotionView } from '@my-emotions/types'

import AvatarWithEmotion from 'components/AvatarWithEmotion'

import { Wrapper, Content, Header, Text, DisplayName } from './styles'

type Props = {
    data: EmotionView
}

const Emotion: React.FC<Props> = ({ data }) => {
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
        </Wrapper>
    )
}

export default Emotion
