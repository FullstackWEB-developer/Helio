import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from 'react-query';
import {GetAgentStatus, GetDashboard} from '@constants/react-query-constants';
import {
    getAgentsStatus,
    getDashboardData,
    getEnumByType,
    getLookupValues
} from '@pages/tickets/services/tickets.service';
import {useTranslation} from 'react-i18next';
import './dashboard.scss';
import {DropdownModel} from '@components/dropdown/dropdown.models';
import Dropdown from '@components/dropdown/dropdown';
import customHooks from '@shared/hooks/customHooks';
import {DashboardTypes} from '@pages/dashboard/enums/dashboard-type.enum';
import {DashboardTimeframes} from '@pages/dashboard/enums/dashboard.timeframes';
import CountdownTimer from '@pages/dashboard/components/countdown-timer';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import DashboardDateForm from './components/dashboard-date-form';
import DashboardContent from '@pages/dashboard/dashboard-content';
import Wallboard from '@pages/dashboard/wallboard';
import * as queryString from 'querystring';
import {useHistory} from 'react-router-dom';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {DashboardResponse} from '@pages/dashboard/models/dashboard-response';
import {AgentStatus} from '@shared/models';
import {addLiveAgentStatus} from '@shared/store/app-user/appuser.slice';
import {useDispatch} from 'react-redux';
import {getLocations} from '@shared/services/lookups.service';

