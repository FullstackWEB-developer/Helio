import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Control, Controller} from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import Input from '../../../../shared/components/input/input';
import {selectIsPatientError, selectPatientLoading} from '@pages/patients/store/patients.selectors';
import {Patient} from '@pages/patients/models/patient';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';

import Spinner from '@components/spinner/Spinner';
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';
import {selectTicketUpdateModel} from '@pages/tickets/store/tickets.selectors';
import {setTicketUpdateModel} from '@pages/tickets/store/tickets.slice';
import useCtrlHistory from '@shared/hooks/useCtrlHistory';

interface TicketDetailPatientInfoProps {
    ticket: Ticket,
    patient?: Patient,
    control: Control<TicketUpdateModel>,
    isPatientCaseNumberLoading: boolean,
    errorMessage: string | undefined,
    validatePatientCaseNumber: () => void
}

const TicketDetailPatientInfo = ({ticket, patient, control, isPatientCaseNumberLoading,
    errorMessage, validatePatientCaseNumber}: TicketDetailPatientInfoProps) => {
    const {t} = useTranslation();
    const useHistory = useCtrlHistory();
    const dispatch = useDispatch();

    const loading = useSelector(selectPatientLoading);
    const error = useSelector(selectIsPatientError);
    const updateModel = useSelector(selectTicketUpdateModel);
    const handleCaseNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            patientCaseNumber: Number(event.target.value)
        }));
    }

    if (loading) {
        return <Spinner fullScreen />
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        {
            !error && patient
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
                                    className='icon-medium h-8 w-8 pl-2 cursor-pointer'
                                    fillClass='active-item-icon'
                                    onClick={() => useHistory.push('/patients/' + ticket.patientId)} />
                            </dd>
                        </div>
                    </dl>

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
                                isLoading={isPatientCaseNumberLoading}
                                value={updateModel.patientCaseNumber ? String(updateModel.patientCaseNumber) : ''}
                                error={errorMessage}
                                onChange={((e) => handleCaseNumberChange(e))}
                                onBlur={validatePatientCaseNumber}
                            />
                        )}
                    />

                </div>
                :
                <div hidden={loading || error} className={'p-4'}>
                    <span className={'h6'}>{t('patient.not_found')}</span>
                </div>
        }
    </div>
}

export default withErrorLogging(TicketDetailPatientInfo);
