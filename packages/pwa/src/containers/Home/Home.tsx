import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback } from 'react'

import { EmotionView, PaginatedResponse } from '@my-emotions/types'

import { GET_EMOTIONS } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'

import AppBar from 'components/AppBar'
import EmojiButton from 'components/EmojiButton'
import Emotion from 'components/Emotion'
import Loader from 'components/Loader'

import { Logo, Content } from './styles'

const Home: React.FC = () => {
    const { data, loading, fetchMore } = useQuery<
        { emotions: PaginatedResponse<EmotionView> },
        { page?: number; itemPerPage?: number }
    >(GET_EMOTIONS, {
        variables: { itemPerPage: 20 },
        onError: handleCommonErr,
    })
    const handleOnFetchMore = useCallback(() => {
        fetchMore({
            variables: {
                page: (data?.emotions.page || 1) + 1,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult || fetchMoreResult.emotions.items.length === 0) {
                    return prev
                }
                return Object.assign({}, prev, {
                    emotions: {
                        ...fetchMoreResult.emotions,
                        items: [...prev.emotions.items, ...fetchMoreResult.emotions.items],
                    },
                })
            },
        })
    }, [fetchMore, data])
    return (
        <>
            <AppBar
                leftNode={<Logo src="/static/assets/svg/logo_face_red.svg" alt="my-emotion" />}
                rightNode={
                    <Link to="/release-emotion">
                        <EmojiButton emoji="🆕" size={28} />
                    </Link>
                }
            />
            <Content>
                {data && data.emotions && (
                    <InfiniteScroll
                        dataLength={data.emotions.items.length}
                        next={handleOnFetchMore}
                        hasMore={data.emotions.page < data.emotions.totalPage}
                        loader={<Loader />}
                    >
                        {data.emotions.items.map((emotion) => (
                            <Emotion key={emotion.id} data={emotion} />
                        ))}
                    </InfiniteScroll>
                )}
                {loading && <Loader />}
            </Content>
        </>
    )
}

export default Home
