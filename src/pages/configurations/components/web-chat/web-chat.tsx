import { useTranslation } from 'react-i18next';
import Spinner from '@components/spinner/Spinner';
import './web-chat.scss';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { ControlledInput } from '@components/controllers';
import Button from '@components/button/button';
import Radio from '@components/radio/radio';
import SvgIcon, { Icon } from '@components/svg-icon';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Confirmation from '@components/confirmation/confirmation';
import { useHistory } from 'react-router';
import RouteLeavingGuard from '@components/route-leaving-guard/route-leaving-guard';
import ToggleSwitch from '@components/toggle-switch/toggle-switch';
import { Option } from '@components/option/option';
import WebChatDomain from './components/web-chat-domain';
import { useMutation, useQuery } from 'react-query';
import { GetChatWidget } from '@constants/react-query-constants';
import { getChatWidget, saveChatWidget } from '@shared/services/lookups.service';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { DisplayPosition } from '@pages/configurations/models/display-position.enum';
import TextArea from '@components/textarea/textarea';
import { ChatWidgetModel } from '@pages/configurations/models/chat-widget.model';
import utils from '@shared/utils/utils';
interface DomainControl {
    domain: string
}
interface WebChatForm {
    domains: DomainControl[];
    autoStart: boolean;
    timeDelay: number;
    displayPosition: DisplayPosition
}
const WebChat = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [warning, setWarning] = useState<boolean>(false);
    const [script, setScript] = useState<string>("");
    const {
        handleSubmit,
        control,
        formState,
        setValue,
        watch,
        trigger,
    } = useForm<WebChatForm>({ mode: 'all'  });
    const { isDirty } = formState;
    const { fields, append, remove } = useFieldArray<DomainControl>({ name: 'webChat', control });
    const autoStartWatch = watch('autoStart', false);

    const {isLoading, isFetching, data, refetch} = useQuery([GetChatWidget], () => {
        return getChatWidget();
    }, {
        onSuccess: (data) => {
            setScript(`<script src='https://${utils.getAppParameter('EnvironmentName')?.toLowerCase()}-helio-assets.s3.us-west-2.amazonaws.com/chat.js'></script>\n<script>AmazonCustomChatWidget.ChatInterface.init({tenantId: '${utils.getAppParameter('ShortEnvironmentName')}'});</script>`);
            setValue('webChat', data.domains.map(domain => {
                return { domain }
            }));
            setTimeout(() =>{
                trigger();
            }, 1);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message:'configuration.web_chat.get_failed',
                type: SnackbarType.Error
            }))
        }
    });

    const saveChatWidgetMutation = useMutation(saveChatWidget, {
        onSuccess: () => {
            refetch();
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.web_chat.save_failed',
                type: SnackbarType.Error
            }));
        }
    });

    const onSubmit = (formData) => {
        saveChatWidgetMutation.mutate(formData as ChatWidgetModel);
    }

    const addAnotherDomain = () => {
        append({ domain: '' })
    }
    const removeDomain = (index: number) => {
        remove(index);
    }

    const DisplayPositionOptions: Option[] = [
        {
            value: DisplayPosition.RM.toString(),
            label: 'configuration.web_chat.right_middle'
        },
        {
            value: DisplayPosition.RB.toString(),
            label: 'configuration.web_chat.right_bottom'
        }
    ];

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0
    }

    return (<>
            <div className='web-chat-settings overflow-auto h-full px-6 pt-7'>
                <h6>{t('configuration.web_chat.title')}</h6>
                <div className='body2 web-chat-description'>{t('configuration.web_chat.description')}</div>
                {isFetching && isLoading ? (
                    <Spinner size='large-40' className='pt-2' />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate={true} className='flex flex-1 flex-col group overflow-y-auto body2'>
                        <div className='subtitle2 pt-7 pb-2'>{t('configuration.web_chat.chat_auto_start')}</div>
                        <div className='body3-medium'>{t('configuration.web_chat.chat_auto_start_description')}</div>
                        <div className="mt-7 flex flex-row items-center">
                            <div className='flex flex-col mr-4'>
                                <Controller
                                    name='autoStart'
                                    control={control}
                                    defaultValue={!!data?.autoStartEnabled}
                                    render={(controllerProps) => (
                                        <ToggleSwitch name={controllerProps.name} isChecked={!!data?.autoStartEnabled} onSwitch={(e) => controllerProps.onChange(e)}/>
                                    )}
                                />
                            </div>
                            <div className='flex w-36'>
                                <div className='items-center body2 w-36'>{t(autoStartWatch ? 'configuration.web_chat.auto_start_on' : 'configuration.web_chat.auto_start_off')}</div>
                            </div>
                            <div className='flex w-36'>
                                <div className='items-center body2 w-36'>{t('configuration.web_chat.auto_start_chat_in')}</div>
                            </div>
                            <div className='flex flex-col input-row'>
                                <div className='w-48'>
                                    <ControlledInput
                                        name='timeDelay'
                                        control={control}
                                        defaultValue={data?.autoStartDelay}
                                        label={'configuration.web_chat.time_delay'}
                                        assistiveText={'configuration.web_chat.seconds'}
                                        required={autoStartWatch}
                                        disabled={!autoStartWatch}
                                        type='number'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='subtitle2 pt-7 pb-2'>{t('configuration.web_chat.chat_position')}</div>
                        <div className='body3-medium'>{t('configuration.web_chat.chat_position_description')}</div>
                        <div className="mt-7 flex flex-row items-center">
                            <div className='flex flex-col mr-4'>
                                <Controller
                                    name='displayPosition'
                                    control={control}
                                    defaultValue={data?.displayPosition.toString()}
                                    render={(controllerProps) => (
                                        <Radio name={controllerProps.name} ref={controllerProps.ref} className='flex space-x-16 mt-2' defaultValue={data?.displayPosition.toString()} items={DisplayPositionOptions} onChange={(e: string) => { controllerProps.onChange(e); }} />
                                    )}
                                />
                            </div>
                        </div>
                        <div className='subtitle2 pt-7 pb-2'>{t('configuration.web_chat.domains_title')}</div>
                        <div className='body3-medium'>{t('configuration.web_chat.domains_description')}</div>
                        <div className="mt-7 flex flex-row items-center">
                            <div className='flex flex-col mr-4'>
                                {fields?.map((form, index: number) => {
                                    return <WebChatDomain
                                        key={form.id}
                                        control={control}
                                        index={index}
                                        defaultValue={form.domain}
                                        onRemove={removeDomain}
                                    ></WebChatDomain>
                                })}
                                <div className="flex flex-row items-center mb-10">
                                    <div className="flex cursor-pointer" onClick={() => addAnotherDomain()}>
                                        <SvgIcon type={Icon.Add} className={`icon-medium-18 rgba-038-fill`} />
                                        <span className="body2-primary  ml-4 py-auto"> {t('configuration.web_chat.add_domain')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='subtitle2 pt-7 pb-2'>{t('configuration.web_chat.script_title')}</div>
                        <div className='body3-medium'>{t('configuration.web_chat.script_description')}</div>
                        <div className='mt-5 body3-medium'>{t('configuration.web_chat.script_description_2')}</div>
                        <div className='body3-medium'>{t('configuration.web_chat.script_description_3')}</div>
                        <Button label='configuration.web_chat.copy_to_clipboard' className='w-48 mt-7' buttonType='secondary' onClick={() => {
                            navigator.clipboard.writeText(script);
                            dispatch(addSnackbarMessage({
                                message: 'configuration.web_chat.copied',
                                type: SnackbarType.Info,
                                durationInSeconds: 5,
                                autoClose: true
                            }));}} />
                        <div className="mt-7 flex flex-row items-center">
                            <div className='flex flex-col mr-4'>
                                <TextArea
                                    name='script'
                                    placeHolder='configuration.web_chat.script_placeholder'
                                    resizable={false}
                                    className='web-chat-script body2'
                                    rows={13}
                                    value={script}
                                    isReadOnly={true}
                                />
                            </div>
                        </div>
                        <div className='flex mt-10 mb-10'>
                            <Button
                                data-testid='submit'
                                type='submit'
                                buttonType='medium'
                                disabled={!isEmpty(control.formState.errors) || !isDirty}
                                label='common.save'
                            />
                            <Button label='common.cancel' className=' ml-8 mr-8' buttonType='secondary' onClick={() => formState.isDirty && setWarning(true)} />
                            <RouteLeavingGuard
                                when={formState.isDirty && !formState.isSubmitSuccessful}
                                navigate={path => history.push(path)}
                                message={'common.confirm_close'}
                                title={'configuration.general_settings.warning'}
                            />
                            <Confirmation
                                onClose={() => setWarning(false)}
                                onCancel={() => setWarning(false)}
                                okButtonLabel={'common.ok'}
                                onOk={() => {setWarning(false); }}
                                title={'configuration.general_settings.warning'}
                                message={'common.confirm_close'}
                                isOpen={warning} />
                        </div>
                    </form>
                )}
            </div>
        </>
    )
}
export default WebChat;
