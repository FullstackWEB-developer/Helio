import ControlledInput from '@shared/components/controllers/ControlledInput';
import Button from '@components/button/button';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RedirectLink} from '@pages/external-access/hipaa-verification/models/redirect-link';
import {useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import {CheckPatientIsExist} from '@constants/react-query-constants';
import {checkIfPatientExists} from '@pages/patients/services/patients.service';
import {useHistory, useLocation} from 'react-router-dom';
import {ControlledDateInput} from '@components/controllers';
import utils from '@shared/utils/utils';
import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';
import { useDispatch } from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';

const GetExternalUserDobZip = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const {state} = useLocation<{request: RedirectLink, phoneNumber: string}>();
    const [displayNotFoundError, setDisplayNotFoundError] = useState<boolean>(false);
    const {handleSubmit, control, formState, watch} =
        useForm({
        mode: 'onBlur'
    });

    const {isLoading: checkIfPatientExistsLoading, error: checkIfPatientExistsError, refetch: checkIfPatientExistsRefetch} =
        useQuery([CheckPatientIsExist, state.phoneNumber, watch('zip'), watch('dob')],() =>
        {
            const date = utils.toShortISOLocalString(watch("dob"));
            return checkIfPatientExists({
                mobilePhoneNumber: state.phoneNumber,
                zip: watch('zip'),
                dateOfBirth: date
            });
        },{
            enabled: false,
            onSuccess: (data) => {
                if (!data.doesExists) {
                    setDisplayNotFoundError(true);
                } else {
                    if (data.patientId.toString() === state.request.patientId) {
                        history.push('/o/verify-patient-code', {
                            ...state,
                            email: data.email
                        });
                    } else {
                        dispatch(addSnackbarMessage({
                            type: SnackbarType.Error,
                            message: 'external_access.not_verified_patient',
                            position: SnackbarPosition.TopCenter
                        }));
                    }

                }
            }
        });

    const onSubmit = () => {
       checkIfPatientExistsRefetch();
    }

    return <div className='md:px-48 without-default-padding pt-4 xl:pt-16'>
        <GetExternalUserHeader
            title={`external_access.title_${state.request.requestType}`}
            description='external_access.hipaa_verify_description' />
        {displayNotFoundError && <div className='body2 text-danger pb-6'>
            {t('external_access.mobile_verification_failed', { "phone": process.env.REACT_APP_CALL_US_PHONE})}
        </div>}
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='pb-6'>
                       <ControlledDateInput
                                type='date'
                                longDateFormat={false}
                                isCalendarDisabled
                                required={true}
                                errorMessage={formState.errors?.dob && formState.errors?.dob?.type === "required" &&
                                    t('external_access.invalid_dob', {'format' : utils.getBrowserDatePattern()})}
                                label='external_access.dob'
                                assistiveText={utils.getBrowserDatePattern()}
                                control={control}
                                name='dob'
                                className='w-full md:w-88'
                                max={new Date(new Date().toDateString())}
                                dataTestId='hipaa-dob'/>
                            <ControlledInput
                                type='zip'
                                required={true}
                                errorMessage={formState.errors?.zip && formState.errors?.zip?.type === "required" && t('components.input.invalid_zip')}
                                defaultValue=''
                                className='w-full md:w-88'
                                label={t('external_access.zip_code')}
                                control={control}
                                name='zip'/>
                    </div>
                    <div className='pb-2 flex justify-start'>
                        <div>
                            <Button
                                label={'common.continue'}
                                disabled={!formState.isDirty || !formState.isValid}
                                className='w-full md:w-auto'
                                type='submit'
                                isLoading={checkIfPatientExistsLoading}
                                data-test-id='mobile-phone-submit-button'
                                buttonType='big' />
                        </div>
                    </div>
                </form>
            </div>
        {checkIfPatientExistsError && <div className='text-danger'>{t('common.error')}</div>}
        <ExternalUserEmergencyNote type={state.request.requestType}/>
    </div>
}

export default GetExternalUserDobZip;
