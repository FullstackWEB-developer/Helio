import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import 'amazon-connect-streams';
import 'amazon-connect-chatjs';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {isCcpVisibleSelector} from '@shared/layout/store/layout.selectors';
import {
    clearCCPContext,
    removeCurrentBotContext,
    setBotContextPatient,
    setBotContextTicket,
    setChatCounter,
    setConnectionStatus,
    setContextPanel,
    setCurrentContactId,
    setVoiceCounter,
    upsertCurrentBotContext
} from './store/ccp.slice';
import {getTicketById, setAssignee} from '../tickets/services/tickets.service';
import {selectAgentStates, selectAppUserDetails, selectUserStatus} from '@shared/store/app-user/appuser.selectors';
import {DragPreviewImage, useDrag} from 'react-dnd';
import {DndItemTypes} from '@shared/layout/dragndrop/dnd-item-types';
import './ccp.scss';
import {toggleCcp} from '@shared/layout/store/layout.slice';
import {Trans, useTranslation} from 'react-i18next';
import CcpContext from './components/ccp-context';
import contextPanels from './models/context-panels';
import {ccpImage} from './ccpImage';
import {addLiveAgentStatus, setAgentStates, updateUserStatus} from '@shared/store/app-user/appuser.slice';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import Logger from '@shared/services/logger';
import {AgentState} from '@shared/models/agent-state';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {selectBotContext, selectContextPanel} from './store/ccp.selectors';
import {useMutation, useQuery} from 'react-query';
import {CCP_ANIMATION_DURATION} from '@constants/form-constants';
import Modal from '@components/modal/modal';
import Button from '@components/button/button';
import {CCPConnectionStatus} from './models/connection-status.enum';
import {QueryGetPatientById, QueryTickets} from '@constants/react-query-constants';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import useLocalStorage from '@shared/hooks/useLocalStorage';
import utils from '@shared/utils/utils';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';
const ccpConfig = {
    region: utils.getAppParameter('AwsRegion'),
    connectBaseUrl: utils.getAppParameter('ConnectBaseUrl'),
    ccpUrl: utils.getAppParameter('CcpAccessUrl'),
    ccpLoginUrl: utils.getAppParameter('CcpLoginUrl')
}

const CCP_TIMEOUT_MS = 30000;
export interface BoxProps {
    id: any
    left: number
    top: number,
    headsetIconRef: React.RefObject<HTMLDivElement>,
    moveBox: (left: number, top: number) => void
}

declare global {
    interface Window {
        CCP: any;
    }
}

window.CCP = window.CCP || {};


