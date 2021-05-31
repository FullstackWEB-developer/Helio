import React, {useState} from 'react';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';
import TextArea from '@components/textarea/textarea';
import './send-us-message.scss';
import Button from '@components/button/button';
import {useMutation} from 'react-query';
import {createPatientCase} from '@pages/external-access/request-refill/services/request-refill.service';
import {useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {
    PatientCaseDocumentSource,
    PatientCaseDocumentSubClass
} from '@pages/external-access/request-refill/models/patient-case-external.model';
import ThreeDotsSmallLoader from '@components/skeleton-loader/three-dots-loader';

const SendUsMessage = () => {
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const [isVisibleForm, setIsVisibleForm] = useState(false);
    const {handleSubmit, control, errors} = useForm();
    const [messageText, setMessageText] = useState('');
    const maxLength = 1000;

    const {isLoading, isError, mutate} = useMutation(createPatientCase, {
        onSuccess: () => {
            setMessageText('');
            setIsVisibleForm(false);
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

    const onSubmit = () => {
        let internalNote = `** Patient Note \n ${getMessageText()} \n `;
        internalNote += `ProviderId: ${verifiedPatient.defaultProviderId}`;

        mutate({
            patientId: verifiedPatient.patientId,
            patientCaseExternal: {
                departmentId: verifiedPatient.defaultDepartmentId,
                providerId: verifiedPatient.defaultProviderId,
                internalNote: internalNote,
                ignoreNotification: false,
                documentSubClass: PatientCaseDocumentSubClass.PatientCase,
                documentSource: PatientCaseDocumentSource.Portal
            }
        });
    }

    const closeButtonHandler = () => setIsVisibleForm(!isVisibleForm);

    return isVisibleForm ? <div className='border mb-12'>
        <div className='flex flex-row justify-between px-6 py-4 lg:pr-28'>
            <div className='flex flex-row'>
                <SvgIcon type={Icon.Chat} fillClass='rgba-05-fill'/>
                <div className='subtitle pl-4.5'>
                    {t('external_access.medication_refill.have_questions')}
                </div>
            </div>
            <div className='body2 cursor-pointer lg:pr-2' onClick={closeButtonHandler}>
                {t('common.close')}
            </div>
        </div>
        <div className='body2 px-6'>
            {t('external_access.medication_refill.message_your_provider')}
        </div>
        <div className='mx-6 mt-6 mb-28'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full send-message h-28">
                <Controller
                    name='messageText'
                    control={control}
                    defaultValue={''}
                    render={() => (
                        <TextArea
                            error={errors.messageText?.message}
                            className='pl-4 pt-2 pb-11 pr-8 body2 w-full h-full'
                            data-test-id='send-us-message-text'
                            placeHolder={t('common.enter_your_message')}
                            required={true}
                            rows={2}
                            resizable={false}
                            value={messageText}
                            hasBorder={true}
                            maxLength={maxLength}
                            onChange={(message) => setMessageText(message)}
                            iconClassNames='medium cursor-pointer'
                            iconOnClick={() => {
                                handleSubmit(onSubmit)()
                            }}
                        />
                    )}
                />
                <div className={`flex justify-start items-center full-w mt-3 ${getMarginBottom()}`}>
                    <Button buttonType='secondary' label={t('common.cancel')} className='h-10 secondary-contact-form-btn' onClick={closeButtonHandler} />
                    <Button type='submit' buttonType='medium' label={t('common.send')} className='ml-6' disabled={!messageText || isLoading} />
                </div>
                {
                    isLoading && <div className='h-8 w-20'>
                        <ThreeDotsSmallLoader className="three-dots-loader-small" cx={13} cxSpace={23} cy={16}/>
                    </div>
                }
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
                <SvgIcon type={Icon.Chat} fillClass='rgba-05-fill'/>
                <div className='subtitle pl-4.5'>
                    {t('external_access.medication_refill.have_questions')}
                </div>
            </div>
            <div className='body2 cursor-pointer lg:pr-2' onClick={() => setIsVisibleForm(!isVisibleForm)}>
                {t('external_access.send_us_message')}
            </div>
        </div>
    </div>
}

export default SendUsMessage;
