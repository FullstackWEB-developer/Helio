import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import SvgIcon, {Icon} from '@components/svg-icon';
import {downloadAttachments} from '@pages/sms/services/ticket-messages.service';
import {EmailAttachmentHeader} from '@shared/models';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';
import utils from '@shared/utils/utils';
import './email-attachment.scss';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import classNames from 'classnames';

const EmailAttachment = ({attachment, messageId, externalPagesUse = false}: {attachment: EmailAttachmentHeader, messageId: string, externalPagesUse?: boolean}) => {

    const [hovered, setHovered] = useState(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const downloadAttachmentMutation = useMutation(downloadAttachments, {
        onError: (_) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('email.inbox.attachment_download_failure', {filename: attachment.fileName}),
                position: externalPagesUse ? SnackbarPosition.TopCenter : SnackbarPosition.TopRight
            }));
        },
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('email.inbox.attachment_download_success', {filename: attachment.fileName}),
                position: externalPagesUse ? SnackbarPosition.TopCenter : SnackbarPosition.TopRight
            }));
        }
    })
    const downloadAttachment = (fileName: string) => {
        downloadAttachmentMutation.mutate({messageId, contentId: fileName, mimeTypeToDownloadIn: attachment.mimeType});
    }
    const extensionExtractedFromFilename = (fileName: string): string => {
        const splitted = fileName?.split('.');
        return splitted && splitted.length > 1 ? splitted[splitted.length - 1] : '';
    }

    return (
        <div
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            onClick={() => downloadAttachment(attachment.fileName)}
            className={classNames('flex items-center email-attachment-thumbnail w-60 p-4 ml-4 mb-4 cursor-pointer body3-medium attachment-file-name',
                {
                    'h-10': externalPagesUse,
                    'h-16': !externalPagesUse
                })}>
            {
                externalPagesUse ?
                    <SvgIcon type={utils.determineMimeTypeIcon(attachment.mimeType, extensionExtractedFromFilename(attachment.fileName))}
                        wrapperClassName='pr-2' /> :
                    <SvgIcon isLoading={downloadAttachmentMutation.isLoading} className='icon-large-40'
                        fillClass={!hovered ? 'fill-default' : 'rgba-062-fill'}
                        type={!hovered ? utils.determineMimeTypeIcon(attachment.mimeType, extensionExtractedFromFilename(attachment.fileName)) : Icon.Download}
                        wrapperClassName='pr-2' />
            }
            <div className='truncate'>
                {attachment.fileName}
            </div>
            {
                externalPagesUse &&
                <SvgIcon wrapperClassName='ml-auto' fillClass='rgba-062-fill' isLoading={downloadAttachmentMutation.isLoading} type={Icon.Download} />
            }
        </div>
    )
}

export default EmailAttachment;