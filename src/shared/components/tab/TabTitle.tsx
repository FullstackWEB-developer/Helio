import React, {useCallback} from 'react'
import withErrorLogging from '../../HOC/with-error-logging';
import './tab-title.scss';
import classnames from 'classnames';

type TabTitleProps = {
    title: string | React.ReactNode;
    index: number;
    setSelectedTab: (index: number) => void;
    isSelected: boolean;
    asCard: boolean;
}

const TabTitle: React.FC<TabTitleProps> = ({ title, setSelectedTab, isSelected, index, asCard }) => {

    const onClick = useCallback(() => {
        setSelectedTab(index)
    }, [setSelectedTab, index]);

    const calculatedClass = classnames('tab-title px-7 pb-2 cursor-pointer', {
        'pt-6': asCard,
        'pt-2': !asCard,
        'border-b-2 border-primary subtitle2': isSelected,
        'body2': !isSelected,
    });

    return (
        <div onClick={onClick} className={calculatedClass}>
            {title}
        </div>
    )
}

export default withErrorLogging(TabTitle)
