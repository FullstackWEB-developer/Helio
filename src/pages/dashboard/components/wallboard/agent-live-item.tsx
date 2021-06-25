import {LiveAgentStatusItemInfo} from '@shared/models/live-agent-status-info.model';
import './agent-live-item.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import classnames from 'classnames';
import utils from '@shared/utils/utils';

export enum AgentLivItemType {
    Chat =1,
    Call
}

export interface AgentLiveItemProps {
    data: LiveAgentStatusItemInfo,
    type: AgentLivItemType;
}

const AgentLiveItem = ({data, type} : AgentLiveItemProps) => {
    dayjs.extend(duration);
    const [secondsPassed, setSecondsPassed] = useState<number>(0)

    useEffect(() => {
        let isMounted = true;
        setTimeout(() => {
            if (isMounted) {
                setSecondsPassed(dayjs(new Date()).diff(dayjs(data.timestamp), 'second'));
            }
        }, 1000);

        return () => {
            isMounted = false;
        };
    }, [secondsPassed, data.timestamp]);

    const iconBackgroundClassName = classnames('flex justify-center items-center h-12 w-12 rounded-l-md', {
        'agent-live-call-icon-background': type === AgentLivItemType.Call,
        'agent-live-chat-icon-background': type === AgentLivItemType.Chat
    });

    return <div className='flex flex-row'>
        <div className={iconBackgroundClassName}>
            <SvgIcon fillClass='white-icon' type={type === AgentLivItemType.Call ? Icon.Phone : Icon.Chat}/>
        </div>
        <div className='flex flex-col pl-2 pt-2 agent-live-text-background rounded-r-md'>
            <div className='subtitle3'>{type === AgentLivItemType.Call ? utils.formatPhone(data.customerData) : data.customerData}</div>
            <div className='caption-caps'>{dayjs.duration(secondsPassed, 'seconds').format('m:ss')}</div>
        </div>
    </div>
}

export default AgentLiveItem;
