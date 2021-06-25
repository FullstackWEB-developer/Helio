import Card from '@components/card/card';
import {useTranslation} from 'react-i18next';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import Avatar from '@components/avatar/avatar';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectLiveAgentStatuses} from '@shared/store/app-user/appuser.selectors';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {LiveAgentStatusInfo, LiveAgentStatusItemInfo} from '@shared/models/live-agent-status-info.model';
import {getAgentsStatus, getUserList} from '@shared/services/lookups.service';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import './agent-status-table.scss';
import AgentLiveItem, {AgentLivItemType} from './agent-live-item';
import AgentStatusDuration from '@pages/dashboard/components/wallboard/agent-status-duration';
import SvgIcon, {Icon} from '@components/svg-icon';
import Dropdown from '@components/dropdown/dropdown';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import {Option} from '@components/option/option';
import customHooks from '@shared/hooks/customHooks';
import {useQuery} from 'react-query';
import {GetAgentStatus} from '@constants/react-query-constants';
import {AgentStatus} from '@shared/models/agent-status.model';
import {addLiveAgentStatus} from '@shared/store/app-user/appuser.slice';

const AgentStatusTable = () => {

    const {t} = useTranslation();
    const AllStatuses: Option = {
        value: 'show_all',
        label: t('wallboard.agent_status.show_all'),
        object: {
            value: 'show_all',
            label: t('wallboard.agent_status.show_all')
        }
    };
    const liveAgentStatuses = useSelector(selectLiveAgentStatuses);
    const users = useSelector(selectUserList);
    const dispatch = useDispatch();
    const [agentStatusDropdownOpen, setAgentStatusDropdownOpen] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<Option>(AllStatuses);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    customHooks.useOutsideClick([dropdownRef], () => {
        setAgentStatusDropdownOpen(!agentStatusDropdownOpen);
    });



    useQuery<AgentStatus[], Error>([GetAgentStatus], () => getAgentsStatus(), {
        onSuccess: (data: AgentStatus[]) => {
            data.forEach(item => {
               dispatch(addLiveAgentStatus({
                   status: item.latestConnectStatus,
                   userId: item.id,
                   activities: item.activities,
                   timestamp: item.timestamp
               }))
            });
        }
    });
    const prepareData = () => {
        if (!liveAgentStatuses || liveAgentStatuses.length === 0) {
            return [];
        }
        let data: LiveAgentStatusInfo[] = [];
        liveAgentStatuses.forEach(a => {
            const user = users.find(u => u.id === a.userId);
            if (selectedStatus.value === AllStatuses.value || selectedStatus.value === a.status) {
                if (user) {
                    data.push({
                        ...a,
                        profilePicture: user.profilePicture,
                        name: user.firstName + ' ' + user.lastName
                    });
                }
            }
        })
        return data;
    }

    const getAvatarAndName =(record: LiveAgentStatusInfo) => {
        return <div className='flex flex-row items-center space-x-4'>
            <Avatar userFullName={record.name!} status={record.status as UserStatus} userPicture={record.profilePicture} />
            <div className='body2'>{record.name}</div>
        </div>
    }

    const renderItems = (type: AgentLivItemType, items?: LiveAgentStatusItemInfo[]) => {
        if (!items) {
            return null;
        }
        return <div className='flex flex-row space-x-4'>
            {items.map((item) => <AgentLiveItem type={type} data={item} key={item.customerData} />)}
        </div>
    }

    let tableModel: TableModel = {
        hasRowsBottomBorder: true,
        headerClassName:'h-12',
        rowClass:'agent-status-table-row items-center',
        columns: [
            {
                title:t('wallboard.agent_status.agent_name'),
                field:'name',
                widthClass:'w-48 pl-2',
                render: (field, record: LiveAgentStatusInfo) => getAvatarAndName(record)
            },
            {
                title:t('wallboard.agent_status.status'),
                field:'status',
                widthClass:'w-48'
            },
            {
                title:t('wallboard.agent_status.duration'),
                field:'duration',
                widthClass:'w-48',
                render: (field, record: LiveAgentStatusInfo) => record.timestamp ? AgentStatusDuration({date: record.timestamp}) : null
            },
            {
                title:t('wallboard.agent_status.live_calls'),
                field:'liveCalls',
                widthClass:'w-56',
                render: (item, record: LiveAgentStatusInfo) => renderItems(AgentLivItemType.Call, record.calls)
            },
            {
                title:t('wallboard.agent_status.live_chats'),
                field:'liveChats',
                widthClass:'w-48',
                render: (item, record: LiveAgentStatusInfo) => renderItems(AgentLivItemType.Chat, record.chats)
            }
        ],
        rows: prepareData()
    };

    const getFilterStatuses = () : Option[] => {
        const statusOptions : Option[] = [];
        if (selectedStatus !== AllStatuses) {
            statusOptions.push(AllStatuses);
        }
        if (liveAgentStatuses && liveAgentStatuses.length > 0) {
            const statuses = new Set(liveAgentStatuses.filter(a => a.status !== selectedStatus.value).map(a => a.status));
            statuses.forEach(item => {
                statusOptions.push({
                    value: item,
                    label: item,
                    object: {
                        value: item,
                        label: item
                    }
                });
            })
        }

        return statusOptions;
    }

    const statusSelected = (status:string, item: DropdownItemModel) => {
        setSelectedStatus(item.object);
        setAgentStatusDropdownOpen(false);
    }

    const agentStatusDropdownModal: DropdownModel = {
        defaultValue: selectedStatus.value,
        onClick: (id, item) => statusSelected(id, item),
        items: getFilterStatuses()
    };

    const StatusDropdown = () => {
        return <div className='relative cursor-pointer'>
                    <div className='flex flex-row body2' onClick={() => setAgentStatusDropdownOpen(!agentStatusDropdownOpen)}>
                        <div>
                            {selectedStatus.label}
                        </div>
                        <div>
                            <SvgIcon type={agentStatusDropdownOpen ? Icon.ArrowUp : Icon.ArrowDown} className='icon-medium' fillClass='rgba-05-fill'/>
                        </div>
                    </div>
                    {agentStatusDropdownOpen &&
                    <div className='absolute right-0'  ref={dropdownRef}>
                        <Dropdown model={agentStatusDropdownModal}/>
                    </div>}
            </div>
    }

    return <Card title={t('wallboard.agent_status.title')} extra={<StatusDropdown/>}>
        <Table model={tableModel}/>
        <div className='bg-white h-8'/>
    </Card>
}

export default AgentStatusTable;
