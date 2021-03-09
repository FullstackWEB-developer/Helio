import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../shared/components/button/button';
import Select from '../../../shared/components/select/select';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import { Department } from '../../../shared/models/department';
import { Provider } from '../../../shared/models/provider';
import { getDepartments, getProviders } from '../../../shared/services/lookups.service';
import { getAppointments } from '../../../shared/services/search.service';
import { selectDepartmentList, selectProviderList } from '../../../shared/store/lookups/lookups.selectors';
import utils from '../../../shared/utils/utils';
import {
    selectAppointmentList,
    selectIsPatientError,
    selectIsPatientVerified,
    selectPatientLoading,
    selectVerifiedPatent
} from '../../patients/store/patients.selectors';
import { clearAppointments, clearVerifiedPatient } from '../../patients/store/patients.slice';
import { clearRedirectLink } from '../hipaa-verification/store/redirect-link-slice.slice';
import AppointmentDetailItem from './components/appointment-detail-item';
import { Appointment } from './models/appointment';
import { AppointmentDetailDisplayItem } from './models/appointment-detail-display-item';

const AppointmentDetail = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isError = useSelector(selectIsPatientError);
    const isLoading = useSelector(selectPatientLoading)
    const isVerified = useSelector(selectIsPatientVerified);
    const appointments = useSelector(selectAppointmentList);
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);

    let options: any[] = [];
    const [selectedOption, setSelectedOption] = useState(options.length > 0 ? options[0] : null);
    const [items, setItems] = useState<AppointmentDetailDisplayItem[]>([]);

    const getAppointmentDetailDisplayItems = (appointmentId: string) => {
        let resultItems: AppointmentDetailDisplayItem[] = [];
        const selectedAppointment = appointments ? appointments.find((a: Appointment) => a.appointmentId === appointmentId) : {} as any;

        const getDepartmentById = (departmentId: string) => {
            return departments ? departments.find((d: Department) => d.id.toString() === departmentId) : null;
        }
        const getProviderById = (providerId: string) => {
            return providers ? providers.find((p: Provider) => p.id.toString() === providerId) : null;
        }

        if (selectedAppointment) {
            const selectedDepartment = getDepartmentById(selectedAppointment.departmentId);
            const selectedProvider = getProviderById(selectedAppointment.providerId);

            resultItems = [
                {
                    title: t('appointment.type'),
                    description: selectedAppointment.patientAppointmentTypeName
                },
                {
                    title: t('appointment.date'),
                    description: utils.formatDate(selectedAppointment.date)
                },
                {
                    title: t('appointment.time'),
                    description: selectedAppointment.startTime
                },
                {
                    title: t('appointment.provider'),
                    description: selectedProvider ? selectedProvider.displayName : ''
                },
                {
                    title: t('appointment.location'),
                    description: selectedDepartment ? selectedDepartment.name : ''
                },
                {
                    title: t('appointment.address'),
                    description: selectedDepartment ? selectedDepartment.address : ''
                },
                {
                    title: t('appointment.reminders_instructions'),
                    description: 'Please arrive at least 15 minutes early.'
                },
                {
                    title: t('appointment.parking_instructions'),
                    description: 'Patients can park in the designated spots.'
                }
            ];
        }
        return resultItems;
    }

    const manageOptions = () => {
        options = appointments ? appointments.map((a: Appointment) => ({
            value: a.appointmentId,
            label: a.patientAppointmentTypeName,
        })) : [];

        if (selectedOption === null && options && options.length > 0) {
            setSelectedOption(options[0]);
        }
        if (selectedOption && selectedOption.value && items.length === 0) {
            setItems(getAppointmentDetailDisplayItems(selectedOption.value));
        }
    }

    manageOptions();

    useEffect(() => {
        if (verifiedPatient) {
            dispatch(getAppointments(verifiedPatient.patientId.toString()));
            dispatch(getProviders());
            dispatch(getDepartments());
        }
        return () => {
            dispatch(clearVerifiedPatient());
            dispatch(clearAppointments());
            dispatch(clearRedirectLink());
        }
    }, [dispatch, verifiedPatient]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation();
        setSelectedOption({
            value: event.target.value
        });
        setItems(getAppointmentDetailDisplayItems(event.target.value));
    }

    if (selectedOption && selectedOption.value && items.length === 0) {
        setItems(getAppointmentDetailDisplayItems(selectedOption.value));
    }

    return (
        <Fragment>
            <div hidden={!isLoading}>
                <ThreeDots />
            </div>
            <div hidden={isLoading} className='container mx-auto my-10'>
                <div hidden={!isVerified} className={'text-xl'}>{t('appointment.data_verified_successfully')}</div>
                <div hidden={!isError} className={'p-4 text-red-500'}>{t('appointment.error')}</div>
                <div hidden={isError || !isVerified || options.length <= 1}>
                    <Select
                        data-test-id='appointment-select'
                        value={selectedOption ? selectedOption.value : ''}
                        onChange={handleChange}
                        options={options}
                    />
                </div>
                {
                    !isError && isVerified && items.length > 0 && selectedOption
                        ? <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
                            <div className='px-4 py-5 sm:px-6'>
                                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                                    {t('appointment.detail_info')}
                                </h3>
                                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                                    {t('appointment.detail_info_description')}
                                </p>
                            </div>
                            <div className='border-t border-gray-200'>
                                <dl data-test-id='appointment-detail-list'>
                                    {
                                        items.map((item: AppointmentDetailDisplayItem, index: number) => (
                                            <AppointmentDetailItem item={item} key={index} />
                                        ))
                                    }
                                </dl>

                                <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                                    <Button label={t('appointment.reSchedule')} data-test-id='appointment-reschedule'/>
                                    <Button buttonType='secondary' label={t('appointment.cancel')} data-test-id='appointment-cancel' />
                                </div>
                            </div>
                        </div>
                        : <div hidden={isError || isLoading} >
                            <span className={'subtitle'}>{t('appointment.no_appointments')}</span>
                        </div>

                }
            </div>
        </Fragment>
    );
}

export default AppointmentDetail;

