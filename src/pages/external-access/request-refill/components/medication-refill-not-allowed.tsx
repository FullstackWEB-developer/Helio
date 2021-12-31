import SvgIcon, {Icon} from '@components/svg-icon';
import Tooltip from '@components/tooltip/tooltip';
import utils from '@shared/utils/utils';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

const MedicationRefillNotAllowed = () => {

    const followUpAppointmentIcon = useRef(null);
    const [displayFollowUpAppointment, setDisplayFollowUpAppointment] = useState<boolean>(false);
    const tooltipFollowUpAppointmentDiv = useRef<HTMLDivElement>(null);
    const {t} = useTranslation();
    const scheduleAppointmentLink = '/o/appointment-schedule';

    return  <div className='flex items-center'>
                <div className='pt-1'>
                    {t('external_access.medication_refill.medication_list.refill_not_available')}
                </div>
                <div ref={tooltipFollowUpAppointmentDiv} className='pt-1 pl-2.5'>
                <div ref={followUpAppointmentIcon}
                     onClick={() => setDisplayFollowUpAppointment(!displayFollowUpAppointment)} className='cursor-pointer'>
                    <SvgIcon type={Icon.Info} fillClass='rgba-05-fill' />
                </div>
                <Tooltip targetRef={followUpAppointmentIcon} isVisible={displayFollowUpAppointment} placement='bottom-start'>
                    <div className='follow-up-appointment px-6 pt-6 pb-9'>
                        <div className='subtitle2 pb-3'>
                            {t('external_access.medication_refill.medication_list.new_prescription_needed')}
                        </div>
                        <div className='body2 pb-2.5'>
                            {t('external_access.medication_refill.medication_list.you_ran_out')}
                        </div>
                        <div className='body2 message-link cursor-pointer pb-5'>
                            <a rel='noreferrer' target='_self' href={scheduleAppointmentLink}>{t('external_access.medication_refill.medication_list.schedule_appointment_online')}</a>
                        </div>
                        <div className='body2 message-link cursor-pointer'>
                            <a rel='noreferrer' target='_self' href={utils.getAppParameter('ChatLink')}>{t('external_access.medication_refill.medication_list.chat_with_us')}</a>
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
}

export default MedicationRefillNotAllowed;
