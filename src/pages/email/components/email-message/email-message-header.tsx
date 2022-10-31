import Avatar from "@components/avatar";
import {DropdownItemModel} from "@components/dropdown";
import MoreMenu from "@components/more-menu";
import SvgIcon, {Icon} from "@components/svg-icon";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useMutation, useQuery} from "react-query";
import {downloadAttachments, splitTicket} from "@pages/sms/services/ticket-messages.service";
import {SnackbarType} from "@components/snackbar/snackbar-type.enum";
import {useDispatch} from "react-redux";
import {addSnackbarMessage} from "@shared/store/snackbar/snackbar.slice";
import Spinner from "@components/spinner/Spinner";
import {EmailAttachmentHeader} from "@shared/models";
import {MimeTypes} from "@shared/models/mime-types.enum";
import {EmailPath} from '@app/paths';
import {useHistory} from 'react-router-dom';
import {MORE_MENU_OPTION_SPLIT_TICKET} from '@pages/sms/constants';
import {EmailContext} from '@pages/email/context/email-context';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
import './email-message-header.scss';

interface EmailMessageHeaderProps {
    messageId: string;
    subject: string;
    date: Date;
    from: string;
    fromPhoto: string;
    collapseHandler: () => void;
    collapsedBody: boolean;
    attachments: EmailAttachmentHeader[];
    displaySplitMessageMenu: boolean;
}
const EmailMessageHeader = ({messageId, subject, date, from, fromPhoto, collapsedBody, collapseHandler, attachments, displaySplitMessageMenu}: EmailMessageHeaderProps) => {
    const dispatch = useDispatch();
    const attachmentsCount = attachments?.length ?? 0;
    dayjs.extend(relativeTime);
    const {getEmailsQuery} = useContext(EmailContext)!;
    const history = useHistory();
    const {t} = useTranslation();
    const getImage = () => {
        if (fromPhoto && fromPhoto.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                src={`data:image/jpeg;base64,${fromPhoto}`} />
        }
        /* TODO handle the case for showing agent pics */
        return <Avatar userFullName={from} />
    }

    const splitTicketQuery = useQuery(["SplitTicket", messageId], () => splitTicket(messageId), {
        enabled: false,
        onSuccess:(data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message:'email.inbox.split_ticket_success'
            }));
            history.replace(`${EmailPath}/${data.id}`);
            getEmailsQuery.refetch().then();
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

    const parsedDate = t('email.inbox.date', {
        relative: dayjs.utc(date).local().fromNow(),
        date: dayjs.utc(date).local().format('ddd, MMM DD, YYYY'),
        time: dayjs.utc(date).local().format('h:mm A')
    })

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
        downloadAttachmentsMutation.mutate({messageId, mimeTypeToDownloadIn: attachmentsCount === 1 ? attachments[0].mimeType : MimeTypes.Zip});
    }

    if (splitTicketQuery.isLoading) {
        return <Spinner fullScreen={true} />
    }

    return (
        <div className='flex items-center py-4'>
            <div className='w-10 h-10'>{getImage()}</div>
            <div className='flex flex-col px-4'>
                <span className='subtitle'>{from}</span>
                <span className='email-message-subject'>
                    <ElipsisTooltipTextbox value={subject} asSpan={true} classNames='truncate'/>
                </span>
            </div>
            <div className="ml-auto flex justify-center items-center">
                {
                    attachmentsCount > 0 &&
                    <div className="flex mb-auto body3-medium">
                        {
                            downloadAttachmentsMutation.isLoading ? <Spinner size="small" className="px-2" /> :
                                <span data-testid={"download-all"} className="attachments-label hover:underline cursor-pointer" onClick={downloadAllAttachments}>{t('email.inbox.download_all')}</span>
                        }
                        &nbsp;
                        {attachmentsCount}
                        <SvgIcon type={Icon.Attachment} className="icon-small" fillClass="rgba-062-fill" wrapperClassName="pl-1.5 pr-2" />
                    </div>
                }
                <div className="mb-auto body3-medium">{parsedDate}</div>
                <div className="px-7">
                    {displaySplitMessageMenu && <MoreMenu
                        data-testid={"more-menu-icon"}
                        iconClassName='default-toolbar-icon'
                        iconFillClassname='cursor-pointer icon-medium'
                        menuClassName='w-52'
                        items={getMoreMenuOption()}
                        onClick={onMoreMenuClick}
                        menuPlacement='bottom-start'
                        verticalOffset={8}
                    />}
                </div>
                <div data-testid={"collapse-handler"} className='flex justify-center items-center rounded-full h-10 w-10 leading-10 collapsible-button cursor-pointer' onClick={() => collapseHandler()}>
                    <SvgIcon type={collapsedBody ? Icon.ArrowDown : Icon.ArrowUp} fillClass='collapsible-arrow-icon' />
                </div>
            </div>

        </div>
    )
}

export default EmailMessageHeader;
