import Button from '@components/button/button';
import Spinner from '@components/spinner/Spinner';
import Tabs, { Tab } from '@components/tab';
import {
  GetEmailNotificationTemplates,
  GetOperationSettings,
  GetSMSTemplate,
  GetTimeZones,
} from '@constants/react-query-constants';
import { OperationSettingModel, TimeZoneModel } from '@pages/configurations/models/business-hours-type.model';
import { getOperationSettings, getTimeZones, saveOperationSettings } from '@shared/services/lookups.service';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { TabSetBusinessHours } from './tab-set-business-hours';
import './business-hours.scss';
import { useDispatch } from 'react-redux';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { TabSetHolidays } from './tab-set-holidays';
import RouteLeavingGuard from '@components/route-leaving-guard/route-leaving-guard';
import { useHistory } from 'react-router';
import Confirmation from "@components/confirmation/confirmation";
import { ControlledSelect } from '@components/controllers';
import ToggleSwitch from '@components/toggle-switch/toggle-switch';
import ControlledInput from '@components/controllers/ControlledInput';
import { TabTypes } from '@pages/configurations/components/business-hours/models/tab-types.enum';
import { Option } from '@components/option/option';
import { getEmailTemplateById, getSMSTemplateById } from '@shared/services/notifications.service';
import { Link } from "react-router-dom";

