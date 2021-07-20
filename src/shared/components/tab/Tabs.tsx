import React, {ReactElement, useState} from 'react'
import withErrorLogging from '../../HOC/with-error-logging';
import TabTitle from './TabTitle';
import classnames from 'classnames';

type TabsProps = {
    children: ReactElement[];
    title?: string;
    titleClass?: string;
    asCard?: boolean;
    hasBorder?: boolean;
    onSelect?: (selectedTabIndex: number) => void;
}

const Tabs: React.FC<TabsProps> = ({onSelect, children, title, titleClass='', asCard= false, hasBorder= true}) => {
    const [selectedTab, setSelectedTab] = useState(0)

    const tabSelected = (index: number) => {
        setSelectedTab(index);
        if (onSelect) {
            onSelect(index);
        }
    }

    const calculatedTitleClass = classnames('pb-1 pr-8 md:pr-32 pl-1 h7', {
        'h-14 pt-5': asCard,
        'pt-2.5': !asCard
    }, titleClass);

    const wrapperClass = classnames('flex flex-row ', {
        'border-b': hasBorder
    });
    return (
        <div>
            <div className={wrapperClass}>
                {title && <div className={calculatedTitleClass}>{title}</div>}
                {children.map((item, index) => (
                    <TabTitle
                        key={index}
                        asCard={asCard}
                        title={item.props.title}
                        index={index}
                        isSelected={selectedTab === index}
                        setSelectedTab={tabSelected}
                    />
                ))}
            </div>
            {children[selectedTab]}
        </div>
    )
}

export default withErrorLogging(Tabs);
