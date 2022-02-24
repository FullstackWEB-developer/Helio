import {EmailMessageDto, TicketMessagesDirection, UserBase} from '@shared/models';
import Avatar from '@components/avatar';
import React, {useMemo} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import SvgIcon, {Icon} from '@components/svg-icon';
import {useTranslation} from 'react-i18next';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import './external-email-list-item.scss';

export interface ExternalEmailListItemProps {
    message: EmailMessageDto,
    patientPhoto?: string;
    users?: UserBase[];
    patient?: ExtendedPatient;
    onClick: (message: EmailMessageDto) => void
}

const ExternalEmailListItem = ({message, patientPhoto, users, patient, onClick} : ExternalEmailListItemProps) => {
    dayjs.extend(utc);
    dayjs.extend(isToday);
    const {t} = useTranslation();

    const user = useMemo(() => {
        if (message.direction === TicketMessagesDirection.Outgoing) {
            return users?.find(a => a.id === message.createdBy);
        }
    }, [message.createdBy, message.direction, users]);

    const displayName = useMemo(() =>{
        if(message.direction=== TicketMessagesDirection.Outgoing) {
            return message.createdByName;
        }
        if (!!message.createdForName) {
            return message.createdForName;
        }
        return message.fromAddress;
    }, [message, message.createdForName]);

    const emailDate = useMemo(() => {
        const messageSendAt = message.createdOn;
        if (dayjs(messageSendAt).isToday()) {
            return dayjs.utc(messageSendAt).local().format('hh:mm A');
        } else {
            return dayjs.utc(messageSendAt).local().format('MMM D');
        }
    }, [message.createdOn]);

    const photo = useMemo(() => {
        if(message.direction=== TicketMessagesDirection.Outgoing) {
            return <Avatar userId={message.createdByName}
                    userFullName={message.createdByName}
                    userPicture={user?.profilePicture} />
        }
        if (message.direction === TicketMessagesDirection.Incoming) {
            if (patientPhoto) {
                return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                            src={`data:image/jpeg;base64,${patientPhoto}`} />;
            }
            if (!!patient || !!message.contactId) {
                return <Avatar userFullName={displayName}/>
            }
        }
        return <Avatar userFullName={'#'} />

    }, [message, patientPhoto, user, patient]);

    return <div className='flex flex-row items-center border-b space-x-4 external-email-list-item cursor-pointer' onClick={() => onClick(message)}>
        <div>
            {photo}
        </div>
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between items-center w-full'>
                <div className='subtitle2'>
                    <span className={!message.isRead ? 'font-bold' : ''}>{displayName}</span>
                </div>
                <div className='flex flex-row'>
                    {message.attachments && message.attachments.length > 0 && <div>
                        <SvgIcon type={Icon.Attachment} className="icon-small" fillClass="rgba-06-fill"  />
                    </div>}
                    <div className='body3-medium flex items-center w-16 justify-end'>
                        {emailDate}
                    </div>
                </div>
            </div>
            <div className='body2 w-60 md:w-96 xl:w-full break-words'>
                {message.subject}
            </div>
        </div>
    </div>
}

export default ExternalEmailListItem;
