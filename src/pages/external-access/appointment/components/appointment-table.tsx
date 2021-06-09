import {useTranslation} from 'react-i18next';
import AppointmentTableItem from './appointment-table-item';
import {AppointmentTableData} from './appointment-table-type';

interface AppointmentTableProps {
    data?: AppointmentTableData[],
    isDetailsColumnVisible?: boolean,
    isActionColumnVisible?: boolean,
    isRowHoverDisabled?: boolean,
    onRowClick?: (appointment: AppointmentTableData) => void,
    onActionClick?: (appointment: AppointmentTableData) => void
}

const AppointmentTable = ({
    data = [],
    isDetailsColumnVisible = true,
    isActionColumnVisible = true,
    isRowHoverDisabled = false,
    onRowClick,
    onActionClick
}: AppointmentTableProps) => {
    const {t} = useTranslation();
    return (<div>
        <div className="px-6 py-4 flex caption-caps appointment-list-header">
            <div className='flex w-11/12 xl:w-4/12'>{t('external_access.appointments.appointment_list.appointment_date')}</div>
            {isDetailsColumnVisible &&
                <div className='hidden xl:flex w-3/12'>{t('external_access.appointments.appointment_list.details')}</div>
            }
            <div className='hidden xl:flex w-3/12'>{t('external_access.appointments.appointment_list.provider')}</div>
            <div className='hidden xl:flex w-3/12'>{t('external_access.appointments.appointment_list.location')}</div>
            {isActionColumnVisible &&
                <div className='hidden xl:flex w-3/12'></div>
            }
        </div>
        {
            data.map(appointment =>
                <AppointmentTableItem
                    key={appointment.appointmentId}
                    data={appointment}
                    isDetailsColumnVisible={isDetailsColumnVisible}
                    isActionColumnVisible={isActionColumnVisible}
                    isRowHoverDisabled={isRowHoverDisabled}
                    onActionClick={onActionClick}
                    onClick={onRowClick} />
            )
        }
    </div>)
}

export default AppointmentTable;
