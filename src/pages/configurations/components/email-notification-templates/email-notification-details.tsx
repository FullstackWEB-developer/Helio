import Spinner from '@components/spinner/Spinner';
import {GetEmailNotificationTemplates} from '@constants/react-query-constants';
import {EmailTemplate} from '@pages/configurations/models/email-template';
import {getEmailTemplateById} from '@shared/services/notifications.service';
import dayjs from 'dayjs';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useParams} from 'react-router';
import './email-notification-details.scss';
import EmailNotificationTemplateForm from './email-notification-template-form';

const EmailNotificationDetails = () => {

    const {t} = useTranslation();
    const urlParams = useParams<{id: string}>();
    const {data: emailTemplate, isError, isFetching} = useQuery<EmailTemplate>([GetEmailNotificationTemplates, urlParams.id],
        () => getEmailTemplateById(urlParams.id),
        {
            enabled: !!urlParams?.id
        }
    );
    
    if(isFetching){
        return <Spinner className='flex-1' fullScreen />
    }

    if (isError || !urlParams?.id) {
        return (<div className='p-7'>
            {t('configuration.email_template_details.not_found')}
        </div>);
    }

    return (
        emailTemplate ?
        <div className='p-7 flex flex-col flex-1'>
            <h6 className='email-template-title pb-4'>
                <Trans i18nKey='configuration.email_template_details.template_name' values={{name: emailTemplate.name}} >
                    <span className='text-black'>{emailTemplate.name}</span>
                </Trans>
            </h6>
            <div className='body2'>{emailTemplate.description}</div>
            <div className='flex body2 pt-6 w-5/6'>
                <div className='w-1/2 grid email-template-auditable-grid'><span className='email-template-auditable-labels'>{t('configuration.email_template_details.created_by')}</span>{emailTemplate.createdByName}</div>
                <div className='w-1/2 grid email-template-auditable-grid'><span className='email-template-auditable-labels'>{t('configuration.email_template_details.modified_by')}</span>{emailTemplate.modifiedByName || t('common.not_available')}</div>
            </div>
            <div className='flex body2 pb-10 w-5/6'>
                <div className='w-1/2 grid email-template-auditable-grid'><span className='email-template-auditable-labels'>{t('configuration.email_template_details.created_date')}</span>{dayjs.utc(emailTemplate.createdOn).local().format('MMM DD, YYYY')}</div>
                <div className='w-1/2 grid email-template-auditable-grid'><span className='email-template-auditable-labels'>{t('configuration.email_template_details.modified_date')}</span>
                    {emailTemplate.modifiedOn ? dayjs.utc(emailTemplate.modifiedOn).local().format('MMM DD, YYYY') : t('common.not_available')}
                </div>
            </div>
            <EmailNotificationTemplateForm template={emailTemplate} />
        </div> : null
    );
}

export default EmailNotificationDetails;