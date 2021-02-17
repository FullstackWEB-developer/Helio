import React, {ReactElement, useState} from "react"
import withErrorLogging from "../../HOC/with-error-logging";
import TabTitle from "./TabTitle";

type TabsProps = {
    children: ReactElement[],
    title?: string
}

const Tabs: React.FC<TabsProps> = ({ children , title}) => {
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <div>
            <div className={"flex flex-row border-b"}>
                {title && <div className={"p-1 pr-32 font-bold text-xl"}>{title}</div>}
                {children.map((item, index) => (
                    <TabTitle
                        key={index}
                        title={item.props.title}
                        index={index}
                        isSelected={selectedTab === index}
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </div>
            {children[selectedTab]}
        </div>
    )
}

export default withErrorLogging(Tabs);