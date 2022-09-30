import { ConfigurationsPath } from '@app/paths';
import { Trans, useTranslation } from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useMemo, useState} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { Icon } from '@components/svg-icon';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import Button from '@components/button/button';
import Spinner from "@components/spinner/Spinner";
import Radio from '@components/radio/radio';
import { Option } from '@components/option/option';
import { ControlledSelect, ControlledInput, ControlledTextArea } from "@components/controllers";
import { AppointmentType } from '@pages/external-access/appointment/models'
import { GetAppointmentType } from '@constants/react-query-constants';
import { getAppointmentTypeById, saveAppointmentType } from '@pages/appointments/services/appointments.service';
import dayjs from 'dayjs';
import { PatientAppointmentType } from '@shared/models/patient-appointment-type.enum'
import './edit-appointment-type.scss';
import {selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {getProviders} from '@shared/services/lookups.service';
import {Provider} from '@shared/models';
import Select from '@components/select/select';
import utils from '@shared/utils/utils';
import RouteLeavingGuard from '@components/route-leaving-guard/route-leaving-guard';
import Confirmation from '@components/confirmation/confirmation';

const EditAppointmentType = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [appointmentType, setAppointmentType] = useState<AppointmentType>();
    const [currentLength, setCurrentLength] = useState<number>(0);
    const [currentCancelationFee, setCurrentCancelationFee] = useState<string>("");
    const providers = useSelector(selectProviderList);
    const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
    const [warning, setWarning] = useState<boolean>(false);
    const YesNoOptions: Option[] = [
        {
            value: 'true',
            label: 'common.yes'
        },
        {
            value: 'false',
            label: 'common.no'
        }
    ];

    const providerOptions = useMemo(() => providers && utils.parseOptions([...providers]?.sort((a, b) => a.firstName.localeCompare(b.firstName)),
        item => utils.stringJoin(' ', item.firstName, item.lastName),
        item => item.id.toString(),
        _ => '',
        item => item
    ), [providers])

    const patientTypeOptions: Option[] = [
        { value: String(PatientAppointmentType.Established), label: t('configuration.appointment_type_details.established_patient') },
        { value: String(PatientAppointmentType.New), label: t('configuration.appointment_type_details.new_patient') },
        { value: String(PatientAppointmentType.All), label: t('configuration.appointment_type_details.all') },
    ]

    useEffect(() => {
        dispatch(getProviders());
    }, [dispatch]);

    const updateAppointmentTypeMutation = useMutation(saveAppointmentType, {
        onSuccess: (_) => {
            dispatch(addSnackbarMessage({
                message: t('configuration.appointment_type_details.update_success'),
                type: SnackbarType.Success
            }));
            navigateBackToAppointmentTypeList();
        },
        onError: (error: AxiosError) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data?.message ?? t('configuration.appointment_type_details.update_error'),
                type: SnackbarType.Error
            }));
        }
    });

    const onSubmit = async (formData: any) => {
        if (!formData) {
            return;
        }
        if (appointmentType) {
            updateAppointmentTypeMutation.mutate({
                id: appointmentType.id,
                instructions: formData.instructions,
                name: formData.name,
                description: formData.description,
                cancelable: formData.isCancelable === 'true',
                cancelationTimeFrame: formData.cancelationTimeFrame ? parseInt(formData.cancelationTimeFrame) : 0,
                cancelationFee: formData.cancelationFee ? parseInt(formData.cancelationFee) : 0,
                reschedulable: formData.isReschedulable === 'true',
                rescheduleTimeFrame: formData.rescheduleTimeFrame ? parseInt(formData.rescheduleTimeFrame) : 0,
                selectableByPatient: formData.selectableByPatient === 'true',
                selectedProviders: selectedProviders.map(a => a.id),
                patientType: !!formData.patientType ? parseInt(formData.patientType) : 0,
                createdByName: appointmentType.createdByName,
                createdOn: appointmentType.createdOn
            })
        }
    }
    const { isFetching } =
        useQuery([GetAppointmentType], () => getAppointmentTypeById(parseInt(id)), {
            onSuccess: (data) => {
                setAppointmentType(data);
                setCurrentCancelationFee(data.cancelationFee ? data.cancelationFee.toString() : "");
                setCurrentLength(data.description?.length ?? 0);
            },

            onError: () => {
                dispatch(addSnackbarMessage({
                    message: 'configuration.appointment_type_details.error_fetching',
                    type: SnackbarType.Error
                }))
            }
        });

    useEffect(() => {
        if (!appointmentType || !providers) {
            return;
        }
        const apptProviders: Provider[] = [];
        appointmentType.selectedProviders.forEach(item => {
            const foundProvider = providers.find(a => a.id == item);
            if (foundProvider) {
                apptProviders.push(foundProvider)
            }
        });
        setSelectedProviders(apptProviders);
    }, [appointmentType, providers]);

    const { handleSubmit, watch, control, formState: { isValid, isDirty, isSubmitSuccessful } } = useForm({ mode: 'all'});

    const isReschedulable = watch('isReschedulable') === 'true';
    const isCancelable = watch('isCancelable') === 'true';
    const navigateBackToAppointmentTypeList = () => {
        const pathName = `${ConfigurationsPath}/appointment-type`;
        history.push({
            pathname: pathName,
        });
    }
    const updateLength = (value: string) => setCurrentLength(value ? value.length : 0);

    const displayToolTip = (message: string) => {
        return <ToolTipIcon
            icon={Icon.Info}
            iconFillClass='warning-icon'
            placement='right-start'
            iconClassName='icon-medium'
        >
            <div className='flex flex-col p-3'>
                <Trans i18nKey={message}>
                    <span className=' whitespace-pre-wrap body2'>{message}</span>
                </Trans>
            </div>
        </ToolTipIcon>
    }

    const providerSelected = (provider: Provider) => {
        let index = selectedProviders.indexOf(provider);
        if (index < 0) {
            selectedProviders.push(provider);
        } else {
            selectedProviders.splice(index, 1);
        }
    }


    return (
        <>{isFetching ? <Spinner fullScreen={true} /> :
            appointmentType &&
            <div className='flex flex-col flex-1 overflow-auto h-full p-6 pr-4'>
                <div className='flex flex-row pb-4'>
                    <span className="h6 appointment-type-id" >{appointmentType.id}:</span>
                    <span className="h6 ml-3">{appointmentType.name}</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-row items-center pt-4">
                        <div className='w-1/3'>
                            <ControlledInput name='name'
                                             control={control}
                                             defaultValue={appointmentType.name}
                                             label={'configuration.appointment_type_details.appointment_type_name'}
                                             required={true}
                            />
                        </div>
                        {displayToolTip(t('configuration.appointment_type_details.tooltip_helio_appointment_name'))}
                    </div>
                    <div className='flex flex-row items-center mt-4'>
                        <span className='body2 mr-2'>{t('configuration.appointment_type_details.appointment_description')}</span>
                        {displayToolTip(t('configuration.appointment_type_details.tooltip_helio_appointment_description'))}
                    </div>
                    <div className='pr-24'>
                        <ControlledTextArea name='description'
                                            control={control}
                                            defaultValue={appointmentType.description}
                                            className='body2 w-full'
                                            resizable={false}
                                            minRows={2}
                                            rows={2}
                                            maxRows={2}
                                            onChange={updateLength}
                        />
                        <span className='body2 flex justify-end'>{t('configuration.appointment_type_details.template_body_character', { currentLength: currentLength })}</span>
                    </div>
                    <div className='flex flex-row mt-10'>
                        <div className='flex flex-col w-1/5'>
                            <div className='flex flex-row body2 space-x-2'><span>{t('configuration.appointment_type_details.selectable_by_patient')}</span> {displayToolTip(t('configuration.appointment_type_details.tooltip_selectable_by_patient'))}</div>
                            <Controller
                                name='selectableByPatient'
                                control={control}
                                defaultValue={String(appointmentType.selectableByPatient)}
                                render={(controllerProps) => (
                                    <Radio name={controllerProps.name} ref={controllerProps.ref} className='flex space-x-8 mt-2' defaultValue={String(appointmentType.selectableByPatient)} items={YesNoOptions} onChange={(e: string) => { controllerProps.onChange(e); }} />
                                )}
                            />
                        </div>
                        <div className='w-1/4'>
                            <ControlledSelect
                                name={`patientType`}
                                label='configuration.appointment_type_details.patient_type'
                                className='w-1/3'
                                options={patientTypeOptions}
                                control={control}
                                defaultValue={patientTypeOptions.find(x => x.value === appointmentType.patientType.valueOf().toString())?.value}
                            />
                        </div>
                    </div>

                    <div className='flex flex-row mt-10'>
                        <div className='w-1/5'>
                            <span className='body2'>{t('configuration.appointment_type_details.can_be_rescheduled')}</span>
                            <Controller
                                name='isReschedulable'
                                control={control}
                                defaultValue={String(appointmentType.reschedulable)}
                                render={(controllerProps) => (
                                    <Radio name={controllerProps.name} ref={controllerProps.ref} className='flex space-x-8 mt-2' defaultValue={String(appointmentType.reschedulable)} items={YesNoOptions} onChange={(e: string) => { controllerProps.onChange(e); }} />
                                )}
                            />
                        </div>

                        <div className="flex flex-row items-center">
                            <div className='w-48'>
                                <ControlledInput name='rescheduleTimeFrame'
                                                 control={control}
                                                 defaultValue={appointmentType.rescheduleTimeFrame ?? null}
                                                 label={'configuration.appointment_type_details.reschedule_timeframe'}
                                                 assistiveText={'configuration.appointment_type_details.days'}
                                                 type='timeframe'
                                                 required={isReschedulable}
                                                 disabled={!isReschedulable}
                                />
                            </div>
                            {displayToolTip(t('configuration.appointment_type_details.tooltip_reschedule_timeframe'))}
                        </div>
                    </div>

                    <div className='flex flex-row mt-10'>
                        <div className='w-1/5'>
                            <span className='body2'>{t('configuration.appointment_type_details.can_be_canceled')}</span>
                            <Controller
                                name='isCancelable'
                                control={control}
                                defaultValue={String(appointmentType.cancelable)}
                                render={(controllerProps) => (
                                    <Radio name={controllerProps.name} ref={controllerProps.ref} className='flex space-x-8 mt-2' defaultValue={String(appointmentType.cancelable)} items={YesNoOptions} onChange={(e: string) => { controllerProps.onChange(e); }} />
                                )}
                            />
                        </div>
                        <div className="flex flex-row items-center mr-40">
                            <div className='w-48'>
                                <ControlledInput
                                    name='cancelationTimeFrame'
                                    control={control}
                                    defaultValue={appointmentType.cancelationTimeFrame ?? null}
                                    label={'configuration.appointment_type_details.cancelation_timeframe'}
                                    assistiveText={'configuration.appointment_type_details.hours'}
                                    required={isCancelable}
                                    disabled={!isCancelable}
                                    type='timeframe'
                                />
                            </div>
                            {displayToolTip(t('configuration.appointment_type_details.tooltip_cancelation_timeframe'))}
                        </div>
                        <div className='w-48 ml-3'>
                            <ControlledInput name='cancelationFee'
                                             control={control}
                                             defaultValue={appointmentType.cancelationFee ?? ''}
                                             label={'configuration.appointment_type_details.cancelation_fee'}
                                             required={isCancelable}
                                             type='timeframe'
                                             disabled={!isCancelable}
                                             prefix={currentCancelationFee === "" ? undefined : "$"}
                                             onChange={(e) => setCurrentCancelationFee(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='w-1/3 py-6 flex flex-row items-center'>
                        <Select
                            options={providerOptions}
                            label='configuration.appointment_type_details.selected_providers'
                            isMultiple={true}
                            defaultValues={selectedProviders?.map(a => {
                                return {
                                    value: a.id.toString()
                                } as Option
                            })}
                            onSelect={option => providerSelected(option?.object)}
                        />{displayToolTip(t('configuration.appointment_type_details.tooltip_selected_providers'))}
                    </div>
                    <div className='flex flex-row items-center mt-4 space-x-2'>
                        <span className='body2'>{t('configuration.appointment_type_details.appointment_instructions')}</span>
                        {displayToolTip(t('configuration.appointment_type_details.tooltip_appointment_instructions'))}
                    </div>
                    <div className='pr-24'>
                        <ControlledTextArea control={control}
                                            name='instructions'
                                            showSendIconInRichTextMode={false}
                                            toggleRichTextMode={true}
                                            hideFormattingButton={true}
                                            defaultValue={appointmentType.instructions} />
                    </div>
                    <div className='flex flex-row mt-5'>
                        <div className='flex flex-col body2 appointment-type-id '>
                            <span>{t('configuration.appointment_type_details.created_by')}</span>
                            <span>{t('configuration.appointment_type_details.created_date')}</span>
                            <span>{t('configuration.appointment_type_details.modified_by')}</span>
                            <span>{t('configuration.appointment_type_details.modified_date')}</span>
                        </div>
                        <div className='flex flex-col ml-10 body2'>
                            <span>{appointmentType.createdByName ? appointmentType.createdByName : t('common.not_available')}</span>
                            <span>{dayjs.utc(appointmentType.createdOn).local().format('MMM DD, YYYY')}</span>
                            <span>{appointmentType.modifiedByName ? appointmentType.modifiedByName : t('common.not_available')}</span>
                            <span>{appointmentType.modifiedOn ? dayjs.utc(appointmentType.modifiedOn).local().format('MMM DD, YYYY') : t('common.not_available')}</span>
                        </div>

                    </div>
                    <div className='flex mt-10'>
                        <Button type='submit' buttonType='medium' disabled={!isDirty || !isValid} label='common.save' isLoading={updateAppointmentTypeMutation.isLoading} />
                        <Button label='common.cancel' className=' mx-8' buttonType='secondary' onClick={() => navigateBackToAppointmentTypeList()}
                                disabled={updateAppointmentTypeMutation.isLoading}
                        />
                    </div>
                    <RouteLeavingGuard
                        when={isDirty && !isSubmitSuccessful}
                        navigate={path => history.push(path)}
                        message={'configuration.appointment_type_details.warning_info_leaving'}
                        title={'configuration.appointment_type_details.warning'}
                    />
                    <Confirmation
                            onClose={() => setWarning(false)}
                            onCancel={() => setWarning(false)}
                            okButtonLabel={'common.ok'}
                            onOk={() => {setWarning(false)}}
                            title={'configuration.appointment_type_details.warning'}
                            message={'configuration.appointment_type_details.warning_info'}
                            isOpen={warning} />
                </form>
            </div>
        }
        </>
    )
}
export default EditAppointmentType;
