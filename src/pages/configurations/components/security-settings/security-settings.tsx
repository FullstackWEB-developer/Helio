import Button from "@components/button/button";
import { ControlledInput } from "@components/controllers";
import { useForm } from "react-hook-form";
import './security-settings.scss';
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { getSecuritySettings, saveSecuritySettings } from "@shared/services/lookups.service";
import { SecuritySettings } from "@pages/configurations/models/security-settings";
import { addSnackbarMessage } from "@shared/store/snackbar/snackbar.slice";
import { SnackbarType } from "@components/snackbar/snackbar-type.enum";
import Spinner from "@components/spinner/Spinner";
import { useDispatch } from "react-redux";
import { GetSecuritySettings } from "@constants/react-query-constants";
import {SecuritySettingsForm} from "@pages/configurations/models/security-settings-form";

const SecuritySettingsScreen = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { control, handleSubmit, formState : {isValid, isDirty}, reset } = useForm({ mode: 'all' })
    const { isFetching } = useQuery<SecuritySettings>(GetSecuritySettings, getSecuritySettings, {
        onSuccess: (response) => {
            reset({
                hipaaVerificationRetryNumber: response.hipaaVerificationRetryNumber,
                verifiedPatientExpiresInDays: response.verifiedPatientExpiresInDays,
                medicalRecordsDownloadExpirationInDays: response.medicalRecordsDownloadExpirationInDays,
                redirectLinkExpirationInHours: response.redirectLinkExpirationInHours,
                verificationFailWaitInMinutes: response.verificationFailWaitInMinutes,
                guestSmsExpirationInHours: response.guestSmsExpirationInHours
            })
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.security_settings.get_error',
                type: SnackbarType.Error
            }))
        }
    })
    const saveSecuritySettingsMuteation = useMutation(saveSecuritySettings);
    const onSubmit = (form: SecuritySettingsForm) => {
        const request: SecuritySettings = {
            hipaaVerificationRetryNumber: form.hipaaVerificationRetryNumber,
            verifiedPatientExpiresInDays: form.verifiedPatientExpiresInDays,
            medicalRecordsDownloadExpirationInDays: form.medicalRecordsDownloadExpirationInDays,
            redirectLinkExpirationInHours: form.redirectLinkExpirationInHours,
            verificationFailWaitInMinutes: form.verificationFailWaitInMinutes,
            guestSmsExpirationInHours: form.guestSmsExpirationInHours
        }
        saveSecuritySettingsMuteation.mutate(request, {
            onSuccess: () => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Success,
                    message: 'configuration.security_settings.save_success'
                }));
            },
            onError: () => {
                dispatch(addSnackbarMessage({
                    message: 'configuration.security_settings.save_error',
                    type: SnackbarType.Error
                }))
            }
        });
    }
    return (
        (isFetching ? <Spinner fullScreen={true} /> :
            <form onSubmit={handleSubmit(onSubmit)} className='w-10/12 overflow-auto h-full p-6'>
                <h5 className='pb-8'>{t('configuration.security_settings.title')}</h5>
                <div className="security-settings-grid mb-8">
                    <div>
                        <p className="subtitle2">{t('configuration.security_settings.hipaa_verification_retry_number_title')}</p>
                        <p className="body2-medium">{t('configuration.security_settings.hipaa_verification_retry_number_description')}</p>
                    </div>
                    <div className="flex flex-col body3-medium">
                        <ControlledInput
                            name="hipaaVerificationRetryNumber"
                            label="configuration.security_settings.hipaa_verification_retry_number_label"
                            control={control}
                            type={'number'}
                            defaultValue={0}
                        ></ControlledInput>
                        <label className="-mt-4 ml-4">{t('configuration.security_settings.hipaa_verification_retry_number_type')}</label>
                    </div>
                    <div>
                        <p className="subtitle2">{t('configuration.security_settings.verified_patient_expires_in_days_title')}</p>
                        <p className="body2-medium">{t('configuration.security_settings.verified_patient_expires_in_days_description')}</p>
                    </div>
                    <div className="flex flex-col body3-medium">
                        <ControlledInput
                            name="verifiedPatientExpiresInDays"
                            label="configuration.security_settings.verified_patient_expires_in_days_label"
                            control={control}
                            type={'number'}
                            defaultValue={0}
                        ></ControlledInput>
                        <label className="-mt-4 ml-4">{t('configuration.security_settings.verified_patient_expires_in_days_type')}</label>
                    </div>
                    <div>
                        <p className="subtitle2">{t('configuration.security_settings.verification_fail_wait_in_minutes_title')}</p>
                        <p className="body2-medium">{t('configuration.security_settings.verification_fail_wait_in_minutes_description')}</p>
                    </div>
                    <div className="flex flex-col body3-medium">
                        <ControlledInput
                            name="verificationFailWaitInMinutes"
                            label="configuration.security_settings.verification_fail_wait_in_minutes_label"
                            control={control}
                            type={'number'}
                            defaultValue={0}
                        ></ControlledInput>
                        <label className="-mt-4 ml-4">{t('configuration.security_settings.verification_fail_wait_in_minutes_type')}</label>
                    </div>
                    <div>
                        <p className="subtitle2">{t('configuration.security_settings.medical_records_download_expiration_in_days_title')}</p>
                        <p className="body2-medium">{t('configuration.security_settings.medical_records_download_expiration_in_days_description')}</p>
                    </div>
                    <div className="flex flex-col body3-medium">
                        <ControlledInput
                            name="medicalRecordsDownloadExpirationInDays"
                            label="configuration.security_settings.medical_records_download_expiration_in_days_label"
                            control={control}
                            type={'number'}
                            defaultValue={0}
                        ></ControlledInput>
                        <label className="-mt-4 ml-4">{t('configuration.security_settings.medical_records_download_expiration_in_days_type')}</label>
                    </div>
                    <div>
                        <p className="subtitle2">{t('configuration.security_settings.redirect_link_expiration_in_hours_title')}</p>
                        <p className="body2-medium">{t('configuration.security_settings.redirect_link_expiration_in_hours_description')}</p>
                    </div>
                    <div className="flex flex-col body3-medium">
                        <ControlledInput
                            name="redirectLinkExpirationInHours"
                            label="configuration.security_settings.redirect_link_expiration_in_hours_label"
                            control={control}
                            type={'number'}
                            defaultValue={0}
                        ></ControlledInput>
                        <label className="-mt-4 ml-4">{t('configuration.security_settings.redirect_link_expiration_in_hours_type')}</label>
                    </div>
                    <div>
                        <p className="subtitle2">{t('configuration.security_settings.guest_sms_expiration_in_hours_title')}</p>
                        <p className="body2-medium">{t('configuration.security_settings.guest_sms_expiration_in_hours_description')}</p>
                    </div>
                    <div className="flex flex-col body3-medium">
                        <ControlledInput
                            name="guestSmsExpirationInHours"
                            label="configuration.security_settings.guest_sms_expiration_in_hours_label"
                            control={control}
                            type={'number'}
                            defaultValue={0}
                        ></ControlledInput>
                        <label className="-mt-4 ml-4">{t('configuration.security_settings.guest_sms_expiration_in_hours_type')}</label>
                    </div>
                </div>
                <div className="flex flex-row">
                    <Button
                        type='submit'
                        buttonType='medium'
                        disabled={!isValid || !isDirty}
                        label='common.save'
                        isLoading={saveSecuritySettingsMuteation.isLoading}
                    />
                    <Button label='common.cancel'
                        className=' ml-8'
                        buttonType='secondary'
                        onClick={() => reset()}
                        isLoading={saveSecuritySettingsMuteation.isLoading}
                    />
                </div>
            </form>
        )

    );
}
export default SecuritySettingsScreen;
