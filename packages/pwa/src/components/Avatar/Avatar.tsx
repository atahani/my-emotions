import React, { useCallback, useState } from 'react'

import { Image, FaceEmoji } from './styles'

type Props = {
    name?: string
    size?: number
    url?: string | undefined
    border?: boolean
}

const Avatar: React.FC<Props> = ({ url, name = 'user', size = 60, border = false }) => {
    const [errorOnImageLoad, setErrorOnImageLoad] = useState<boolean>(false)
    const handleImgError = useCallback(() => {
        setErrorOnImageLoad(true)
    }, [setErrorOnImageLoad])

    if (url && !errorOnImageLoad) {
        return <Image border={border} size={size} src={url} alt={`${name} Profile`} onError={handleImgError} />
    }
    return <FaceEmoji size={size} />
}

export default Avatar
