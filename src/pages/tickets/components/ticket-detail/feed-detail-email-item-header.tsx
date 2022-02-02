import Avatar from "@components/avatar";
import {DropdownItemModel} from "@components/dropdown";
import MoreMenu from "@components/more-menu";
import SvgIcon, {Icon} from "@components/svg-icon";
import React from "react";
import {useTranslation} from "react-i18next";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useMutation, useQuery} from "react-query";
import {downloadAttachments, splitTicket} from "@pages/sms/services/ticket-messages.service";
import {SnackbarType} from "@components/snackbar/snackbar-type.enum";
import {useDispatch, useSelector} from "react-redux";
import {addSnackbarMessage} from "@shared/store/snackbar/snackbar.slice";
import Spinner from "@components/spinner/Spinner";
import {EmailMessageDto, TicketMessagesDirection} from "@shared/models";
import {MimeTypes} from "@shared/models/mime-types.enum";
import {TicketsPath} from '@app/paths';
import {useHistory} from 'react-router-dom';
import {MORE_MENU_OPTION_SPLIT_TICKET} from '@pages/sms/constants';
import classnames from 'classnames';
import {selectPatientPhoto} from '@pages/tickets/store/tickets.selectors';

interface FeedDetailEmailHeaderItemProps {
    message: EmailMessageDto;
    from: string;
    collapseHandler: () => void,
    collapsed: boolean,
    feedTime: string;
    isHover: boolean;
}
const FeedDetailEmailHeaderItem = ({message, isHover, from, collapsed, collapseHandler, feedTime}: FeedDetailEmailHeaderItemProps) => {
    const dispatch = useDispatch();
    const attachmentsCount = message.attachments?.length ?? 0;
    dayjs.extend(relativeTime);
    const history = useHistory();
    const {t} = useTranslation();
    const patientPhoto = useSelector(selectPatientPhoto);
    const getImage = () => {
        const fromPhoto = message.direction === TicketMessagesDirection.Incoming ? patientPhoto : '';
        if (fromPhoto && fromPhoto.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                        src={`data:image/jpeg;base64,${fromPhoto}`} />
        }
        return <Avatar userFullName={from} />
    }

    const splitTicketQuery = useQuery(["SplitTicket", message.id], () => splitTicket(message.id), {
        enabled: false,
        onSuccess:(data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message:'email.inbox.split_ticket_success'
            }));
            history.push(`${TicketsPath}/${data.ticketNumber}`);
        },
        onError:() => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message:'email.inbox.split_ticket_failed'
            }));
        }
    })

    const getMoreMenuOption = (): DropdownItemModel[] => {
        const commonClassName = 'body2 py-1.5';
        return [{
            label: 'email.inbox.split_ticket',
            value: MORE_MENU_OPTION_SPLIT_TICKET,
            className: commonClassName
        }] as DropdownItemModel[];
    }

    const onMoreMenuClick = (item: DropdownItemModel) => {
        if (item.value === MORE_MENU_OPTION_SPLIT_TICKET){
            splitTicketQuery.refetch().then();
        }
    }

    const downloadAttachmentsMutation = useMutation(downloadAttachments, {
        onError: (_) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'email.inbox.attachments_download_failure'
            }));
        },
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'email.inbox.attachments_download_success'
            }));
        }
    })
    const downloadAllAttachments = () => {
        downloadAttachmentsMutation.mutate({messageId: message.id, mimeTypeToDownloadIn: attachmentsCount === 1 ? message.attachments[0].mimeType : MimeTypes.Zip});
    }

    if (splitTicketQuery.isLoading) {
        return <Spinner fullScreen={true} />
    }

    const headerClass = classnames('flex flex-col w-full', {
        'border-b pb-4': collapsed
    })

    return (
        <div className='flex flex-row w-full pt-3'>
            <div className='pr-4 pt-3'>
                {getImage()}
            </div>
            <div className={headerClass}>
                <div className='flex flex-row justify-between w-full items-center h-10'>
                    <div className='subtitle2'>{from}</div>
                    <div className="ml-auto flex justify-center items-center h-full">
                        {
                            attachmentsCount > 0 &&
                            <div className="flex body2-medium items-center">
                                {
                                    downloadAttachmentsMutation.isLoading ? <Spinner size="small" className="px-2" /> :
                                        <span className="attachments-label hover:underline cursor-pointer" onClick={downloadAllAttachments}>{t('email.inbox.download_all')}</span>
                                }
                                <div className='body2 pl-3'>{attachmentsCount}</div>
                                <SvgIcon type={Icon.Attachment} className="icon-medium" fillClass="rgba-062-fill" wrapperClassName="pl-1.5 pr-2" />
                            </div>
                        }
                        {(isHover) && <><div className="px-6">
                            <MoreMenu
                                iconClassName='default-toolbar-icon'
                                iconFillClassname='cursor-pointer icon-medium'
                                menuClassName='w-52'
                                items={getMoreMenuOption()}
                                onClick={onMoreMenuClick}
                            />
                        </div>
                            <div className='flex justify-center items-center rounded-full h-10 w-10 leading-10 collapsible-button cursor-pointer' onClick={() => collapseHandler()}>
                                <SvgIcon type={collapsed ? Icon.ArrowDown : Icon.ArrowUp} fillClass='collapsible-arrow-icon' />
                            </div></>}
                        {!isHover && <div className='w-28'/>}
                    </div>
                </div>
                <div className='flex flex-row space-x-2 items-center'>
                    <div>
                        <SvgIcon type={Icon.Email} className='icon-medium' fillClass='rgba-038-fill'/>
                    </div>
                    <div className="body3-medium">{feedTime}</div>
                </div>
                <div className='subtitle2 py-1'>{message.subject}</div>
            </div>
        </div>
    )
}

export default FeedDetailEmailHeaderItem;
