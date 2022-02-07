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

const EmailAttachment = ({attachment, messageId}: {attachment: EmailAttachmentHeader, messageId: string}) => {

    const [hovered, setHovered] = useState(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const downloadAttachmentMutation = useMutation(downloadAttachments, {
        onError: (_) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('email.inbox.attachment_download_failure', {filename: attachment.fileName}),
            }));
        },
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('email.inbox.attachment_download_success', {filename: attachment.fileName})
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
            className='flex items-center email-attachment-thumbnail h-16 w-60 p-4 ml-4 mb-4 cursor-pointer body3-medium attachment-file-name'>
            {
                <SvgIcon isLoading={downloadAttachmentMutation.isLoading} className='icon-large-40'
                    fillClass={!hovered ? 'fill-default' : 'rgba-062-fill'}
                    type={!hovered ? utils.determineMimeTypeIcon(attachment.mimeType, extensionExtractedFromFilename(attachment.fileName)) : Icon.Download}
                    wrapperClassName='pr-2' />
            }
            <div className='truncate'>
                {attachment.fileName}
            </div>
        </div>
    )
}

export default EmailAttachment;