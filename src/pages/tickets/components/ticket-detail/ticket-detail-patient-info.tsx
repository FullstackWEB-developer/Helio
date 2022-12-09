import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Control, Controller } from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import Input from '../../../../shared/components/input/input';
import {
  selectIsPatientError,
  selectPatientLoading,
} from '@pages/patients/store/patients.selectors';
import { Patient } from '@pages/patients/models/patient';
import { Icon } from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import Spinner from '@components/spinner/Spinner';
import { TicketUpdateModel } from '@pages/tickets/models/ticket-update.model';
import { selectTicketUpdateModel } from '@pages/tickets/store/tickets.selectors';
import { setTicketUpdateModel } from '@pages/tickets/store/tickets.slice';
import { Link } from 'react-router-dom';
import Select from '@components/select/select';
import { Option } from '@components/option/option';
import { ControlledSelect } from '@components/controllers';

interface TicketDetailPatientInfoProps {
  ticket: Ticket;
  patient?: Patient;
  patientCasesOptions?: Option[];
  control: Control<TicketUpdateModel>;
  isPatientCasesLoading?: boolean;
  errorMessage: string | undefined;
  onPatientCaseFocus?: () => void;
}

const TicketDetailPatientInfo: FC<TicketDetailPatientInfoProps> = ({
  ticket,
  patient,
  control,
  isPatientCasesLoading,
  errorMessage,
  patientCasesOptions = [],
  onPatientCaseFocus,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loading = useSelector(selectPatientLoading);
  const error = useSelector(selectIsPatientError);
  const updateModel = useSelector(selectTicketUpdateModel);

  const handleCaseNumberChange = (value: string) => {
    dispatch(
      setTicketUpdateModel({
        ...updateModel,
        patientCaseNumber: Number(value),
      }),
    );
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <div className={'py-4 mx-auto flex flex-col'}>
      {!error && patient ? (
        <div>
          <dl>
            <div className='sm:grid sm:grid-cols-2'>
              <dt className='subtitle2'>
                {t('ticket_detail.info_panel.patient_name')}
              </dt>
              <dd className='body2'>
                {patient.firstName} {patient.lastName}
              </dd>
              <dt className='subtitle2 py-1'>
                {t('ticket_detail.info_panel.patient_id')}
              </dt>
              <dd className='body2 flex flex-row'>
                <span className='py-1 pr-2'>{ticket?.patientId}</span>
                <Link to={'/patients/' + ticket.patientId}>
                  <SvgIcon
                    type={Icon.PatientChart}
                    className='icon-medium'
                    fillClass='success-icon'
                  />
                </Link>
              </dd>
            </div>
          </dl>

          <ControlledSelect
            name='patientCaseNumber'
            label='ticket_detail.info_panel.patient_case_number'
            options={patientCasesOptions}
            allowClear={true}
            control={control}
            isLoading={isPatientCasesLoading}
            onFocus={onPatientCaseFocus}
            onTextChange={handleCaseNumberChange}
            onSelect={option => handleCaseNumberChange(option?.value ?? '')}
          />
        </div>
      ) : (
        <div hidden={loading || error} className={'p-4'}>
          <span className={'h6'}>{t('patient.not_found')}</span>
        </div>
      )}
    </div>
  );
};

export default withErrorLogging(TicketDetailPatientInfo);
