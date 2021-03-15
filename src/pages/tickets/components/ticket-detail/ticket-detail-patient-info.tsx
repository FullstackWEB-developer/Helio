import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import Input from '../../../../shared/components/input/input';
import {getPatientById} from '../../../../shared/services/search.service';
import {
    selectIsPatientError,
    selectPatient,
    selectPatientLoading
} from '../../../patients/store/patients.selectors';
import ThreeDots from '../../../../shared/components/skeleton-loader/skeleton-loader';
import { ReactComponent as PatientChartIcon } from '../../../../shared/icons/Icon-PatientChart-24px.svg';
import Button from '../../../../shared/components/button/button';
import { updateTicket } from '../../services/tickets.service';

interface TicketDetailPatientInfoProps {
    ticket: Ticket
}

const TicketDetailPatientInfo = ({ ticket }: TicketDetailPatientInfoProps ) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { handleSubmit, control, errors } = useForm();
    const dispatch = useDispatch();

    const [formVisible, setFormVisible] = useState(true);
    const [isCaseNumberButtonsVisible, setIsCaseNumberButtonsVisible] = useState(false);
    const [patientCaseNumber, setPatientCaseNumber] = useState(ticket ? ticket.patientCaseNumber?.toString() : '');

    const loading = useSelector(selectPatientLoading);
    const error = useSelector(selectIsPatientError);
    const patient = useSelector(selectPatient);

    useEffect(() => {
        if (ticket && ticket.patientId){
            dispatch(getPatientById(ticket.patientId));
        }
    }, [dispatch, ticket]);

    const handleCaseNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCaseNumberButtonsVisible(true);
        setPatientCaseNumber(event.target.value);
    }

    const onSubmit = async () => {
        if (!patientCaseNumber) {
            return;
        }

        const ticketData: Ticket = {
            patientCaseNumber: parseInt(patientCaseNumber),
        };

        if (ticket && ticket.id) {
            await updateTicket(ticket.id, ticketData).then(() => {
                setIsCaseNumberButtonsVisible(false);
            });
        }
    }

    const resetForm = () => {
        setFormVisible(false);
        setTimeout(() => {
            setFormVisible(true);
            setPatientCaseNumber(ticket.patientCaseNumber?.toString());
            setIsCaseNumberButtonsVisible(false);
        }, 0);
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        <div hidden={!loading}>
            <ThreeDots />
        </div>
        {
            !loading && !error && patient
            ?
                <div>
                    <dl>
                        <div className='sm:grid sm:grid-cols-2'>
                            <dt className='subtitle2'>
                                {t('ticket_detail.info_panel.contact_name')}
                            </dt>
                            <dd className='body2'>
                                {patient.firstName} {patient.lastName}
                            </dd>
                            <dt className='subtitle2 py-1'>
                                {t('ticket_detail.info_panel.patient_id')}
                            </dt>
                            <dd className='body2 flex flex-row'>
                                <span className='py-1'>{ticket?.patientId}</span>
                                <PatientChartIcon className='h-8 w-8 pl-2 cursor-pointer' onClick={() => history.push('/patients/' + ticket.patientId)}/>
                            </dd>
                        </div>
                    </dl>
                    {formVisible &&
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name='patientCaseNumber'
                                control={control}
                                defaultValue=''
                                render={(props) => (
                                    <Input
                                        {...props}
                                        type='number'
                                        label={'ticket_detail.info_panel.patient_case_number'}
                                        data-test-id={'ticket-detail-info_panel-patient-case-number'}
                                        className={'w-full h-14'}
                                        value={patientCaseNumber ? patientCaseNumber : ''}
                                        error={errors.patientCaseNumber?.message}
                                        onChange={((e) => handleCaseNumberChange(e))}
                                    />
                                )}
                            />

                            {isCaseNumberButtonsVisible &&
                                <div className='flex flex-row space-x-4 justify-end bg-secondary-50 mt-2'>
                                    <div className='flex items-center'>
                                        <Button data-test-id='ticket-detail-case-number-cancel-button'
                                                type={'button'}
                                                buttonType='secondary'
                                                label={'common.cancel'}
                                                onClick={() => resetForm()}
                                        />
                                    </div>
                                    <div>
                                        <Button data-test-id='ticket-detail-case-number-save-button'
                                                type={'submit'}
                                                buttonType='small'
                                                label={'common.save'}/>
                                    </div>
                                </div>
                            }
                        </form>
                    }
                </div>
            :
                <div hidden={loading || error} className={'p-4'}>
                    <span className={'h6'}>{t('patient.not_found')}</span>
                </div>
        }

    </div>
}

export default withErrorLogging(TicketDetailPatientInfo);
