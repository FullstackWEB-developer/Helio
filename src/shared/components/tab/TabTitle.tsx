import React, {useCallback} from 'react'
import withErrorLogging from '../../HOC/with-error-logging';

type TabTitleProps = {
    title: string;
    index: number;
    setSelectedTab: (index: number) => void;
    isSelected: boolean;
}

const TabTitle: React.FC<TabTitleProps> = ({ title, setSelectedTab, isSelected, index }) => {

    const onClick = useCallback(() => {
        setSelectedTab(index)
    }, [setSelectedTab, index])

    return (
        <div onClick={onClick} className={"px-7 pt-2.5 pb-3 cursor-pointer" + (isSelected ? ' border-b-2 border-primary ' : '')}>{title}</div>
    )
}

export default withErrorLogging(TabTitle)