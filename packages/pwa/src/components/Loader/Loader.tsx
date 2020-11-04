import React from 'react'

import { Wrapper, RotatingEmoji } from './styles'

const Loader: React.FC = () => (
    <Wrapper>
        <RotatingEmoji value="🕡" size={36} />
    </Wrapper>
)

export default Loader
