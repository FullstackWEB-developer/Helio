import PerformanceToday from '@pages/dashboard/components/wallboard/performance-today';
import RealtimeStatusSummary from '@pages/dashboard/components/wallboard/realtime-status-summary';
import AgentStatusTable from '@pages/dashboard/components/wallboard/agent-status-table';
import RealTimeStatusTable from '@pages/dashboard/components/wallboard/real-time-status-table';

export interface WallboardProps {
    lastUpdateTime: Date;
}

const Wallboard = ({lastUpdateTime}: WallboardProps) => {
    return <div className='flex flex-col'>
          <div className='flex flex-col md:flex-row space-y-8 space-x-0 md:space-x-8 md:space-y-0'>
                <div className='w-1/2'>
                    <RealtimeStatusSummary lastUpdateTime={lastUpdateTime}/>
                </div>
                <div className='w-1/2'>
                    <PerformanceToday lastUpdateTime={lastUpdateTime}/>
                </div>
            </div>
            <div>
                <RealTimeStatusTable lastUpdateTime={lastUpdateTime}/>
            </div>

            <div className='pt-8'>
                <AgentStatusTable/>
            </div>
        </div>
}

export default Wallboard;
