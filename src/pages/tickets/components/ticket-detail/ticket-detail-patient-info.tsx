import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {Controller, useForm} from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import Input from '../../../../shared/components/input/input';
import {selectIsPatientError, selectPatientLoading} from '@pages/patients/store/patients.selectors';
import ThreeDots from '../../../../shared/components/skeleton-loader/skeleton-loader';
import Button from '../../../../shared/components/button/button';
import {updateTicket} from '../../services/tickets.service';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import Logger from '../../../../shared/services/logger';
import {Patient} from '@pages/patients/models/patient';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';

interface TicketDetailPatientInfoProps {
    ticket: Ticket,
    patient?: Patient
}

const TicketDetailPatientInfo = ({ticket, patient}: TicketDetailPatientInfoProps) => {
    const {t} = useTranslation();
    const history = useHistory();
    const {handleSubmit, control, errors} = useForm();
    const dispatch = useDispatch();

    const [formVisible, setFormVisible] = useState(true);
    const [isCaseNumberButtonsVisible, setIsCaseNumberButtonsVisible] = useState(false);
    const [patientCaseNumber, setPatientCaseNumber] = useState(ticket ? ticket.patientCaseNumber?.toString() : '');
    const logger = Logger.getInstance();

    const loading = useSelector(selectPatientLoading);
    const error = useSelector(selectIsPatientError);

    const updateTicketMutation = useMutation(updateTicket, {
        onSuccess: (data) => {
            setIsCaseNumberButtonsVisible(false);
            dispatch(setTicket(data));
        },
        onError: (error) => {
            logger.error('Error updating ticket', error);
        }
    });

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
            updateTicketMutation.mutate({id: ticket.id, ticketData});
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
                                <SvgIcon type={Icon.PatientChart}
                                     className='medium h-8 w-8 pl-2 cursor-pointer'
                                     fillClass='active-item-icon'
                                     onClick={() => history.push('/patients/' + ticket.patientId)}/>
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
