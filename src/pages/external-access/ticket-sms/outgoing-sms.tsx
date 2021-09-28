import {TicketMessage, UserBase} from '@shared/models';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import Avatar from '@components/avatar';
import utils from '@shared/utils/utils';

const OutgoingSms = ({message, users} : {message: TicketMessage, users?: UserBase[]}) => {
    const {t} = useTranslation();

    const user = users ? users.filter(a=> a.id === message.createdBy)[0] : undefined;

    return <div className='flex flex-row space-x-2'>
        <div className='pt-7 pl-4'>
            <Avatar userFullName={utils.stringJoin(' ', user?.firstName, user?.lastName)} userPicture={user?.profilePicture}/>
        </div>
        <div className='flex flex-col w-60'>
        <div className='flex flex-row pb-1 items-center pl-2'>
            <div className='body2 pr-4'>{t('external_access.ticket_sms.cwc_name', {
                'name': `${user?.firstName || ''} ${user?.lastName || ''}`
            })}</div>
            <div className='body3-small'>{dayjs.utc(message.createdOn).local().format('HH:mm A')}</div>
        </div>
            <div className='outgoing_sms pl-4 pr-2 pt-3 pb-4 rounded-b-md rounded-tr-md body2-white'>
                {message.body}
            </div>
        </div>
    </div>
}

export default OutgoingSms;
