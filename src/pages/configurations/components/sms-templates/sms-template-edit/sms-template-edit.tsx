import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Option } from '@components/option/option';
import { SMSTemplate } from "@pages/configurations/models/sms-templates";
import { useMutation, useQuery } from "react-query";
import { getSMSTemplateById, updateSMSTemplate } from "@shared/services/notifications.service";
import { GetSMSTemplate } from "@constants/react-query-constants";
import { addSnackbarMessage } from "@shared/store/snackbar/snackbar.slice";
import { SnackbarType } from "@components/snackbar/snackbar-type.enum";
import { useForm } from "react-hook-form";
import { ConfigurationsPath, SMSTemplatesPath } from "@app/paths";
import { SMSTemplateUpdate } from "@pages/configurations/models/sms-template-update";
import dayjs from "dayjs";
import { SMSDirection } from "@shared/models/sms-direction";
import ToolTipIcon from "@components/tooltip-icon/tooltip-icon";
import { Icon } from "@components/svg-icon";
import Button from "@components/button/button";
import { ControlledTextArea } from "@components/controllers";
import Select from "@components/select/select";
import React from "react";
import Spinner from "@components/spinner/Spinner";
interface SMSTemplateForm {
    templateBody: string
}
const SMSTemplateEdit = () => {
    const { t } = useTranslation();
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [formulas, setFormulas] = useState<Option[]>([]);
    const [currentLength, setCurrentLength] = useState<number>();
    const [smsTemplate, setSMSTemplate] = useState<SMSTemplate>();
    useEffect(() => {
        setFormulas([
            { value: 'first_name', label: t('configuration.sms_templates.formulas.first_name') },
            { value: 'last_name', label: t('configuration.sms_templates.formulas.last_name') },
            { value: 'full_name', label: t('configuration.sms_templates.formulas.full_name') },
            { value: 'short_name', label: t('configuration.sms_templates.formulas.short_name') },
            { value: 'ticket_id', label: t('configuration.sms_templates.formulas.ticket_id') },
            { value: 'ticket_number', label: t('configuration.sms_templates.formulas.ticket_number') },
            { value: 'ticket_link', label: t('configuration.sms_templates.formulas.ticket_link') },
            { value: 'sms_conversation_link', label: t('configuration.sms_templates.formulas.sms_conversation_link') },
            { value: 'email_conversation_link', label: t('configuration.sms_templates.formulas.email_conversation_link') },
            { value: 'user_first_name', label: t('configuration.sms_templates.formulas.user_first_name') },
            { value: 'blocked_access_type_string', label: t('configuration.sms_templates.formulas.blocked_access_type_string') },
            { value: 'blocked_access_link', label: t('configuration.sms_templates.formulas.blocked_access_link') },
            { value: 'blocked_access_value', label: t('configuration.sms_templates.formulas.blocked_access_value') },
            { value: 'helio_link', label: t('configuration.sms_templates.formulas.helio_link') },
            { value: 'new_patient_registration_link', label: t('configuration.sms_templates.formulas.new_patient_registration_link') },
            { value: 'lab_result_link', label: t('configuration.sms_templates.formulas.lab_result_link') },
            { value: 'department_phone', label: t('configuration.sms_templates.formulas.department_phone') },
            { value: 'department_patient_department_name', label: t('configuration.sms_templates.formulas.department_patient_department_name') },
            { value: 'department_address', label: t('configuration.sms_templates.formulas.department_address') },
            { value: 'department_address2', label: t('configuration.sms_templates.formulas.department_address2') },
            { value: 'department_city', label: t('configuration.sms_templates.formulas.department_city') },
            { value: 'department_state', label: t('configuration.sms_templates.formulas.department_state') },
            { value: 'department_zip', label: t('configuration.sms_templates.formulas.department_zip') },
            { value: 'department_parking_information', label: t('configuration.sms_templates.formulas.department_parking_information') },
            { value: 'department_directions_link', label: t('configuration.sms_templates.formulas.department_directions_link') }
        ])
    }, [])

    const { isFetching } = useQuery<SMSTemplate>(GetSMSTemplate, () => getSMSTemplateById(id), {
        enabled: !!id,
        onSuccess: (data) => {
            setSMSTemplate(data);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.sms_templates.error_fetching',
                type: SnackbarType.Error
            }))
        }
    });
    const { handleSubmit, control, watch, setValue, getValues, formState } = useForm({ mode: 'all' });
    const watchTemplateBody = watch('templateBody', smsTemplate?.templateBody);
    useEffect(() => {
        if (watchTemplateBody) {
            setCurrentLength(watchTemplateBody.length)
        }
    }, [watchTemplateBody]);
    const navigateBackToList = () => {
        const pathName = `${ConfigurationsPath}/${SMSTemplatesPath}`;
        history.push({
            pathname: pathName,
        });
    }
    const updateCancellationReasonMutation = useMutation(updateSMSTemplate);

    const onSubmit = (formData: SMSTemplateForm) => {
        if (smsTemplate) {
            const request: SMSTemplateUpdate = {
                id: smsTemplate.id,
                templateBody: formData.templateBody
            }
            updateCancellationReasonMutation.mutate(request, {
                onSuccess: () => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Success,
                        message: 'configuration.sms_template.save_success'
                    }));
                    navigateBackToList();
                },
                onError: () => {
                    dispatch(addSnackbarMessage({
                        message: 'configuration.sms_template.save_error',
                        type: SnackbarType.Error
                    }))
                }
            });
        }
    }
    const DisplayToolTip = (messages: string[]) => {
        return <ToolTipIcon
            icon={Icon.Error}
            iconFillClass='rgba-05-fill'
            placement='right-start'
            iconClassName='cursor-pointer icon ml-2'
        >
            <div className='flex flex-col p-6 w-80'>
                {messages.map((message, index) => <p key={index} className='body2'>{t(message)}</p>)}
            </div>
        </ToolTipIcon>
    }
    const resetToDefaultBody = () => setValue('templateBody', smsTemplate?.defaultBody);
    const onSelected = (option: Option | undefined) => {
        if (option) {
            const templateBody = getValues('templateBody') as string;
            setValue('templateBody', `${templateBody.slice(0, textAreaRef.current?.selectionStart)}{${option.value}}${templateBody.slice(textAreaRef.current?.selectionStart)}`);
        }
    }
    return (
        <>
            {isFetching && <Spinner fullScreen />}
            {smsTemplate &&
                <form onSubmit={handleSubmit(onSubmit)} className='px-6 pt-7 flex flex-1 flex-col group overflow-y-auto body2'>
                    <div id="title-container" className='flex flex-row pb-4'>
                        <h6> {t('configuration.sms_templates.title')} </h6>
                        <h6 className='pl-3'> {smsTemplate.name}</h6>
                    </div>
                    <div className='body2 whitespace-pre-line' >{smsTemplate.description}</div>

                    <div className='flex flex-row pt-6 mb-6'>
                        <div className=' flex flex-row w-2/3'>
                            <div className='flex flex-col details-label'>
                                <span>{t('configuration.cancellation_reason.details.created_by')}</span>
                                <span> {t('configuration.cancellation_reason.details.created_date')}</span>
                                <span className="flex"> {t('configuration.sms_templates.direction')} {DisplayToolTip(['configuration.sms_templates.tool_tip_grid_direction_two_way',
                                    'configuration.sms_templates.tool_tip_grid_direction_one_way'])}</span>
                            </div>
                            <div className='flex flex-col ml-4'>
                                <span>{smsTemplate.createdByName}</span>
                                <span> {dayjs.utc(smsTemplate.createdOn).local().format('MMM DD, YYYY')}</span>
                                <span>{SMSDirection[smsTemplate.direction]}</span>
                            </div>
                        </div>
                        <div className='flex flex-col details-label'>
                            <span >{t('configuration.cancellation_reason.details.modified_by')}</span>
                            <span> {t('configuration.cancellation_reason.details.modified_date')}</span>
                        </div>
                        <div className='flex flex-col ml-4'>
                            <span>{smsTemplate.modifiedByName}</span>
                            <span>{smsTemplate.modifiedOn && dayjs.utc(smsTemplate.modifiedOn).local().format('MMM DD, YYYY')}</span>
                        </div>
                    </div>
                    <div className='flex py-4 mb-2 pr-8'>
                        <span className="mr-auto font-bold">{t('configuration.sms_templates.edit.template_body_field_name')}</span>
                        <Button label='configuration.sms_templates.edit.reset_button' className='ml-auto' buttonType='secondary' onClick={() => resetToDefaultBody()} />
                    </div>
                    <div className='mr-auto'>
                        <Select
                            onSelect={(option) => onSelected(option)}
                            data-test-id={'formula-test-id'}
                            label={'configuration.sms_templates.edit.insert_drowpdown'}
                            options={formulas}
                        />
                    </div>
                    <div className='pr-8 -mt-8'>
                        <ControlledTextArea
                            control={control}
                            name='templateBody'
                            defaultValue={smsTemplate.templateBody}
                            className='body2 w-full p-4'
                            resizable={false} refObject={textAreaRef}
                            overwriteDefaultContainerClasses={true}
                            rows={4} />
                        <span className='body2 flex -mt-3 justify-end'>{t('configuration.sms_templates.edit.template_body_character', { currentLength: currentLength })} {DisplayToolTip(['configuration.sms_templates.edit.template_body_character_tooltip'])}</span>
                    </div>
                    <div className='flex mt-10'>
                        <Button
                            type='submit'
                            buttonType='medium'
                            disabled={!formState.isValid}
                            label='common.save'
                            isLoading={updateCancellationReasonMutation.isLoading}
                        />
                        <Button
                            label='common.cancel'
                            className=' mx-8'
                            buttonType='secondary'
                            onClick={() => navigateBackToList()}
                            isLoading={updateCancellationReasonMutation.isLoading} />
                    </div>
                </form>
            }
        </>
    )
}

export default SMSTemplateEdit;


