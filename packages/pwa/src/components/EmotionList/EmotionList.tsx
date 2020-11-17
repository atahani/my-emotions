import { useLazyQuery } from '@apollo/react-hooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect } from 'react'

import { EmotionView, PaginatedResponse } from '@my-emotions/types'

import { GET_EMOTIONS } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'

import Emotion from 'components/Emotion'
import Loader from 'components/Loader'

type Props = {
    userId?: string
    itemPerPage?: number
}

const EmotionList: React.FC<Props> = ({ userId, itemPerPage = 20 }) => {
    const [getEmotions, { data, loading, fetchMore }] = useLazyQuery<
        { emotions: PaginatedResponse<EmotionView> },
        { page?: number; itemPerPage?: number; userId?: string }
    >(GET_EMOTIONS, {
        variables: { itemPerPage, userId },
        onError: handleCommonErr,
    })

    useEffect(() => {
        getEmotions()
    }, [getEmotions])

    const handleOnFetchMore = useCallback(() => {
        if (fetchMore) {
            fetchMore({
                variables: {
                    page: (data?.emotions.page || 1) + 1,
                },
            })
        }
    }, [fetchMore, data])

    return (
        <>
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
        </>
    )
}

export default EmotionList
