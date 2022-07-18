import Button from '@components/button/button';
import {ControlledInput, ControlledTextArea} from '@components/controllers';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {Icon} from '@components/svg-icon';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import {EmailTemplate} from '@pages/configurations/models/email-template';
import {EmailTemplateUpdateRequest} from '@shared/models/email-template-update-request';
import {getEmailTemplatePreview, updateEmailTemplate} from '@shared/services/notifications.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {AxiosError} from 'axios';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';

const EmailNotificationTemplateForm = ({template}: {template: EmailTemplate}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const {control, reset, getValues, handleSubmit, formState: {isValid}} = useForm({
        mode: 'onChange', defaultValues: {
            subject: template.subject,
            title: template.title,
            body: template.body
        }
    });

    const previewEmailTemplateMutation = useMutation(getEmailTemplatePreview, {
        onSuccess: (data: any) => {
            let newTabPreview = window.open("", "_blank");
            newTabPreview?.document.write(data);
        },
        onError: (error: AxiosError) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data?.message ?? 'configuration.email_template_details.preview_error',
                type: SnackbarType.Error
            }));
        }
    });
    const previewEmailTemplateHandler = () => {
        previewEmailTemplateMutation.mutate({body: getValues('body'), title: getValues('title'), id: template.id});
    }

    const updateEmailTemplateMutation = useMutation(updateEmailTemplate, {
        onSuccess: (_) => {
            dispatch(addSnackbarMessage({
                message: t('configuration.email_template_details.update_success', {templateName: template.name}),
                type: SnackbarType.Success
            }));
            history.push('/configurations/email-templates');
        },
        onError: (error: AxiosError) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data?.message ?? t('configuration.email_template_details.update_error', {templateName: template.name}),
                type: SnackbarType.Error
            }));
        }
    });

    const submitHandler = (data: EmailTemplateUpdateRequest) => {
        if (!isValid) return;
        updateEmailTemplateMutation.mutate({body: data, id: template.id});
    }

    return (
        <form className='w-full' onSubmit={handleSubmit(submitHandler)}>
            <div className='w-7/12'>
                <ControlledInput control={control} label={'configuration.email_template_details.subject'} name='subject' required={true} />
                <div className='flex items-center'>
                    <div className='flex-1'>
                        <ControlledInput control={control} label={'configuration.email_template_details.title'} name='title' required={true} />
                    </div>
                    <ToolTipIcon
                        icon={Icon.InfoOutline}
                        iconFillClass='rgba-05-fill'
                        placement='bottom-start'>
                        <div className='p-4'>
                            {t('configuration.email_template_details.title_tooltip')}
                        </div>
                    </ToolTipIcon>
                </div>
            </div>
            <div className='flex justify-between items-center subtitle2 pb-2'>
                {t('configuration.email_template_details.body')}
                <Button label='configuration.email_template_details.reset_to_default' buttonType='secondary-medium' onClick={() => reset()} />
            </div>
            <ControlledTextArea control={control}
                name='body'
                required={true}
                hyperLinkButton={true}
                showSendIconInRichTextMode={false}
                toggleRichTextMode={true}
                hideFormattingButton={true}
                sizeSelectionEnabled={false}
                formulaSelectionDropdown={true} />
            <div className='flex pt-10'>
                <Button label='common.save' className='mr-8' type='submit' disabled={!isValid} isLoading={updateEmailTemplateMutation.isLoading} />
                <Button label='configuration.email_template_details.preview' buttonType='secondary-medium' className='mr-6'
                    onClick={previewEmailTemplateHandler} isLoading={previewEmailTemplateMutation.isLoading} />
                <Button label='common.cancel' buttonType='secondary-medium' onClick={() => history.push('/configurations/email-templates')} />
            </div>
        </form>
    )
}

export default EmailNotificationTemplateForm;