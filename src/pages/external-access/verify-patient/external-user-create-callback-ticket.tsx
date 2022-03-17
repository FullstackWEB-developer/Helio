import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import ControlledInput from '../../../shared/components/controllers/ControlledInput';
import React, {useState} from 'react';
import utils from '@shared/utils/utils';
import {ControlledDateInput} from '@components/controllers';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import Button from '@components/button/button';
import {useMutation} from 'react-query';
import {createCallbackTicket} from '@pages/tickets/services/tickets.service';
import {useDispatch, useSelector} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {CallbackTicket} from '@pages/tickets/models/callback-ticket.model';
import {
    selectPreventRetryUntil,
    selectRedirectLink,
    selectRetryPrevented
} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {ResendTimeout} from '@pages/external-access/verify-patient/resend-timeout';
import {
    setPreventRetryUntil,
    setRetryPrevented
} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import dayjs from 'dayjs';
import {ChannelTypes} from '@shared/models';

const ExternalUserCreateCallbackTicket = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const request = useSelector(selectRedirectLink);
    const history = useHistory();
    const retryPrevented = useSelector(selectRetryPrevented);
    const preventRetryUntil = useSelector(selectPreventRetryUntil);
    const [ticketSubmitted, setTicketSubmitted] = useState<boolean>(false);
    const {handleSubmit, control, formState : {isDirty, isValid, errors}} =
        useForm({
            mode: 'onBlur'
        });

    const createCallbackTicketMutation = useMutation(createCallbackTicket, {
        onSuccess: () => {
            setTicketSubmitted(true);
            dispatch(setRetryPrevented(true));
            dispatch(setPreventRetryUntil(dayjs().add(Number(utils.getAppParameter('VerificationFailWaitInSeconds')), 'seconds').toDate()));
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'external_access.callback_ticket_created'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'common.error'
            }));
        }
    });

    const onSubmit = (data: CallbackTicket) => {
        data = {
            ...data,
            dateOfBirth: dayjs(data.dateOfBirth).utc(true).toDate(),
            note : t('external_access.patient_verification_failed_callback_note'),
            subject: t('external_access.patient_verification_failed_callback_subject'),
            channel: ChannelTypes.WebSite
        };
        dispatch(setPreventRetryUntil(undefined));
        createCallbackTicketMutation.mutate(data);
    }

    const calculateSeconds = () => {
        if (!preventRetryUntil) {
            return 0;
        }
        return dayjs(preventRetryUntil).diff(dayjs(), 'seconds');
    }

    return <div className='md:px-12 xl:px-48 without-default-padding pt-4 xl:pt-16'>
            <div className='md:whitespace-pre md:h-24 my-1 md:pb-10 w-full items-center'>
                <h4>
                    {t('external_access.could_not_verify_header')}
                </h4>
            </div>
            <div className='pt-10 xl:pt-2'>
                {t('external_access.could_not_verify_description_1', {
                    'minutes': (Number(utils.getAppParameter('VerificationFailWaitInSeconds')) /60)
                })}
            </div>
            <div>
                {t('external_access.could_not_verify_description_2')}
            </div>
        <div className='flex flex-col'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ControlledInput
                    required={true}
                    defaultValue=''
                    className='w-full md:w-88'
                    label={t('external_access.first_name')}
                    control={control}
                    name='firstName'/>
                <ControlledInput
                    required={true}
                    defaultValue=''
                    className='w-full md:w-88'
                    label={t('external_access.last_name')}
                    control={control}
                    name='lastName'/>
                <ControlledDateInput
                    type='date'
                    longDateFormat={false}
                    isCalendarDisabled
                    required={true}
                    errorMessage={errors?.dob && errors?.dob?.type === "required" &&
                    t('external_access.invalid_dob', {'format': utils.getBrowserDatePattern()})}
                    label='external_access.dob'
                    assistiveText={utils.getBrowserDatePattern()}
                    control={control}
                    name='dateOfBirth'
                    className='w-full md:w-88'
                    max={new Date(new Date().toDateString())}
                    dataTestId='hipaa-dob'/>
                <ControlledInput
                    type='tel'
                    required={true}
                    errorMessage={errors?.zip && errors?.zip?.type === "required" && t('components.input.invalid_zip')}
                    defaultValue=''
                    className='w-full md:w-88'
                    label={t('external_access.mobile')}
                    control={control}
                    name='mobileNumber'/>
                <ControlledInput
                    type='zip'
                    required={true}
                    errorMessage={errors?.zip && errors?.zip?.type === "required" && t('components.input.invalid_zip')}
                    defaultValue=''
                    className='w-full md:w-88'
                    label={t('external_access.zip_code')}
                    control={control}
                    name='zip'/>
                <div className='pb-2 pt-6 flex justify-start'>
                    <div>
                        {ticketSubmitted ?
                    <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-baseline'>
                    <Button
                        label={'common.back'}
                        className='w-full md:w-auto'
                        onClick={() => history.go(-1)}
                        disabled={retryPrevented}
                        data-test-id='mobile-phone-submit-button'
                        buttonType='secondary-big'/>
                            <ResendTimeout message='external_access.go_back_and_retry_in_seconds'
                                       countdownSeconds={calculateSeconds()}
                            onTimeOut={()=> dispatch(setRetryPrevented(false))}/>
                            </div>:

                    <Button
                        label={'common.continue'}
                        className='w-full md:w-auto'
                        type='submit'
                        isLoading={createCallbackTicketMutation.isLoading}
                        disabled={!isDirty || !isValid || ticketSubmitted}
                        data-test-id='mobile-phone-submit-button'
                        buttonType='big'/>
                    }
                    </div>
                </div>
            </form>
            <ExternalUserEmergencyNote type={request.requestType}/>
        </div>
    </div>;
}

export default ExternalUserCreateCallbackTicket;
