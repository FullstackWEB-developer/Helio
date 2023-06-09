import { Icon } from '@components/svg-icon';
import utils from '@shared/utils/utils';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import React, { useRef} from 'react';
import { useTranslation } from 'react-i18next';
import {Link} from 'react-router-dom';

const MedicationRefillNotAllowed = () => {

    const tooltipFollowUpAppointmentDiv = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const scheduleAppointmentLink = '/o/appointment-schedule';

    return <div className='flex items-center'>
        <div className='pt-1'>
            {t('external_access.medication_refill.medication_list.refill_not_available')}
        </div>
        <div ref={tooltipFollowUpAppointmentDiv} className='pt-1 pl-2.5'>
            <ToolTipIcon
                icon={Icon.Info}
                iconFillClass='rgba-05-fill'
                placement='bottom-start'
            >
                <div className='follow-up-appointment px-6 pt-6 pb-9'>
                    <div className='subtitle2 pb-3'>
                        {t('external_access.medication_refill.medication_list.new_prescription_needed')}
                    </div>
                    <div className='body2 pb-2.5'>
                        {t('external_access.medication_refill.medication_list.you_ran_out')}
                    </div>
                    <div className='body2 message-link cursor-pointer pb-5'>
                        <Link to={scheduleAppointmentLink}>{t('external_access.medication_refill.medication_list.schedule_appointment_online')}</Link>
                    </div>
                    <div className='body2 message-link cursor-pointer'>
                        <a rel='noreferrer' target='_blank' href={utils.getAppParameter('ChatLink')}>{t('external_access.medication_refill.medication_list.chat_with_us')}</a>
                    </div>
                </div>
            </ToolTipIcon>
        </div>
    </div>
}

export default MedicationRefillNotAllowed;
