import React, {useState} from 'react';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import TextArea from '@components/textarea/textarea';
import './send-us-message.scss';
import Button from '@components/button/button';
import {useMutation} from 'react-query';
import {createPatientCase} from '@pages/external-access/request-refill/services/request-refill.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {
    PatientCaseDocumentSource,
    PatientCaseDocumentSubClass
} from '@pages/external-access/request-refill/models/patient-case-external.model';
import {selectProviderList} from '@shared/store/lookups/lookups.selectors';
import Spinner from '@components/spinner/Spinner';
import {Option} from '@components/option/option';
import {Provider} from '@shared/models/provider';
import {ControlledSelect} from '@components/controllers';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';

const SendUsMessage = () => {
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const [isVisibleForm, setIsVisibleForm] = useState(false);
    const {handleSubmit, control, errors, formState: {isValid}} = useForm({mode: 'onChange'});
    const [messageText, setMessageText] = useState('');
    const dispatch = useDispatch();
    const maxLength = 1000;
    const providers = useSelector(selectProviderList);

    const {isLoading, isError, mutate} = useMutation(createPatientCase, {
        onSuccess: () => {
            setMessageText('');
            setIsVisibleForm(false);
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'external_access.medication_refill.message_success',
                position: SnackbarPosition.TopCenter
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.medication_refill.message_error',
                position: SnackbarPosition.TopCenter
            }));
        }
    });

    const getMarginBottom = () => {
        return (isLoading || isError) ? ' mb-1.5' : ' mb-10'
    }

    const getMessageText = () => {
        if (messageText.length > maxLength) {
            return messageText.slice(maxLength);
        }
        return messageText;
    }

    const onSubmit = (data: any) => {
        let internalNote = `** PATIENT NOTE: \n ${getMessageText()} \n `;
        internalNote += `ProviderId: ${data.providerId}`;

        mutate({
            patientId: verifiedPatient.patientId,
            patientCaseExternal: {
                departmentId: verifiedPatient.defaultDepartmentId,
                providerId: data.providerId,
                internalNote: internalNote,
                ignoreNotification: false,
                documentSubClass: PatientCaseDocumentSubClass.ClinicalQuestion,
                documentSource: PatientCaseDocumentSource.Patient
            }
        });
    }

    const closeButtonHandler = () => {setIsVisibleForm(!isVisibleForm); setMessageText('')}

    const providerOptions: Option[] = providers !== undefined ? providers?.map((item: Provider) => {
        return {
            value: item.id.toString(),
            label: item.displayName
        };
    }) : [];
    const defaultProvider = providerOptions.find(p => p.value === String(verifiedPatient?.defaultProviderId))?.value;

    if (providers?.length === 0) {
        return <div className='py-2'><Spinner /></div>
    }

    return isVisibleForm ? <div className='border mb-12'>
        <div className='flex flex-row justify-between px-6 py-4 lg:pr-28'>
            <div className='flex flex-row'>
                <SvgIcon type={Icon.Chat} fillClass='rgba-05-fill' />
                <div className='subtitle pl-4.5'>
                    {t('external_access.medication_refill.have_questions')}
                </div>
            </div>
            <div className='body2 message-link cursor-pointer lg:pr-2' onClick={closeButtonHandler}>
                {t('common.close')}
            </div>
        </div>
        <div className='body2 px-6'>
            {t('external_access.medication_refill.message_your_provider')}
        </div>
        <div className='mx-6 my-6'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full send-message">
                <div className='flex flex-col mt-9 w-full xl:w-7/12 h-28'>
                    <ControlledSelect
                        name='providerId'
                        control={control}
                        required={true}
                        options={providerOptions}
                        defaultValue={defaultProvider}
                        label={'external_access.lab_results.select_provider'}
                    />
                </div>
                <TextArea
                    error={errors.messageText?.message}
                    className='pl-4 pt-2 pb-11 pr-8 body2 w-full h-full'
                    data-test-id='send-us-message-text'
                    placeHolder={t('common.enter_your_message')}
                    required={true}
                    rows={5}
                    maxRows={5}
                    resizable={false}
                    value={messageText}
                    hasBorder={true}
                    maxLength={maxLength}
                    isLoading={isLoading}
                    onChange={(message) => setMessageText(message)}
                />
                <div className={`flex justify-start items-center full-w mt-3 ${getMarginBottom()}`}>
                    <Button buttonType='secondary' label={t('common.cancel')} className='h-10 secondary-contact-form-btn' onClick={closeButtonHandler} />
                    <Button type='submit' isLoading={isLoading} buttonType='medium' label={t('common.send')} className='ml-6' disabled={!isValid || !messageText} />
                </div>
                {
                    isError && <div className='text-danger'>
                        {t('external_access.message_send_failed')}
                    </div>
                }
            </form>
        </div>
    </div> :
    <div className='border mb-12'>
        <div className='flex flex-row justify-between px-6 py-4 lg:pr-28'>
            <div className='flex flex-row'>
                <SvgIcon type={Icon.Chat} fillClass='rgba-05-fill' />
                <div className='subtitle pl-4.5'>
                    {t('external_access.medication_refill.have_questions')}
                </div>
            </div>
            <div className='body2 message-link cursor-pointer lg:pr-2' onClick={() => setIsVisibleForm(!isVisibleForm)}>
                {t('external_access.send_us_message')}
            </div>
        </div>
    </div>
}

export default SendUsMessage;
