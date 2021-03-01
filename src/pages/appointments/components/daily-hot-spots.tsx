import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { HotSpotDetail, HotSpotInfo } from '../models/hotspot.model';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDepartmentList, selectProviderList } from '../../../shared/store/lookups/lookups.selectors';

interface DailyHotspotsProps {
    dailyhotspot: HotSpotInfo
}

const DailyHotspots = ({ dailyhotspot }: DailyHotspotsProps) => {

    const { t } = useTranslation();
    const providers = useSelector(selectProviderList);
    const departments = useSelector(selectDepartmentList);
    const tableHeadings = [t('appointment.hot_spots.provider'), t('appointment.hot_spots.open_slots'), t('appointment.hot_spots.location')];

    const Headers = (headers: string[]) => {
        const headerDivs = headers.map((header, i) => {
            return <>
                <div data-test-id={`hot-spot-header-${i}`} className='text-gray-400'>{header}</div>
            </>
        });
        return (<div data-test-id='hot-spot-main-header' className='flex flex-row justify-between'>
            {headerDivs}
        </div>);
    }

    const Rows = (data: HotSpotDetail[]) => {
        const dataDivs = data.map((datum, i) => {
            const provider = providers?.find(a => a.id === datum.providerId)?.displayName ?? '';
            const department = departments?.find(a => a.id === datum.departmentId)?.name ?? '';
            return <>
                <div className='flex flex-row justify-between'>
                    <div data-test-id={`hot-spot-row-${i}-provider`}>{provider}</div>
                    <div data-test-id={`hot-spot-row-${i}-count`}>{datum.count}</div>
                    <div data-test-id={`hot-spot-row-${i}-department`}>{department}</div>
                </div>
            </>
        });

        return (<div>
            {dataDivs}
        </div>)
    }
    return (<>
        <div data-test-id='hot-spot-date' className='border-b pb-1'>
            {dayjs(dailyhotspot.date).format('dddd, MMM DD, YYYY')}
        </div>
        <div>
            {Headers(tableHeadings)}
            {Rows(dailyhotspot.details)}
        </div>
    </>);
}

export default withErrorLogging(DailyHotspots);
