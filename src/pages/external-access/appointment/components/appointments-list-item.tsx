import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import './appointment-list-item.scss';
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {selectDepartmentList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {useEffect} from 'react';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
interface AppointmentDetailProps {
    item: Appointment
}

const AppointmentsListItem = ({ item }: AppointmentDetailProps) => {

    const dispatch = useDispatch();
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);
    useEffect(() => {
        dispatch(getProviders());
        dispatch(getDepartments());
    }, [dispatch]);


    const providerName = providers ? providers.find(a => a.id === item.providerId)?.displayName : '';
    const departmentName = departments ? departments.find(a => a.id === item.departmentId)?.name : '';
    return (
        <div className='pb-4 2xl:pb-2'>
           <div className='appointment-list-item h-32 2xl:h-16 px-4 flex flex-col 2xl:flex-row items-center justify-center 2xl:justify-start'>
               <div className='2xl:w-96 subtitle2'>{utils.formatUtcDate(item.startDateTime)}</div>
               <div className='2xl:w-96 body2'>{item.patientAppointmentTypeName}</div>
               <div className='flex flex-col body2'>
                   <div>{providerName}</div>
                   <div>{departmentName}</div>
               </div>
           </div>
        </div>
    );
}

export default AppointmentsListItem;