const Ccp: React.FC<BoxProps> = ({
    id,
    left,
    top,
    headsetIconRef,
    moveBox
}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const logger = Logger.getInstance();
    const user = useSelector(selectAppUserDetails);
    const currentUserStatus = useSelector(selectUserStatus);
    const [isHover, setHover] = useState(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);
    const [isInboundCall, setIsInboundCall] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [patientId, setPatientId] = useState<number>();
    const botContext = useSelector(selectBotContext);
    const currentContext = useSelector(selectContextPanel);
    const updateAssigneeMutation = useMutation(setAssignee);
    const isCcpVisibleRef = useRef();
    isCcpVisibleRef.current = useSelector(isCcpVisibleSelector);
    const [latestStatus, setLatestStatus] = useLocalStorage('latestCCPStatus', '');
    const [animateToggle, setAnimateToggle] = useState(false);
    const [delayCcpDisplaying, setDelayCcpDisplaying] = useState(true);
    const [ccpConnectionState, setCcpConnectionState] = useState<CCPConnectionStatus>(CCPConnectionStatus.None);
    const [isModelOpen, setModelOpen] = useState(false);
    const animationDurationOffset = 25;
    const agentStates = useSelector(selectAgentStates);
    const ccpConnectionFailed = (isRetry: boolean) => {
        setCcpConnectionState(CCPConnectionStatus.Failed);
        if (isRetry) {
            dispatch(setConnectionStatus(CCPConnectionStatus.Failed));
            setModelOpen(false);
        }
    }

    useQuery([QueryGetPatientById, patientId], () => getPatientByIdWithQuery(patientId!), {
        enabled: !!botContext?.ticket?.patientId,
        onSuccess: (data) => {
            dispatch(setBotContextPatient({
                patient: data,
                contactId: ticketId
            }));
        }
    });

    useQuery([QueryTickets, ticketId], () => getTicketById(ticketId), {
        enabled: !!ticketId,
        onSuccess: (data) => {
            dispatch(setBotContextTicket({
                ticket: data
            }));
        }
    });

    useEffect(() => {
        if (!!ticketId) {
            updateAssigneeMutation.mutate({ticketId: ticketId, assignee: user.id});
        }
    }, [ticketId]);

    useEffect(() => {
        if (!!botContext?.ticket?.patientId){
            setPatientId(botContext?.ticket?.patientId);
            history.push('/patients/' + botContext?.ticket?.patientId);
        }
    }, [botContext?.ticket?.patientId]);


    useEffect(() => {
        if (ccpConnectionState === CCPConnectionStatus.Success) {
            setTimeout(() => {
                setModelOpen(false);
            }, 3000);
        }
    }, [ccpConnectionState]);

    useEffect(() => {
        if (ccpConnectionState === CCPConnectionStatus.Loading) {
            const timer = setTimeout(() => {
                ccpConnectionFailed(true);
            }, CCP_TIMEOUT_MS);
            return () => clearTimeout(timer);
        }
        return () => { };
    }, [ccpConnectionState]);

    const initCCP = useCallback((isRetry: boolean = false) => {
        if (utils.isSessionExpired()) {
            return;
        }

        const removeCPPIframeScroll = () => {
            const iframeEle = document.querySelector('#ccp-container iframe');
            iframeEle?.setAttribute('scrolling', 'no');
        }

        const ccpContainer = document.getElementById('ccp-container');
        connect.core.initCCP(ccpContainer as HTMLDivElement, {
            ccpUrl: ccpConfig.connectBaseUrl! + ccpConfig.ccpUrl,
            loginPopup: true, // optional, defaults to `true`
            loginPopupAutoClose: true, // optional, defaults to `true`
            loginUrl: ccpConfig.ccpLoginUrl,
            region: ccpConfig.region,
            softphone: {
                allowFramedSoftphone: true,
            },
        });

        if (!(connect.core as any).initialized) {
            setCcpConnectionState(CCPConnectionStatus.Loading);
            dispatch(setConnectionStatus(CCPConnectionStatus.Loading));
            setModelOpen(true);
        }

        connect.core.onInitialized(() => {
            setCcpConnectionState(CCPConnectionStatus.Success);
            dispatch(setConnectionStatus(CCPConnectionStatus.Success));
            removeCPPIframeScroll();
        });

        connect.core.onAuthFail(() => {
            ccpConnectionFailed(isRetry);
        });

        connect.core.onAccessDenied(() => {
            ccpConnectionFailed(isRetry);
        });

        connect.core.onViewContact((contactEvent) => {
            dispatch(setCurrentContactId(contactEvent.contactId));
        });

        const beforeUnload = () => {
            setLatestStatus(currentUserStatus);
            updateAgentStatus(UserStatus.Offline, agentStates);
            dispatch(clearCCPContext());
        };

        const updateAgentStatus = (status: string, states: AgentState[]) => {
            const state = states.find((agentState) => agentState.name === status);
            window.CCP.agent.setState(state, {
                failure: (e: any) => {
                    logger.error('Cannot set state for agent ', e);
                }
            });
        }

        const getInitialContactId = (contact : any) => {
            return contact.getInitialContactId() || contact.getContactId()
        }

        connect.contact((contact) => {
            window.CCP.contact = contact;
            contact.onConnecting(() => {
                if (!isCcpVisibleRef.current) {
                    dispatch(toggleCcp());
                }
            });

            contact.onConnected((contact) => {
                const attributeMap = contact.getAttributes();
                const botAttributes: ContextKeyValuePair[] = [];
                for (const [_, value] of Object.entries(attributeMap)) {
                    botAttributes.push({
                        label: value.name,
                        value: value.value
                    })
                }
                const queue = contact.getQueue();
                const queueName = queue.name;
                let ticketId = '';
                let contactId = '';
                if (attributeMap.PatientId) {
                    const patientId = attributeMap.PatientId.value;
                    setPatientId(Number(patientId));
                }

                if (attributeMap.HelioContactId) {
                    contactId = attributeMap.HelioContactId.value;
                    if (contactId) {
                        history.push('/contacts/' + contactId);
                    }
                }

                if (attributeMap.TicketId) {
                    if (attributeMap.TicketId.value) {
                        ticketId = attributeMap.TicketId.value;
                    } else {
                        ticketId = getInitialContactId(contact);
                    }
                    setTicketId(ticketId);
                }

                if(contact.isInbound()) {
                    setIsInboundCall(true);
                    dispatch(setContextPanel(contextPanels.bot));
                }else {
                    setIsInboundCall(false);
                    dispatch(setContextPanel(contextPanels.note));
                }

                if (attributeMap.CallerMainIntent) {
                    const reason = attributeMap.CallerMainIntent.value;
                    let isPregnant = false;
                    if (attributeMap.IsUserPregnant && attributeMap.IsUserPregnant.value.toLowerCase() === "yes") {
                        isPregnant = true;
                    }
                    dispatch(upsertCurrentBotContext({
                        ...botContext,
                        queue: queueName,
                        isPregnant,
                        reason,
                        initialContactId: getInitialContactId(contact),
                        attributes: botAttributes,
                        currentContactId: contact.getContactId(),
                        contactId
                    })
                    );
                } else {
                    let reason = '';
                    if (attributeMap.HasAppointmentInLast3Years) {
                        const hasAppointmentInLast3Years = attributeMap.HasAppointmentInLast3Years.value;
                        if (hasAppointmentInLast3Years === "false") {
                            reason = t('ccp.bot_context.patient_with_no_late_appointment');
                        }
                    }
                    dispatch(upsertCurrentBotContext({
                        ...botContext,
                        queue: queueName,
                        reason,
                        initialContactId: getInitialContactId(contact),
                        attributes: botAttributes,
                        currentContactId: contact.getContactId(),
                        contactId
                    }));
                }
            });

            contact.onDestroy((contact) => {
                dispatch(removeCurrentBotContext(contact.contactId));
            })
        });
        connect.agent((agent) => {
            window.CCP.agent = agent;
            const agentStates = agent.getAgentStates() as AgentState[];
            if (latestStatus?.name) {
                updateAgentStatus(latestStatus.name, agentStates);
            }

            if (agentStates?.length > 0) {
                dispatch(setAgentStates(agentStates));
            }

            agent.onStateChange(agentStateChange => {
                if (agentStateChange.oldState.toLowerCase() !== connect.AgentStateType.INIT && agentStateChange.newState.toLowerCase() === connect.AgentStateType.OFFLINE) {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: 'ccp.went_offline'
                    }));
                }
                dispatch(updateUserStatus(agentStateChange.newState));
                dispatch(addLiveAgentStatus({
                    status:agentStateChange.newState,
                    userId: user.id,
                    timestamp: new Date()
                }));
            });

            agent.onAfterCallWork(() => {
                dispatch(updateUserStatus(UserStatus.AfterWork));
            });

            agent.onRefresh(ag => {
                const numberOfChats = ag.getContacts(connect.ContactType.CHAT).length;
                dispatch(setChatCounter(numberOfChats));
                const numberOfVoices = ag.getContacts(connect.ContactType.VOICE).length;
                dispatch(setVoiceCounter(numberOfVoices));

                setIsBottomBarVisible(numberOfChats > 0 || numberOfVoices > 0);
            });
            window.addEventListener('beforeunload', () => beforeUnload());
        });

        return () => {
            window.removeEventListener('beforeunload', () => beforeUnload());
        }
    }, [])

    useEffect(() => {
        return initCCP();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{opacity}, drag, preview] = useDrag({
        item: {id, left, top, type: DndItemTypes.BOX},
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.3 : 1
        })
    });

    const applyProperIconClass = (type: string, mode: 'fillColor' | 'background' = 'fillColor') => {
        if (mode === 'fillColor') {
            return `ccp-bottom-bar-icon${currentContext === type ? '-active' : ''}`;
        }
        else if (mode === 'background') {
            return `ccp-botom-icon-background${currentContext === type ? '-active' : ''}`;
        }
    }

    const minimizeCcpControl = () => {
        const animationDuration = CCP_ANIMATION_DURATION;
        if (headsetIconRef?.current) {
            const headsetIconDimensions = headsetIconRef.current.getBoundingClientRect();
            const ccp = document.getElementById('ccpControl');
            if (ccp) {
                const ccpDimensions = ccp?.getBoundingClientRect();
                ccp.style.setProperty('--headsetIconPositionX', `${headsetIconDimensions.x + headsetIconDimensions.width / 2 - ccpDimensions.width / 2}px`);
                ccp.style.setProperty('--headsetIconPositionY', `${headsetIconDimensions.top}px`);
                ccp.style.setProperty('--ccpAnimationDuration', `${animationDuration}s`);
                ccp.style.setProperty('--ccpAnimationInitialScale', '1');
                ccp.style.setProperty('--ccpAnimationFinalScale', '0');
            }
        }
        setAnimateToggle(true);

        setTimeout(() => {
            dispatch(toggleCcp());
            setAnimateToggle(false);
            setDelayCcpDisplaying(true);
        }, (animationDuration * 1000) - animationDurationOffset);
    }
    const maximizeCcpControl = () => {
        const animationDuration = CCP_ANIMATION_DURATION;
        const ccp = document.getElementById('ccpControl');
        if (ccp && headsetIconRef?.current) {
            const headsetIconBoundingClientRect = headsetIconRef.current.getBoundingClientRect();
            moveBox(headsetIconBoundingClientRect.x - headsetIconBoundingClientRect.width / 2, headsetIconBoundingClientRect.top);
            const ccpBoundingClientRect = ccp.getBoundingClientRect();
            ccp.style.setProperty('--headsetIconPositionX', `${ccpBoundingClientRect.x}px`);
            ccp.style.setProperty('--headsetIconPositionY', `${ccpBoundingClientRect.y}px`);
            ccp.style.setProperty('--ccpAnimationDuration', `${animationDuration}s`);
            ccp.style.setProperty('--ccpAnimationInitialScale', '0');
            ccp.style.setProperty('--ccpAnimationFinalScale', '1');
            setAnimateToggle(true);
            setDelayCcpDisplaying(false);
            setTimeout(() => {setAnimateToggle(false); moveBox(ccpBoundingClientRect.x, ccpBoundingClientRect.y)}, (animationDuration * 1000) - animationDurationOffset);
        }
    }

    const getModelTitle = () => {
        switch (ccpConnectionState) {
            case CCPConnectionStatus.Loading:
                return t('ccp.modal.title_connecting');
            case CCPConnectionStatus.Success:
                return t('ccp.modal.title_success');
            case CCPConnectionStatus.Failed:
                return t('ccp.modal.title_fail');
            default:
                return '';
        }
    }

    const getModelDescription = () => {
        switch (ccpConnectionState) {
            case CCPConnectionStatus.Loading:
                return <>{t('ccp.modal.desc_connecting')}</>;
            case CCPConnectionStatus.Success:
                return <>{t('ccp.modal.desc_success')}</>;
            case CCPConnectionStatus.Failed:
                return (
                    <div className='flex flex-col'>
                        <span>{t('ccp.modal.desc_fail')}</span>
                        <span>
                            <Trans i18nKey="ccp.modal.desc_fail_try" values={utils.getAppParameter('SupportEmailAddress')}>
                                <a className='link' rel='noreferrer' href={`mailto:${utils.getAppParameter('SupportEmailAddress')}`}> </a>
                            </Trans>
                        </span>
                    </div>
                );
            default:
                return <></>;
        }
    }
    const onRetryClick = () => {
        initCCP(true);
    }
    useEffect(() => {
        if (isCcpVisibleRef.current) {
            maximizeCcpControl();
        }
    }, [isCcpVisibleRef.current]);

    return (
        <>
            <div className='flex items-center justify-center justify-self-center'>
                <Modal
                    title={getModelTitle()}
                    isClosable
                    isOpen={isModelOpen}
                    className='ccp-modal'
                    onClose={() => setModelOpen(false)}>
                    <div className='pb-7'>
                        <div className='body2'>{getModelDescription()}</div>
                        <div className='flex flex-row pt-7'>
                            <SvgIcon type={Icon.CheckMark} fillClass='success-icon' />
                            <span className='ml-2 body2'>{t('ccp.modal.athena_health')}</span>
                        </div>
                        <div className='flex flex-row pt-3'>
                            {ccpConnectionState === CCPConnectionStatus.Success && <SvgIcon type={Icon.CheckMark} fillClass='success-icon' />}
                            {ccpConnectionState === CCPConnectionStatus.Failed && <SvgIcon type={Icon.ErrorFilled} fillClass='danger-icon' />}
                            {ccpConnectionState === CCPConnectionStatus.Loading && <SvgIcon type={Icon.Spinner} fillClass='danger-icon' />}
                            <span className='ml-2 body2'>{t('ccp.modal.aws_connect')}</span>
                        </div>
                        {ccpConnectionState === CCPConnectionStatus.Failed &&
                            <div className='flex flex-row justify-end'>
                                <Button
                                    label={t('common.retry')}
                                    type="button"
                                    buttonType='medium'
                                    onClick={onRetryClick}
                                />
                            </div>
                        }
                    </div>
                </Modal>
            </div>
            <DragPreviewImage src={ccpImage} connect={preview} />
            <div className={`ccp-main z-50 ${animateToggle ? 'ccp-toggle-animate' : ''} ` + (isCcpVisibleRef.current ? 'block' : 'hidden')}
                style={{left, top, opacity: opacity, visibility: delayCcpDisplaying ? 'hidden' : 'visible'}}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                ref={drag}
                id={'ccpControl'}
            >
                <div className={'ccp-title h-8 flex items-center flex-row justify-between pl-4 body2-white ' + (isHover ? 'visible' : 'invisible')}>
                    <div>{t('ccp.title')}</div>
                    <div className='flex items-center justify-center w-8 h-full cursor-pointer' onClick={minimizeCcpControl}>-</div>
                </div>
                <div className={'flex h-full shadow-md'}>
                    <div className={'flex flex-col h-full min-ccp-width'}>
                        <div data-test-id='ccp-container' id='ccp-container' className={`h-full overflow-hidden ccp-drag-background`}> </div>
                        <div className={`flex justify-center items-center w-full p-0 box-content shadow-md border-t footer-ff ccp-bottom-bar ${isBottomBarVisible ? 'block' : 'hidden'}`}>
                            {
                                isInboundCall &&
                                    <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.bot, 'background')}`}>
                                    <SvgIcon type={Icon.Bot}
                                             className='cursor-pointer icon-medium'
                                             onClick={() => dispatch(setContextPanel(contextPanels.bot))}
                                             fillClass={applyProperIconClass(contextPanels.bot)} />
                                    </span>
                            }
                            {
                                ticketId ?
                                    <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.note, 'background')}`}>
                                        <SvgIcon type={Icon.Note}
                                            className='cursor-pointer icon-medium'
                                            fillClass={applyProperIconClass(contextPanels.note)}
                                            onClick={() => dispatch(setContextPanel(contextPanels.note))} />
                                    </span>
                                    : <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.note, 'background')}`}>
                                        <SvgIcon type={Icon.Note} className='icon-medium'
                                            fillClass={applyProperIconClass(contextPanels.note)} />
                                    </span>
                            }
                            <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.sms, 'background')}`}>
                                <SvgIcon type={Icon.Sms}
                                    className='cursor-pointer icon-medium'
                                    fillClass={applyProperIconClass(contextPanels.sms)}
                                    onClick={() => dispatch(setContextPanel(contextPanels.sms))} />
                            </span>
                            {
                                isInboundCall &&
                                    <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.scripts, 'background')}`}>
                                    <SvgIcon type={Icon.Scripts}
                                             className='cursor-pointer icon-medium'
                                             fillClass={applyProperIconClass(contextPanels.scripts)}
                                             onClick={() => dispatch(setContextPanel(contextPanels.scripts))} />
                            </span>
                            }
                        </div>
                    </div>
                    <CcpContext ticketId={ticketId} />
                </div>
            </div>
        </>
    );
}

export default withErrorLogging(Ccp);