export const Dashboard = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const isDefaultTeam = useCheckPermission('Dashboard.DefaultToTeamView');
    const [selectedDashboardType, setSelectedDashboardType] = useState<DashboardTypes>(!isDefaultTeam ? DashboardTypes.my : DashboardTypes.team);
    const [selectedDashboardTime, setSelectedDashboardTime] = useState<number>(DashboardTimeframes.week);
    const [displayTimeFrameDropdown, setDisplayTimeFrameDropdown] = useState<boolean>(false);
    const [displayTypeDropdown, setDisplayTypeDropdown] = useState<boolean>(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const timeframeDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
    const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
    const isWallboard: boolean = selectedDashboardType === DashboardTypes.wallboard;
    const dispatch = useDispatch();

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

    useEffect(() => {
        dispatch(getLocations());
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketType'));
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketReason'));
        dispatch(getLookupValues('TicketTags'));
    }, []);

    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayTypeDropdown(false);
    });

    customHooks.useOutsideClick([timeframeDropdownRef], () => {
        setDisplayTimeFrameDropdown(false);
    });
    
    useEffect(() => {
        setSelectedDashboardType(!isDefaultTeam ? DashboardTypes.my : DashboardTypes.team)
    }, [isDefaultTeam]);

    useEffect(() => {
        let params = new URLSearchParams(history.location.search);
        if (params.get('type')) {
            const type = Number(params.get('type'));
            if (type > 0 && type < 4) {
                setSelectedDashboardType(type);
            }
        } else {
            setSelectedDashboardType(!isDefaultTeam ? DashboardTypes.my : DashboardTypes.team);
        }
        refreshDashboard();
    }, [history.location.search])


    const {isLoading, error, data, refetch, isFetching} = useQuery<DashboardResponse, Error>(GetDashboard, () =>
        getDashboardData(selectedDashboardType, selectedDashboardTime, selectedStartDate, selectedEndDate), {
        retry: 3,
        enabled: false
    });



    const datesSelected = (startDate: Date, endDate: Date) => {
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
        setDisplayTimeFrameDropdown(false);
        refreshDashboard();
    }

    const refreshDashboard = () => {
        setTimeout(() => {
            refetch().then();
        }, 300);
    }

    const dashboardTypeSelected = (type: DashboardTypes) => {
        setDisplayTypeDropdown(false);
        setSelectedDashboardType(type);
        history.replace({
            pathname: history.location.pathname,
            search: queryString.stringify({type})
        });
        if (isWallboard) {
            return;
        }
        refreshDashboard();
    }

    const dashboardTimeFrameSelected = (id: number) => {
        setSelectedDashboardTime(id);
        if (id !== DashboardTimeframes.custom) {
            setDisplayTimeFrameDropdown(false);
            refreshDashboard();
        }
    }

    if (error) {
        return <div>{t('common.error')}</div>
    }

    let dashboardInformation = data;

    if (!dashboardInformation) {
        dashboardInformation = {
            channels: [],
            priorities: [],
            ratingStats: {
                unsatisfiedPercent: 0,
                unsatisfiedCount: 0,
                neutralPercent: 0,
                neutralCount: 0,
                satisfiedPercent: 0,
                satisfiedCount: 0,
                overallSatisfiedPercent: 0
            },
            statusStats: {
                total: 0,
                closed: 0,
                onHold: 0,
                due: 0,
                open: 0,
                overdue: 0
            },
            reasons: [],
            times: {
                previousHandleTime: 0,
                handleTime: 0,
                previousResponseTime: 0,
                responseTime: 0
            },
            volumes: {
                closedTotal: [],
                createdTotal: []
            }
        } as DashboardResponse
    }

    const dashboardTypeDropdownModel: DropdownModel = {
        defaultValue: selectedDashboardType.toString(),
        onClick: (id) => dashboardTypeSelected(Number(id)),
        items: Object.keys(DashboardTypes).filter(item => !isNaN(Number(item))).map(item => {
            return {
                label: t(`dashboard.types.${item}`),
                value: item.toString()
            }
        })
    };

    const dashboardTimeFrameDropdownModel: DropdownModel = {
        defaultValue: selectedDashboardTime.toString(),
        onClick: (id) => dashboardTimeFrameSelected(Number(id)),
        items: Object.keys(DashboardTimeframes).filter(item => !isNaN(Number(item))).map(item => {
            return {
                label: t(`dashboard.timeframes.${item}`),
                value: item.toString()
            }
        })
    };

    const refetchData = () => {
        if (isWallboard) {
            setLastUpdateTime(new Date());
        } else {
            refetch().then();
        }
    }


    return (
        <div className='w-full px-6 pb-10 overflow-y-auto dashboard'>
            <div className='flex flex-col'>
                <div className='flex flex-col items-center justify-between dashboard-header xl:flex-row'>
                    <div className='relative' ref={typeDropdownRef}>
                        <div onClick={() => setDisplayTypeDropdown(!displayTypeDropdown)}
                            className='flex flex-row items-center cursor-pointer'>
                            <h5>
                                {t(`dashboard.types.${selectedDashboardType}`)}
                            </h5>
                            <div className='pl-2'>
                                <SvgIcon type={displayTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                    className='icon-medium' fillClass='dashboard-dropdown-arrows' />
                            </div>
                        </div>
                        {displayTypeDropdown &&
                            <div className='absolute'>
                                <Dropdown model={dashboardTypeDropdownModel} />
                            </div>}
                    </div>
                    <div className='relative' ref={timeframeDropdownRef}>
                        {!isWallboard &&
                            <div className='flex flex-row justify-end cursor-pointer'
                                onClick={() => setDisplayTimeFrameDropdown(!displayTimeFrameDropdown)}>
                                <div>
                                    {t(`dashboard.timeframes.${selectedDashboardTime}`)}
                                </div>
                                <div className='pl-2'>
                                    <SvgIcon type={displayTimeFrameDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                        fillClass='dashboard-dropdown-arrows' className='icon-medium' />
                                </div>
                            </div>}
                        <div>
                            {displayTimeFrameDropdown &&
                                <div className='absolute right-12'>
                                    <div className='flex flex-col'>
                                        <Dropdown model={dashboardTimeFrameDropdownModel} />
                                        {selectedDashboardTime === DashboardTimeframes.custom &&
                                            <DashboardDateForm onDatesSelected={datesSelected} />}
                                    </div>

                                </div>}
                        </div>
                        <div>
                            <CountdownTimer
                                type={selectedDashboardType}
                                onTimerEnd={() => refetchData()} />
                        </div>
                    </div>
                </div>
                {isWallboard ?
                    <Wallboard lastUpdateTime={lastUpdateTime} /> :
                    <div className={isFetching || isLoading ? 'opacity-40' : ''}><DashboardContent data={dashboardInformation} /></div>
                }
            </div>
        </div>
    );
}
