import Card from '@components/card/card';
import BasicStatistic from '@pages/dashboard/components/basic-statistic';
import {Icon} from '@components/svg-icon';
import TicketsVolumeChart from '@pages/dashboard/components/charts/tickets-volume.chart';
import TicketsPriorityChart from '@pages/dashboard/components/charts/tickets-priority.chart';
import TicketsReasonChart from '@pages/dashboard/components/charts/tickets-reason.chart';
import RatingsWidget from '@pages/dashboard/components/ratings-widget';
import TicketResponseTimeWidget from '@pages/dashboard/components/ticket-response-time-widget';
import TicketsByChannelsWidget from '@pages/dashboard/components/tickets-by-channels-widget';
import React from 'react';
import {DashboardResponse} from '@pages/dashboard/models/dashboardResponse';

export interface DashboardContentProps {
    data: DashboardResponse
}

const DashboardContent = (dataInput: DashboardContentProps) => {
    const {data} = dataInput;
    return <div className='grid grid-cols-1 lg:grid-cols-12'>
        <div className='flex flex-col col-span-12 lg:col-span-8'>
            <Card hasBorderRadius title='dashboard.ticket_stats.title'>
                <div className='flex flex-col'>
                    <div className='flex flex-col xl:flex-row justify-around h-24'>
                        <div>
                            <BasicStatistic
                                icon={data.statusStats.overdue > 0 ? Icon.Alert : undefined}
                                title='dashboard.ticket_stats.overdue'
                                count={data.statusStats.overdue}/>
                        </div>
                        <div>
                            <BasicStatistic title='dashboard.ticket_stats.due_today'
                                            count={data.statusStats.due}/>
                        </div>
                        <div>
                            <BasicStatistic title='dashboard.ticket_stats.open'
                                            count={data.statusStats.open}/>
                        </div>
                        <div>
                            <BasicStatistic title='dashboard.ticket_stats.on_hold'
                                            count={data.statusStats.onHold}/>
                        </div>
                        <div>
                            <BasicStatistic title='dashboard.ticket_stats.closed'
                                            count={data.statusStats.closed}/>
                        </div>
                        <div>
                            <BasicStatistic title='dashboard.ticket_stats.total'
                                            count={data.statusStats.total}/>
                        </div>
                    </div>
                    <div className='border-t'>
                        <Card hasBorderRadius={true} title='dashboard.tickets_volume.title'>
                            <div>
                                <div className='h-80'>
                                    <TicketsVolumeChart data={data.volumes}/>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>
            <div
                className='pt-8 flex flex-row flex flex-col xl:flex-row space-y-8 xl:space-y-0 xl:space-x-8 grid grid-cols-1 lg:grid-cols-12'>
                <div className='col-span-12 lg:col-span-6'>
                    <Card hasBorderRadius title='dashboard.by_priority.title'>
                        <TicketsPriorityChart data={data.priorities}/>
                    </Card>
                </div>
                <div className='col-span-12 lg:col-span-6'>
                    <Card hasBorderRadius title='dashboard.by_reason.title'>
                        <TicketsReasonChart data={data.reasons}/>
                    </Card>
                </div>
            </div>
        </div>
        <div className='col-span-12 px-0 py-8 xl:py-0 xl:pl-8 lg:col-span-4 xl:space-y-8 space-y-0'>
            <div>
                <Card hasBorderRadius title='dashboard.ratings.title'>
                    <div className='h-64'>
                        <RatingsWidget data={data.ratingStats}/>
                    </div>
                </Card>
            </div>
            <div>
                <Card hasBorderRadius title='dashboard.response_time.title'>
                    <div className='h-32'>
                        <TicketResponseTimeWidget data={data.times}/>
                    </div>
                </Card>
            </div>
            <div><Card hasBorderRadius title='dashboard.by_channel.title'>
                <div>
                    <TicketsByChannelsWidget data={data.channels}/>
                </div>
            </Card></div>
        </div>
    </div>
}

export default DashboardContent;