const BusinessHours: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isWarningVisible, setWarningVisible] = useState(false);
  const { control, formState, reset, handleSubmit, watch } = useForm<OperationSettingModel>({ mode: 'all' });
  const { isDirty, isValid } = formState;

  const workingHoursWatch = watch('workingHours');
  const offDatesWatch = watch('offDates');
  const voiceRoutingWatch = watch('voiceRouting');
  const autoReplySmsWatch = watch('autoReplySms');
  const autoReplyEmailWatch = watch('autoReplyEmail');
  const [timezones, setTimeZones] = useState<Option[]>([]);

  const { isFetching } = useQuery<TimeZoneModel[]>(GetTimeZones, () => getTimeZones(), {
    onSuccess: (data) => {
      setTimeZones(data.map((item)=>({value:item.abbr, label: item.text})))
    },
    onError: () => {
      dispatch(
        addSnackbarMessage({
          message: 'configuration.business_hours.error_fetching_timezones',
          type: SnackbarType.Error,
        }),
      );
    }
  });

  const {data: smsMessage} = useQuery([GetSMSTemplate, "PracticeIsOffline"], () => getSMSTemplateById("PracticeIsOffline"));
  const {data: emailMessage} = useQuery([GetEmailNotificationTemplates, "PracticeIsOffline"], () => getEmailTemplateById("PracticeIsOffline"));

  const { data, isLoading, refetch, isFetching: isOperationFetching } = useQuery([GetOperationSettings], () => getOperationSettings(), {
    enabled: true,
    onSuccess: response => {
      reset(response);
    },
    onError: () => {
      dispatch(
        addSnackbarMessage({
          message: 'configuration.business_hours.error_fetching_settings',
          type: SnackbarType.Error,
        }),
      );
    },
  });

  const saveOperationSettingsMutation = useMutation(saveOperationSettings, {
    onSuccess: data => {
      reset(data);

      dispatch(
        addSnackbarMessage({
          type: SnackbarType.Success,
          message: 'configuration.business_hours.save_success',
        }),
      );
    },
    onError: () => {
      dispatch(
        addSnackbarMessage({
          message: 'configuration.business_hours.save_error',
          type: SnackbarType.Error,
        }),
      );
    },
  });

  const handleCancel = () => {
    setWarningVisible(true);
  };

  const handleConfirmOk = () => {
    setWarningVisible(false);
    refetch();
  }

  const onSubmit = (formData: OperationSettingModel) => {
    formData.workingHours = workingHoursWatch;
    formData.offDates = offDatesWatch;
    const newData: OperationSettingModel = { ...data, ...formData, workingHours: workingHoursWatch, offDates: offDatesWatch };
    saveOperationSettingsMutation.mutate(newData);
  };

  if (isLoading || isFetching || isOperationFetching) {
    return <Spinner fullScreen />;
  }

  const  stripHtml = (html: string) =>
  {
    if (!html) {
      return '';
    }
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <>
      <div className="h-full pr-4 overflow-none business-hours">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 px-6 py-6 overflow-y-auto body2"
        >
          <h5 className="mb-4">{t("configuration.business_hours.title")}</h5>
          <Tabs>
            <Tab key={TabTypes.GeneralSetting} title={t('configuration.business_hours.tab_general_settings_title')}>
              <div className="general_setting_container">
                <div className='mt-10 mb-4 body2'>{t('configuration.business_hours.general_setting.title')}</div>
                <div className='time-zone-select h-14 w-2/6'>
                  <ControlledSelect
                    name='timeZone'
                    control={control}
                    label='configuration.business_hours.general_setting.time_zone'
                    options={timezones}
                  />
                </div>
                <div>
                  <h6 className='mt-5 mb-5 subtitle'> {t('configuration.business_hours.general_setting.set_rule_title')} </h6>
                  <div className='calling-forwarding bottom-divider'>
                    <div className='mt-5 subtitle2'> {t('configuration.business_hours.general_setting.call_forwarding_title')}</div>
                    <div className='mb-5'>
                      <div className="flex flex-row justify-between items-center">
                        <div className='flex flex-col items-center body3-medium'>
                          {voiceRoutingWatch ? t('configuration.business_hours.general_setting.call_forwarding_description') : t('configuration.business_hours.general_setting.voice_bot_inactive')}
                        </div>
                        <div className='flex flex-col mr-4'>
                          <Controller
                            name='voiceRouting'
                            control={control}
                            render={(controllerProps) => (
                              <ToggleSwitch name={controllerProps.name} isChecked={data?.voiceRouting || false} onSwitch={(value) => {
                                control.setValue(controllerProps.name, value, {
                                  shouldValidate: true,
                                  shouldDirty: true
                                })
                              }
                              }/>
                            )}
                          />
                        </div>
                      </div>
                       <div className="w-1/4 mt-3 mb-3">
                        <ControlledInput name='routingNumber' control={control}
                                         label={t('configuration.business_hours.general_setting.routing_number')}
                                         type='tel' dataTestId='routingNumber'
                                         required />
                      </div>
                      {voiceRoutingWatch && <>
                      <ul className='pl-4 pb-2 list-disc body3-medium'>
                        <li>{t('configuration.business_hours.general_setting.routing_bullet_1')}</li>
                        <li>{t('configuration.business_hours.general_setting.routing_bullet_2')}</li>
                      </ul> </>}
                    </div>
                  </div>
                  {voiceRoutingWatch && <><div className='voice bottom-divider'>
                    <div className='mt-5 subtitle2'> {t('configuration.business_hours.general_setting.voice')}</div>
                    <ul className='pl-4 py-2 list-disc body3-medium'>
                      <li>{t('configuration.business_hours.general_setting.voice_bullet_1')}</li>
                      <li>{t('configuration.business_hours.general_setting.voice_bullet_2')}</li>
                    </ul>
                  </div>
                    <div className='chat bottom-divider'>
                    <div className='mt-5 subtitle2'> {t('configuration.business_hours.general_setting.chat')}</div>
                    <ul className='pl-4 py-2 list-disc body3-medium'>
                    <li>{t('configuration.business_hours.general_setting.chat_bullet_1')}</li>
                    <li>{t('configuration.business_hours.general_setting.chat_bullet_2')}</li>
                    <li>{t('configuration.business_hours.general_setting.chat_bullet_3')}</li>
                    </ul>
                    </div></>}
                  <div className='sms-auto-reply bottom-divider'>
                    <div className='mt-5 subtitle2'> {t('configuration.business_hours.general_setting.sms_auto_reply')}</div>
                    <div className="flex flex-row justify-between items-center">
                      <div className='flex flex-col items-center body3-medium'>
                        {autoReplySmsWatch ? t('configuration.business_hours.general_setting.sms_auto_reply_description') : t('configuration.business_hours.general_setting.sms_inactive')}
                      </div>
                      <div className='flex flex-col mr-4'>
                        <Controller
                          name='autoReplySms'
                          control={control}
                          render={(controllerProps) => (
                            <ToggleSwitch name={controllerProps.name} isChecked={data?.autoReplySms || false} onSwitch={(value) => {
                              control.setValue(controllerProps.name, value, {
                                shouldValidate: true,
                                shouldDirty: true
                              })
                            }
                            }/>
                          )}
                        />
                      </div>
                    </div>
                    {autoReplySmsWatch ? <>
                      <div className='mt-5 mb-5 italic whitespace-pre-line w-2/3'>{smsMessage?.templateBody}</div>
                      <Link to='/configurations/sms-templates/PracticeIsOffline'><h5 className='mb-3 body2-primary cursor-pointer w-max hover:underline'>
                        {t('configuration.business_hours.general_setting.edit_and_view_sms_auto_reply_message')}
                      </h5></Link>
                      </> : <div className='pb-5' />}
                  </div>
                  <div className='email-auto-reply bottom-divider'>
                    <div className='mt-5 subtitle2'> {t('configuration.business_hours.general_setting.email_auto_reply')}</div>
                    <div className="flex flex-row justify-between items-center">
                      <div className='flex flex-col items-center body3-medium'>
                        {autoReplyEmailWatch ? t('configuration.business_hours.general_setting.email_auto_reply_description') : t('configuration.business_hours.general_setting.email_inactive')}
                      </div>
                      <div className='flex flex-col mr-4'>
                        <Controller
                          name='autoReplyEmail'
                          control={control}
                          render={(controllerProps) => (
                            <ToggleSwitch name={controllerProps.name} isChecked={data?.autoReplyEmail || false} onSwitch={(value) => {
                              control.setValue(controllerProps.name, value, {
                                shouldValidate: true,
                                shouldDirty: true
                              })
                            }
                            }/>
                          )}
                        />
                      </div>
                    </div>
                    {autoReplyEmailWatch ? <>
                      <div className='mt-5 mb-5 italic whitespace-pre-line w-2/3'>{stripHtml(emailMessage?.body)}</div>
                      <Link to='/configurations/email-templates/PracticeIsOffline'><h5 className='mb-3 body2-primary cursor-pointer w-max hover:underline'>
                        {t('configuration.business_hours.general_setting.edit_and_view_email_auto_reply_message')}
                      </h5></Link>
                    </>: <div className='pb-6'/>}
                  </div>
                </div>
              </div>
            </Tab>
            <Tab
              title={t(
                "configuration.business_hours.tab_set_business_hours_title"
              )}
            >
              <TabSetBusinessHours control={control} />
            </Tab>
            <Tab title={t("configuration.business_hours.tab_set_holidays")}>
              <TabSetHolidays control={control} />
            </Tab>
          </Tabs>
          <div className="flex justify-start mt-12">
            <Button
              data-testid="save-changes"
              type="submit"
              buttonType="medium"
              label="common.save"
              isLoading={saveOperationSettingsMutation.isLoading}
              disabled={!isDirty || !isValid}
            />
            <Button
              data-testid="cancel-configurations"
              label="common.cancel"
              className="ml-6"
              buttonType="secondary"
              disabled={!isDirty}
              onClick={handleCancel}
            />
          </div>
        </form>
      </div>

      <RouteLeavingGuard
        when={isDirty && !formState.isSubmitSuccessful}
        navigate={(path) => history.push(path)}
        title="ticket_configuration.warning_info_leaving"
      />

      <Confirmation
        onClose={() => setWarningVisible(false)}
        onCancel={() => setWarningVisible(false)}
        okButtonLabel="common.ok"
        onOk={handleConfirmOk}
        title="common.warning"
        message="configuration.confirm_cancel"
        isOpen={isWarningVisible}
      />
    </>
  );
};

export default BusinessHours;
