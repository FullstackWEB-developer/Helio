import React from 'react'
import withErrorLogging from '../../HOC/with-error-logging';

type TabProps = {
    title: string | React.ReactNode,
    tooltipContent?: string,
    children: React.ReactNode
}

const Tab: React.FC<TabProps> = ({ children }) => {
    return <div>{children}</div>
}

export default withErrorLogging(Tab);
