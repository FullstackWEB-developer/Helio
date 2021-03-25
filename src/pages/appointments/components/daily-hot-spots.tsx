import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {HotSpotDetail, HotSpotInfo} from '../models/hotspot.model';
import dayjs from 'dayjs';
import {useSelector} from 'react-redux';
import {selectDepartmentList, selectProviderList} from '../../../shared/store/lookups/lookups.selectors';
import {TableModel} from '@components/table/table.models';
import Table from '@components/table/table';

interface DailyHotspotsProps {
    dailyhotspot: HotSpotInfo
}

const DailyHotspots = ({dailyhotspot}: DailyHotspotsProps) => {

    const providers = useSelector(selectProviderList);
    const departments = useSelector(selectDepartmentList);
    const getEnrichedData = (data: HotSpotDetail[]) => {
        return data.map((datum) => {
            const provider = providers?.find(a => a.id === datum.providerId)?.displayName ?? '';
            const department = departments?.find(a => a.id === datum.departmentId)?.name ?? '';
            return {
                provider,
                department,
                count: datum.count
            }
        });
    }


    const hotspotTableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: getEnrichedData(dailyhotspot.details),
        columns: [
            {
                title: 'appointment.hot_spots.provider',
                field: 'provider',
                widthClass: 'w-56'
            },
            {
                title: 'appointment.hot_spots.open_slots',
                field: 'count',
                alignment: 'center',
                widthClass: 'w-20',
                rowClassname: 'subtitle2'
            },
            {
                title: 'appointment.hot_spots.location',
                field: 'department',
                alignment: 'end',
                widthClass: 'w-56'
            }
        ]
    }
    return (<>
        <div data-test-id='hot-spot-date' className='border-b py-5 subtitle'>
            {dayjs(dailyhotspot.date).format('dddd, MMM DD, YYYY')}
        </div>
        <div>
            <Table model={hotspotTableModel}/>
        </div>
    </>);
}

export default withErrorLogging(DailyHotspots);
