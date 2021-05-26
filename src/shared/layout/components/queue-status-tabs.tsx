import Tab from "@components/tab/Tab";
import Tabs from "@components/tab/Tabs";
import {useTranslation} from 'react-i18next';
import QueueStatus from "@shared/layout/components/queue-status";
import React from "react";
import {QueueStatusType} from "@shared/layout/enums/queue-status-type";


const QueueStatusTabs = () => {

    const {t: translate} = useTranslation();

    return (
        <div className='flex-auto'>
            <div className='px-4 py-3 '>
                <h2 className='subtitle'>
                    {translate('statuses.queuestatus.queueus_status')}
                </h2>
            </div>
            <Tabs>
                <Tab title={translate('statuses.queuestatus.all_queues')}><QueueStatus
                    queueType={QueueStatusType.AllQueues}/></Tab>
                <Tab title={translate('statuses.queuestatus.my_queues')}><QueueStatus
                    queueType={QueueStatusType.MyQueues}/></Tab>
            </Tabs>
        </div>
    );
};

export default QueueStatusTabs;
