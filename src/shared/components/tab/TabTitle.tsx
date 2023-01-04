import React, {useCallback} from 'react'
import withErrorLogging from '../../HOC/with-error-logging';
import './tab-title.scss';
import classnames from 'classnames';
import TooltipWrapper from '@components/tooltip/tooltip-wrapper';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import { Icon } from '@components/svg-icon/icon';
import { tooltip } from 'leaflet';

type TabTitleProps = {
    title: string | React.ReactNode;
    index: number;
    setSelectedTab: (index: number) => void;
    isSelected: boolean;
    asCard: boolean;
    tooltipContent?: string;
}

const TabTitle: React.FC<TabTitleProps> = ({ title, setSelectedTab, isSelected, index, asCard, tooltipContent }) => {

    const onClick = useCallback(() => {
        setSelectedTab(index)
    }, [setSelectedTab, index]);

    const calculatedClass = classnames('tab-title px-7 pb-2 cursor-pointer', {
        'pt-6': asCard,
        'pt-2': !asCard,
        'border-b-2 border-primary subtitle2': isSelected,
        'body2': !isSelected,
        'flex items-center': tooltipContent
    });

    return (
        <div onClick={onClick} className={calculatedClass}>
            {title}
            {tooltipContent && <ToolTipIcon
                icon={Icon.Info}
                iconFillClass='warning-icon'
                placement='top-start'
                className='pl-1'
                iconClassName='icon-medium'
            >
                <div className='flex flex-col p-3'>
                    <span className='whitespace-pre-wrap body2'>{tooltipContent}</span>
                </div>
            </ToolTipIcon>}
        </div>
    )
}

export default withErrorLogging(TabTitle)
