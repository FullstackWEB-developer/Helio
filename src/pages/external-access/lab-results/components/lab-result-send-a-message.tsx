import Button from '@components/button/button';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import TextArea from '@components/textarea/textarea';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './lab-result-send-a-message.scss';
import {Controller, useForm} from 'react-hook-form';
import ControlledSelect from '@components/controllers/controlled-select';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {getProviders} from '@shared/services/lookups.service';
import {selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {Provider} from '@shared/models/provider';
import {Option} from '@components/option/option';
import utils from '@shared/utils/utils';
import {LabResultDetail} from '../models/lab-result-detail.model';
import {useMutation} from 'react-query';
import {createPatientCase} from '@pages/external-access/request-refill/services/request-refill.service';
import {PatientCaseDocumentSource, PatientCaseDocumentSubClass} from '@pages/external-access/request-refill/models/patient-case-external.model';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';

const LabResultSendAMessage = ({labResult}: {labResult?: LabResultDetail}) => {
    const {t} = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const maxMessageLength = 1000;
    const [message, setMessage] = useState('');
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const dispatch = useDispatch();
    const providers = useSelector(selectProviderList);

    useEffect(() => {
        dispatch(getProviders());
    }, [dispatch]);

    const onClose = () => {
        if (expanded) {
            setMessage('');
        }
        setExpanded(!expanded);
    }

    const providerOptions: Option[] = providers !== undefined ? providers?.map((item: Provider) => {
        return {
            value: item.id.toString(),
            label: item.displayName
        };
    }) : [];

    const getDefaultProvider = () => {
        if (verifiedPatient.defaultProviderId) {
            return providerOptions.find(p => p.value === verifiedPatient.defaultProviderId.toString())?.value;
        }
    }

    const {control, handleSubmit, errors} = useForm();
    const {isLoading, mutate} = useMutation(createPatientCase, {
        onSuccess: () => {
            setMessage('');
            setExpanded(false);
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'external_access.lab_results.message_success',
                position: SnackbarPosition.TopCenter
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.lab_results.message_error',
                position: SnackbarPosition.TopCenter
            }));
        }
    });

    const onSubmit = (data: any) => {
        const newLine = "\r\n";
        let internalNote = '';
        if (labResult && labResult.createdDateTime && labResult.description && utils.checkIfDateIsntMinValue(labResult.createdDateTime)) {
            internalNote = '** Lab Result';
            internalNote += newLine;
            internalNote += `${utils.formatDateShortMonth(labResult.createdDateTime.toString())}: ${labResult.description}`;
            internalNote += newLine;
            internalNote += newLine;
        }
        internalNote += `** Patient Note`;
        internalNote += newLine;
        internalNote += `${message}`;

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
    return (
        <div className='w-full px-6 py-3 lab-results-border'>
            <div className="flex flex-col md:flex-row items-center">
                <SvgIcon type={Icon.Chat} className='icon-large' fillClass='message-icon-fill' />
                <span className='subtitle pl-4'>{t('external_access.lab_results.send_a_message_title')}</span>
                <Button type="button" buttonType="link" label={t(!expanded ? 'external_access.lab_results.send_a_message' : 'common.close')}
                    className='body2 cursor-pointer md:ml-auto xl:pr-24'
                    onClick={onClose}/>
            </div>
            {
                expanded &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='body2 pt-4'>{t('external_access.lab_results.any_questions')}</div>
                    <div className='flex flex-col mt-9 w-full xl:w-7/12 h-28'>
                        <ControlledSelect
                            name='providerId'
                            control={control}
                            options={providerOptions}
                            defaultValue={getDefaultProvider()}
                            label={'external_access.lab_results.select_provider'}
                        />
                    </div>
                    <div className='flex flex-col w-full xl:w-7/12 h-28'>
                        <Controller
                            name='message'
                            control={control}
                            defaultValue={''}
                            render={() => (
                                <TextArea
                                    required={true}
                                    value={message}
                                    onChange={(m) => setMessage(m)}
                                    placeHolder={t('external_access.lab_results.text_area_placeholder')}
                                    className='w-full h-full'
                                    resizable={false}
                                    maxLength={maxMessageLength}
                                    error={errors.messageText?.message}
                                    maxLengthClassName={'subtitle3-small'} />
                            )}
                        />
                    </div>
                    <div className="flex pt-6 pb-10">
                        <>
                            <Button buttonType='secondary' label={t('common.cancel')} onClick={onClose} />
                            <span className="pl-6"/>
                            <Button type='submit' isLoading={isLoading} disabled={!message} label={t('common.send')} />
                        </>
                    </div>
                </form>
            }
        </div>
    );
}

export default LabResultSendAMessage;
