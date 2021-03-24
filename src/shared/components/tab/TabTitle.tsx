import React, { useCallback } from 'react'
import withErrorLogging from '../../HOC/with-error-logging';
import './tab-title.scss';

type TabTitleProps = {
    title: string;
    index: number;
    setSelectedTab: (index: number) => void;
    isSelected: boolean;
}

const TabTitle: React.FC<TabTitleProps> = ({ title, setSelectedTab, isSelected, index }) => {

    const onClick = useCallback(() => {
        setSelectedTab(index)
    }, [setSelectedTab, index]);

    const sharedClass = 'tab-title px-7 pt-2.5 pb-3 cursor-pointer';

    return (
        <div onClick={onClick} className={sharedClass + (isSelected ? ' border-b-2 border-primary subtitle2' : ' body2')}>
            {title}
        </div>
    )
}

export default withErrorLogging(TabTitle)
