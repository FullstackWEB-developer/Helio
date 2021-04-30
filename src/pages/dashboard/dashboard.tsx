import React, {useRef, useState} from 'react';
import {useQuery} from 'react-query';
import {GetDashboard} from '@constants/react-query-constants';
import {getDashboardData} from '@pages/tickets/services/tickets.service';
import {DashboardResponse} from '@pages/dashboard/models/dashboardResponse';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import Card from '@components/card/card';
import BasicStatistic from '@pages/dashboard/components/basic-statistic';
import {useTranslation} from 'react-i18next';
import './dashboard.scss';
import TicketsVolumeChart from '@pages/dashboard/components/charts/tickets-volume.chart';
import RatingsWidget from '@pages/dashboard/components/ratings-widget';
import TicketsPriorityChart from './components/charts/tickets-priority.chart';
import TicketsReasonChart from '@pages/dashboard/components/charts/tickets-reason.chart';
import TicketResponseTimeWidget from './components/ticket-response-time-widget';
import TicketsByChannelsWidget from '@pages/dashboard/components/tickets-by-channels-widget';
import {DropdownModel} from '@components/dropdown/dropdown.models';
import Dropdown from '@components/dropdown/dropdown';
import customHooks from '@shared/hooks/customHooks';
import {DashboardTypes} from '@pages/dashboard/enums/dashboard-type.enum';
import {DashboardTimeframes} from '@pages/dashboard/enums/dashboard.timeframes';
import CountdownTimer from '@pages/dashboard/components/countdown-timer';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import DashboardDateForm from './components/dashboard-date-form';

export const Dashboard = () => {
    const {t} = useTranslation();
    const [selectedDashboardType, setSelectedDashboardType] = useState<number>(DashboardTypes.team);
    const [selectedDashboardTime, setSelectedDashboardTime] = useState<number>(DashboardTimeframes.week);
    const [displayTimeFrameDropdown, setDisplayTimeFrameDropdown] = useState<boolean>(false);
    const [displayTypeDropdown, setDisplayTypeDropdown] = useState<boolean>(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const timeframeDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());

    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayTypeDropdown(false);
    });

    customHooks.useOutsideClick([timeframeDropdownRef], () => {
        setDisplayTimeFrameDropdown(false);
    });


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
            refetch();
        }, 300);
    }

    const dashboardTypeSelected = (id: number) => {
        setDisplayTypeDropdown(false);
        if (id === DashboardTypes.wallboard) {
            return;
        }
        setSelectedDashboardType(id);
        refreshDashboard();
    }

    const dashboardTimeFrameSelected = (id: number) => {
        setSelectedDashboardTime(id);
        if (id !== DashboardTimeframes.custom) {
            setDisplayTimeFrameDropdown(false);
            refreshDashboard();
        }
    }

    if (isLoading) {
        return <ThreeDots/>;
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
                dueToday: 0,
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
                    <div className='pr-8' ref={timeframeDropdownRef}>
                        <div className='flex flex-row justify-end cursor-pointer'
                             onClick={() => setDisplayTimeFrameDropdown(!displayTypeDropdown)}>
                            <div className='relative'>
                                {t(`dashboard.timeframes.${selectedDashboardTime}`)}
                            </div>
                            <div className='pl-2'>
                                <SvgIcon type={displayTimeFrameDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                         fillClass='dashboard-dropdown-arrows' className='icon-medium'/>
                            </div>
                        </div>
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
                            <CountdownTimer isLoading={isFetching} onTimerEnd={() => refetch()}/>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-12'>
                    <div className='flex flex-col col-span-12 lg:col-span-8'>
                        <Card title='dashboard.ticket_stats.title'>
                            <div className='flex flex-col'>
                                <div className='flex flex-col xl:flex-row justify-around h-24'>
                                    <div>
                                        <BasicStatistic
                                            icon={dashboardInformation.statusStats.overdue > 0 ? Icon.Alert : undefined}
                                            title='dashboard.ticket_stats.overdue'
                                            count={dashboardInformation.statusStats.overdue}/>
                                    </div>
                                    <div>
                                        <BasicStatistic title='dashboard.ticket_stats.due_today'
                                                        count={dashboardInformation.statusStats.dueToday}/>
                                    </div>
                                    <div>
                                        <BasicStatistic title='dashboard.ticket_stats.open'
                                                        count={dashboardInformation.statusStats.open}/>
                                    </div>
                                    <div>
                                        <BasicStatistic title='dashboard.ticket_stats.on_hold'
                                                        count={dashboardInformation.statusStats.onHold}/>
                                    </div>
                                    <div>
                                        <BasicStatistic title='dashboard.ticket_stats.closed'
                                                        count={dashboardInformation.statusStats.closed}/>
                                    </div>
                                    <div>
                                        <BasicStatistic title='dashboard.ticket_stats.total'
                                                        count={dashboardInformation.statusStats.total}/>
                                    </div>
                                </div>
                                <div className='border-t'>
                                    <Card title='dashboard.tickets_volume.title'>
                                        <div className='h-80'>
                                            <TicketsVolumeChart data={dashboardInformation.volumes}/>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </Card>
                        <div
                            className='pt-8 flex flex-row flex flex-col xl:flex-row space-y-8 xl:space-y-0 xl:space-x-8 grid grid-cols-1 lg:grid-cols-12'>
                            <div className='col-span-12 lg:col-span-6'>
                                <Card title='dashboard.by_priority.title'>
                                    <TicketsPriorityChart data={dashboardInformation.priorities}/>
                                </Card>
                            </div>
                            <div className='col-span-12 lg:col-span-6'>
                                <Card title='dashboard.by_reason.title'>
                                    <TicketsReasonChart data={dashboardInformation.reasons}/>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-12 px-0 py-8 xl:py-0 xl:px-8 lg:col-span-4 xl:space-y-8 space-y-0'>
                        <div>
                            <Card title='dashboard.ratings.title'>
                                <div className='h-64'>
                                    <RatingsWidget data={dashboardInformation.ratingStats}/>
                                </div>
                            </Card>
                        </div>
                        <div>
                            <Card title='dashboard.response_time.title'>
                                <div className='h-32'>
                                    <TicketResponseTimeWidget data={dashboardInformation.times}/>
                                </div>
                            </Card>
                        </div>
                        <div><Card title='dashboard.by_channel.title'>
                            <div>
                                <TicketsByChannelsWidget data={dashboardInformation.channels}/>
                            </div>
                        </Card></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
