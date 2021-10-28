import {TicketMessage, TicketMessagesDirection} from '@shared/models';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import classNames from 'classnames';
import React from 'react';
import Linkify from 'react-linkify';

const IncomingSms = ({message} : {message: TicketMessage}) => {
    const {t} = useTranslation();
    const className = classNames('flex', {
        'justify-start' : message.direction === TicketMessagesDirection.Outgoing,
        'justify-end' : message.direction === TicketMessagesDirection.Incoming
    })

    return <div className={className}>
        <div className='flex flex-col w-60 px-4'>
            <div className='flex flex-row items-center w-full justify-end px-4'>
                <div className='body2 pr-1'>{t('external_access.ticket_sms.me')}</div>
                <div className='body3-small'>{dayjs.utc(message.createdOn).local().format('HH:mm A')}</div>
            </div>
            <div className='incoming_sms pl-4 pr-4 pt-3 pb-4 body2 rounded-b-md rounded-tl-md'>
                <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a target="blank" href={decoratedHref} key={key}>
                            {decoratedText}
                        </a>
                    )}
                >{message.body}</Linkify>
            </div>
        </div>
    </div>
}

export default IncomingSms;
