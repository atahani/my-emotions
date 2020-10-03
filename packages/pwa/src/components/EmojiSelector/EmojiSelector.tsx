import 'emoji-mart/css/emoji-mart.css'
import { BaseEmoji, NimblePicker } from 'emoji-mart'
import data from 'emoji-mart/data/twitter.json'
import React, { useCallback, useState } from 'react'

import EmojiButton from 'components/EmojiButton'

import { Wrapper, SelectedEmoji } from './styles'

type Props = {
    value: string
    onChange: (value: string) => void
}

const EmojiSelector: React.FC<Props> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const onClick = useCallback(() => {
        setIsOpen((open) => !open)
    }, [setIsOpen])
    const onSelectEmoji = useCallback(
        (emoji: BaseEmoji) => {
            onChange(emoji.native)
            setIsOpen(false)
        },
        [setIsOpen, onChange],
    )
    return (
        <Wrapper>
            <SelectedEmoji>
                <EmojiButton emoji={value} size={128} onClick={onClick} />
            </SelectedEmoji>
            {isOpen && (
                <NimblePicker
                    set="twitter"
                    sheetSize={32}
                    perLine={8}
                    exclude={['flags']}
                    data={data as any}
                    title="Your Feeling ..."
                    emoji="point_up"
                    onSelect={onSelectEmoji}
                    autoFocus
                />
            )}
        </Wrapper>
    )
}

export default EmojiSelector
