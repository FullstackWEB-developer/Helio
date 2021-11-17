import {TicketMessage, TicketMessagesDirection} from '@shared/models';
import utils from '@shared/utils/utils';
import dayjs from 'dayjs';
import SmsChatMessage from './sms-chat-message';
import HorizontalLine from '@components/horizontal-line';
import {messageSort, messageRelativeTimeFormat} from '../../utils';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import {useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
dayjs.extend(utc);

interface MessageListProps {
    messages: TicketMessage[];
    patientPhoto?: string;
}

const SmsChatMessageList = ({messages, patientPhoto}: MessageListProps) => {
    const users = useSelector(selectUserList);

    const getAgentInfo = (userId: string) => {
        return users.find(user => user.id === userId);
    }

    const messagesSorted = messageSort(messages);

    const messagesGrouped = utils.groupBy(messagesSorted, (item) => dayjs.utc(item.createdOn).local().startOf('d').toISOString());
    const component: JSX.Element[] = [];
    let indexGrouped = 0;
    messagesGrouped.forEach((value, key) => {
        const line = (
            <HorizontalLine
                text={messageRelativeTimeFormat(dayjs.utc(key).local())}
                wrapperClassName="py-6"
            />
        );
        const messagesComp = value.map((item) => {
            const isTop = indexGrouped === 0;
            indexGrouped = indexGrouped + 1;
            const agent = getAgentInfo(item.createdBy);
            return (
                <SmsChatMessage
                    isTheTop={isTop}
                    agent={agent}
                    isNameVisible
                    isPhotoVisible
                    photoProfileUrl={agent?.profilePicture}
                    name={(item.createdName || item.createdBy) ?? ''}
                    body={item.body}
                    date={item.createdOn}
                    patientPhoto={patientPhoto}
                    isOutGoing={item.direction === TicketMessagesDirection.Outgoing}
                />
            );

        });

        component.push(line, ...messagesComp);
    });
    return <> {React.Children.toArray(component)} </>;
}

export default React.memo(SmsChatMessageList);
