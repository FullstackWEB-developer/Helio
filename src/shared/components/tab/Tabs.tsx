import React, {ReactElement, useState} from 'react'
import withErrorLogging from '../../HOC/with-error-logging';
import TabTitle from './TabTitle';

type TabsProps = {
    children: ReactElement[],
    title?: string,
    onSelect?: (selectedTabIndex: number) => void;
}

const Tabs: React.FC<TabsProps> = ({onSelect, children, title}) => {
    const [selectedTab, setSelectedTab] = useState(0)

    const tabSelected = (index: number) => {
        setSelectedTab(index);
        if (onSelect) {
            onSelect(index);
        }
    }

    return (
        <div>
            <div className={'flex flex-row border-b'}>
                {title && <div className={'pt-2.5 pb-1 pr-32 pl-1 h7'}>{title}</div>}
                {children.map((item, index) => (
                    <TabTitle
                        key={index}
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
