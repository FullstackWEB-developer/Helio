import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from 'react-query';
import {GetDashboard} from '@constants/react-query-constants';
import {getDashboardData} from '@pages/tickets/services/tickets.service';
import {DashboardResponse} from '@pages/dashboard/models/dashboardResponse';
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

export const Dashboard = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [selectedDashboardType, setSelectedDashboardType] = useState<DashboardTypes>(DashboardTypes.team);
    const [selectedDashboardTime, setSelectedDashboardTime] = useState<number>(DashboardTimeframes.week);
    const [displayTimeFrameDropdown, setDisplayTimeFrameDropdown] = useState<boolean>(false);
    const [displayTypeDropdown, setDisplayTypeDropdown] = useState<boolean>(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const timeframeDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
    const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
    const isWallboard : boolean = selectedDashboardType === DashboardTypes.wallboard;
    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayTypeDropdown(false);
    });

    customHooks.useOutsideClick([timeframeDropdownRef], () => {
        setDisplayTimeFrameDropdown(false);
    });

    useEffect(() => {
        let params = new URLSearchParams(history.location.search)
        if (params.get('type')) {
            const type =  Number(params.get('type'));
            if (type > 0 && type < 4) {
                setSelectedDashboardType(type);
            }
        }
    }, [history.location.search])


    const {isLoading, error, data, refetch, isFetching} = useQuery<DashboardResponse, Error>(GetDashboard, () =>
            getDashboardData(selectedDashboardType, selectedDashboardTime, selectedStartDate, selectedEndDate), {
            retry: 3
        }
    );

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
        if(isWallboard) {
            setLastUpdateTime(new Date());
        } else {
            refetch().then();
        }
    }


    return (
        <div className='dashboard px-6 w-full overflow-y-auto pb-10'>
            <div className='flex flex-col'>
                <div className='dashboard-header flex flex-col xl:flex-row items-center justify-between'>
                    <div className='relative' ref={typeDropdownRef}>
                        <div onClick={() => setDisplayTypeDropdown(!displayTimeFrameDropdown)}
                             className='flex flex-row items-center cursor-pointer'>
                            <h5>
                                {t(`dashboard.types.${selectedDashboardType}`)}
                            </h5>
                            <div className='pl-2'>
                                <SvgIcon type={displayTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                         className='icon-medium' fillClass='dashboard-dropdown-arrows'/>
                            </div>
                        </div>
                        {displayTypeDropdown &&
                        <div className='absolute'>
                            <Dropdown model={dashboardTypeDropdownModel}/>
                        </div>}
                    </div>
                    <div className={!isWallboard ? 'pr-8 relative' : 'relative'} ref={timeframeDropdownRef}>
                        {!isWallboard &&
                        <div className='flex flex-row justify-end cursor-pointer'
                             onClick={() => setDisplayTimeFrameDropdown(!displayTypeDropdown)}>
                            <div>
                                {t(`dashboard.timeframes.${selectedDashboardTime}`)}
                            </div>
                            <div className='pl-2'>
                                <SvgIcon type={displayTimeFrameDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                         fillClass='dashboard-dropdown-arrows' className='icon-medium'/>
                            </div>
                        </div>}
                        <div>
                            {displayTimeFrameDropdown &&
                            <div className='absolute right-12'>
                                <div className='flex flex-col'>
                                    <Dropdown model={dashboardTimeFrameDropdownModel}/>
                                    {selectedDashboardTime === DashboardTimeframes.custom &&
                                    <DashboardDateForm onDatesSelected={datesSelected}/>}
                                </div>

                            </div>}
                        </div>
                        <div>
                            <CountdownTimer
                                type={selectedDashboardType}
                                isLoading={isFetching}
                                onTimerEnd={() => refetchData()}/>
                        </div>
                    </div>
                </div>
                { isWallboard ?
                    <Wallboard lastUpdateTime={lastUpdateTime} /> :
                    <div className={isFetching || isLoading ? 'opacity-40' : ''}><DashboardContent data={dashboardInformation} /></div>
                }
            </div>
        </div>
    );
}
