import {useQuery} from 'react-query';
import {
    GetPatientPhoto,
    QueryGetPatientById,
    QueryTicketMessagesInfinite,
    UserListBaseData
} from '@constants/react-query-constants';
import {ChannelTypes, EmailMessageDto, PagedList} from '@shared/models';
import {getMessages} from '@pages/sms/services/ticket-messages.service';
import utils from '@shared/utils/utils';
import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import Spinner from '@components/spinner/Spinner';
import {getPatientByIdWithQuery, getPatientPhoto} from '@pages/patients/services/patients.service';
import {selectExternalEmailSummaries} from '@pages/external-access/external-email/store/external-email.selectors';
import {getUserBaseData} from '@shared/services/user.service';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import {useTranslation} from 'react-i18next';
import ExternalEmailListItem from '@pages/external-access/external-email/components/external-email-list-item';
import ExternalEmailMessageDetail from '@pages/external-access/external-email/components/external-email-message-detail';
import {setExternalEmails} from '@pages/external-access/external-email/store/external-email.slice';
import dayjs from 'dayjs';
import SvgIcon, {Icon} from '@components/svg-icon';
import {
    RealtimeTicketMessageContext
} from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-context';

const ExternalEmail = () => {
    const [page, setPage] = useState<number>(1);
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const request = useSelector(selectRedirectLink);
    const [userIds, setUserIds] = useState<string[]>();
    const messages = useSelector(selectExternalEmailSummaries);
    const [isBottomFocus, setBottomFocus] = useState<boolean>(false);
    const {t} = useTranslation();
    const {lastMessageDate} = useContext(RealtimeTicketMessageContext)!;

    const getTime = (date?: Date) => {
        return date ? dayjs.utc(date).toDate().getTime() : 0;
    }

    const {data: patientPhoto} = useQuery([GetPatientPhoto, verifiedPatient?.patientId], () => getPatientPhoto(verifiedPatient.patientId!), {
        enabled: !!verifiedPatient?.patientId
    });

    const {data: patient} = useQuery([QueryGetPatientById, verifiedPatient?.patientId], () => getPatientByIdWithQuery(verifiedPatient.patientId!), {
        enabled: !!verifiedPatient?.patientId
    });

    const {isLoading, refetch} = useQuery([QueryTicketMessagesInfinite, ChannelTypes.Email, request?.ticketId, page],
        () => getMessages(request?.ticketId, ChannelTypes.Email, {
            page,
            pageSize: 100,
        }), {
        enabled: !!request?.ticketId,
        onSuccess: (data: PagedList<EmailMessageDto>) => {
            setBottomFocus(true);
            dispatch(setExternalEmails(data.results));
            if (page < data.totalPages) {
                setPage(page + 1);
            } else {
                let userIds = data.results.map(message => message.createdBy);
                userIds = userIds
                    .filter(function (v, i) {return userIds.indexOf(v) === i;})
                    .filter(a => utils.isGuid(a));
                setUserIds(userIds);
            }
        }
    });

    useEffect(() => {
        refetch().then();
    }, [lastMessageDate]);

    const {data: users, refetch: refetchUsers} = useQuery([UserListBaseData, userIds],
        () => {
            return getUserBaseData(userIds!, {
                page: 1,
                pageSize: 100,
            })
        }, {
        enabled: !!userIds && userIds.length > 0
    });

    useEffect(() => {
        if (messages && messages.length > 0) {
            let newUserIds = messages.map(message => message.createdBy);
            newUserIds = newUserIds
                .filter(function (v, i) {
                    return newUserIds.indexOf(v) === i;
                })
                .filter(a => utils.isGuid(a));
            if (userIds) {
                refetchUsers().then();
            }
            setUserIds(userIds);
            setFocus();
        }
    }, [messages]);


    const setFocus = () => {
        setBottomFocus(false);
        setTimeout(() => {
            setBottomFocus(true);
        })
    }

    const [selectedMessage, setSelectedMessage] = useState<EmailMessageDto | undefined>();


    if (isLoading) {
        return <div className='h-full w-full'>
            <Spinner fullScreen={true} />
        </div>
    }
    return <div>
        <AlwaysScrollToBottom enabled={isBottomFocus} />
        <div className='h-14 border-b flex items-center'>
            <div className='flex-1'>
                {
                    selectedMessage &&
                    <SvgIcon wrapperClassName='px-2 cursor-pointer flex-1' fillClass='rgba-05-fill' type={Icon.ArrowBack} onClick={() => setSelectedMessage(undefined)} />
                }
            </div>
            <div className='flex-auto text-center'>{t('external_access.email.title')}</div>
            <div className='flex-1'></div>
        </div>
        {
            selectedMessage ?
                <ExternalEmailMessageDetail patientPhoto={patientPhoto} message={selectedMessage} patient={patient} users={users?.results} /> :
                <div className='px-4'>
                    {[...messages].sort((a: EmailMessageDto, b: EmailMessageDto) => getTime(b.createdOn) - getTime(a.createdOn)).map(message => <ExternalEmailListItem
                        patientPhoto={patientPhoto}
                        users={users?.results}
                        message={message}
                        patient={patient}
                        key={message.id}
                        onClick={setSelectedMessage} />)
                    }
                </div>
        }
    </div>
}

export default ExternalEmail;
