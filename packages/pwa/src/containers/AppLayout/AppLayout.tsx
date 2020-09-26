import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const AppLayout: React.FC<Props> = ({ children }) => (
    <>
        <h2>App Layout</h2>
        {children}
    </>
)

export default AppLayout
