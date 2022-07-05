import { useTranslation } from 'react-i18next';
import Spinner from '@components/spinner/Spinner';
import './general-settings.scss';
import { Controller, useForm } from 'react-hook-form';
import { ControlledInput } from '@components/controllers';
import Button from '@components/button/button';
import Radio from '@components/radio/radio';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import { Icon } from '@components/svg-icon';
import { useMutation, useQuery } from 'react-query';
import { GetGeneralSetting } from '@constants/react-query-constants';
import { getGeneralSetting, setGeneralSetting } from '@shared/services/lookups.service';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { useDispatch } from 'react-redux';
import { GeneralSettingsModel } from '@pages/configurations/models/general-settings.model';
import { useState } from 'react';
import Confirmation from '@components/confirmation/confirmation';
import { useHistory } from 'react-router';
import RouteLeavingGuard from '@components/route-leaving-guard/route-leaving-guard';

const GeneralSettings = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [forceRedirect, setForceRedirect] = useState<boolean>();
    const [warning, setWarning] = useState<boolean>(false);
    const {handleSubmit, control, formState} = useForm({mode: 'all'});

    const onSubmit = (formData) => {
        if(checkDeletedDepartmentsField(formData.deletedDepartments))
        {
            setAppointmentRemindersMutation.mutate(formData);
        }else{
            dispatch(addSnackbarMessage({
                message: 'configuration.general_settings.deleted_departments_warning',
                type: SnackbarType.Error
            }))
        }
    }

    const checkDeletedDepartmentsField = (data) => {
        if(data.length === 0){
            return true;
        }

        var alphanumericControl = data.split(',').filter(function(i){
            return isNaN(i);
        }).length > 0;

        if(alphanumericControl){
            return false;
        }

        var number = data.split(',').map(i=>Number(i));
        if(number.filter(x => x < -1).length >= 1){
            return false;
        }

        return true;
    }

    const { isFetching, data, refetch } = useQuery<GeneralSettingsModel>(GetGeneralSetting, () => getGeneralSetting(), {
        onSuccess: (data) => {
            setForceRedirect(data.forceToRedirect);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.appointment_reminders.get_error',
                type: SnackbarType.Error
            }))
        }
    });

    const setAppointmentRemindersMutation = useMutation(setGeneralSetting, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'configuration.appointment_reminders.set_success'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'configuration.appointment_reminders.set_error'
            }));
        }
    });

    return (<>
        <div className='general-settings px-6 pt-7'>
            <h6>{t('configuration.general_settings.title')}</h6>
            {isFetching ? (
                <Spinner size='large-40' className='pt-2' />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-1 flex-col group overflow-y-auto body2'>
                    <div className="mt-11 flex flex-row items-center">
                        <div className='input-row'>
                            <Controller
                                name='forceToRedirect'
                                control={control}
                                defaultValue={data?.forceToRedirect}
                                render={(props) => (
                                    <div>
                                        <div className='flex body2'>
                                            {t('configuration.general_settings.force_to_redirect')}
                                            <ToolTipIcon
                                                icon={Icon.Info}
                                                iconFillClass='rgba-05-fill'
                                                placement='bottom'
                                                iconClassName='cursor-pointer icon ml-2'
                                            >
                                                <div className='flex flex-col p-6 w-80 normal-case'>
                                                    {t('configuration.general_settings.force_to_redirect_info')}
                                                </div>
                                            </ToolTipIcon>
                                        </div>
                                        <div className='pt-3'>
                                            <Radio
                                                defaultValue={data?.forceToRedirect.toString()}
                                                name={props.name}
                                                truncate={true}
                                                ref={props.ref}
                                                data-test-id='consent-to-text'
                                                className='flex flex-row space-x-8'
                                                items={[
                                                    {
                                                        value: 'true',
                                                        label: 'common.yes'
                                                    },
                                                    {
                                                        value: 'false',
                                                        label: 'common.no'
                                                    }
                                                ]}
                                                onChange={(e: string) => {
                                                    setForceRedirect(JSON.parse(e));
                                                    control.trigger();
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mt-10 flex flex-row items-center">
                        <div className='input-row'>
                            <ControlledInput name='redirectToExternalPhone' control={control}
                                defaultValue={data?.redirectToExternalPhone === "-" ? "" : data?.redirectToExternalPhone}
                                type='tel'
                                label={'configuration.general_settings.redirect_phone_number'}
                                required={forceRedirect}
                            />
                        </div>
                        <ToolTipIcon
                            icon={Icon.Info}
                            iconFillClass='rgba-05-fill'
                            placement='bottom'
                            iconClassName='cursor-pointer icon ml-2'
                        >
                            <div className='flex flex-col p-6 w-80 normal-case'>
                                {t('configuration.general_settings.redirect_phone_number_info')}
                            </div>
                        </ToolTipIcon>
                    </div>
                    <div className="mt-10 flex flex-row items-center">
                        <div className='input-row'>
                            <ControlledInput name='infoPhoneNumber' control={control}
                                defaultValue={data?.infoPhoneNumber}
                                type='tel'
                                label={'configuration.general_settings.call_us_phone_number'}
                                required={false}
                            />
                        </div>
                        <ToolTipIcon
                            icon={Icon.Info}
                            iconFillClass='rgba-05-fill'
                            placement='bottom'
                            iconClassName='cursor-pointer icon ml-2'
                        >
                            <div className='flex flex-col p-6 w-80 normal-case'>
                                {t('configuration.general_settings.call_us_phone_number_info')}
                            </div>
                        </ToolTipIcon>
                    </div>
                    <div className="mt-10 flex flex-row items-center">
                        <div className='input-row'>
                            <ControlledInput name='infoEmailAddress' control={control}
                                defaultValue={data?.infoEmailAddress}
                                type='email'
                                label={'configuration.general_settings.support_email_address'}
                                required={false}
                            />
                        </div>
                        <ToolTipIcon
                            icon={Icon.Info}
                            iconFillClass='rgba-05-fill'
                            placement='bottom'
                            iconClassName='cursor-pointer icon ml-2'
                        >
                            <div className='flex flex-col p-6 w-80 normal-case'>
                                {t('configuration.general_settings.support_email_address_info')}
                            </div>
                        </ToolTipIcon>
                    </div>
                    <div className="mt-10 flex flex-row items-center">
                        <div className='input-row'>
                            <ControlledInput name='deletedDepartments' control={control}
                                defaultValue={data?.deletedDepartments}
                                label={'configuration.general_settings.deleted_departments'}
                                required={false}
                            />
                        </div>
                        <ToolTipIcon
                            icon={Icon.Info}
                            iconFillClass='rgba-05-fill'
                            placement='bottom'
                            iconClassName='cursor-pointer icon ml-2'
                        >
                            <div className='flex flex-col p-6 w-80 normal-case'>
                                {t('configuration.general_settings.deleted_departments_info')}
                            </div>
                        </ToolTipIcon>
                    </div>
                    <div className='flex mt-10'>
                        <Button
                            type='submit'
                            buttonType='medium'
                            disabled={!formState.isValid && forceRedirect}
                            label='common.save'
                            isLoading={setAppointmentRemindersMutation.isLoading}
                        />
                        <Button label='common.cancel' className=' ml-8 mr-8' buttonType='secondary' onClick={() => formState.isDirty && setWarning(true)} />
                        <RouteLeavingGuard
                            when={formState.isDirty && !formState.isSubmitSuccessful}
                            navigate={path => history.push(path)}
                            message={'configuration.general_settings.warning_info_leaving'}
                            title={'configuration.general_settings.warning'}
                        />
                        <Confirmation
                            onClose={() => setWarning(false)}
                            onCancel={() => setWarning(false)}
                            okButtonLabel={'common.ok'}
                            onOk={() => {setWarning(false); refetch()}}
                            title={'configuration.general_settings.warning'}
                            message={'configuration.general_settings.warning_info'}
                            isOpen={warning} />
                    </div>
                </form>
            )}
        </div>
    </>
    )
}
export default GeneralSettings;