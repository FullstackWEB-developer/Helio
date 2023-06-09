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
    setCcpNotificationContent,
    setChatCounter,
    setConnectionStatus,
    setContextPanel,
    setCurrentContactId,
    setInitiateInternalCall,
    setInternalCallDetails,
    setParentTicketId,
    setVoiceCounter,
    upsertCurrentBotContext
} from './store/ccp.slice';
import {
    getTicketById,
    setAssignee,
    updateConnectAttributes,
    updateConnectAttributesForInternalCall
} from '../tickets/services/tickets.service';
import {selectAgentStates, selectAppUserDetails, selectUserStatus} from '@shared/store/app-user/appuser.selectors';
import {DragPreviewImage, useDrag} from 'react-dnd';
import {DndItemTypes} from '@shared/layout/dragndrop/dnd-item-types';
import './ccp.scss';
import {setIncomingOrActiveCallFlag, toggleCcp} from '@shared/layout/store/layout.slice';
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
import {
    selectBotContext,
    selectCcpNotificationContent,
    selectChatCounter,
    selectContextPanel,
    selectInitiateInternalCall,
    selectInternalCallDetails,
    selectParentTicketId,
    selectVoiceCounter
} from './store/ccp.selectors';
import {useMutation, useQuery} from 'react-query';
import {CCP_ANIMATION_DURATION} from '@constants/form-constants';
import Modal from '@components/modal/modal';
import Button from '@components/button/button';
import {CCPConnectionStatus} from './models/connection-status.enum';
import {QueryGetPatientById, QueryTickets} from '@constants/react-query-constants';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import utils from '@shared/utils/utils';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';
import {getUserList} from '@shared/services/lookups.service';
import {clearAppParameters} from '@shared/store/app/app.slice';
import Spinner from '@components/spinner/Spinner';
import useBrowserNotification from '@shared/hooks/useBrowserNotification';
import {Intent} from './models/intent.enum';
import {ForwardingEnabledStatus} from '@shared/layout/components/profile-dropdown';
import {useMitt} from '@shared/utils/mitt';
import ContactStateType = connect.ContactStateType;
import Contact = connect.Contact;
import ConnectionType = connect.ConnectionType;

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
    const [isInboundCall, setIsInboundCall] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const botContext = useSelector(selectBotContext);
    const currentContext = useSelector(selectContextPanel);
    const { emitter } = useMitt();
    const updateAssigneeMutation = useMutation(setAssignee, {
        onSettled: (data) => {
            if (!!data) {
                dispatch(setBotContextTicket({
                    ticket: data
                }));
                if (data?.notes && data.notes.length > 0) {
                    dispatch(setContextPanel(contextPanels.note));
                }
            }
        }
    });
    const isCcpVisibleRef = useRef();
    isCcpVisibleRef.current = useSelector(isCcpVisibleSelector);
    const [animateToggle, setAnimateToggle] = useState(false);
    const [delayCcpDisplaying, setDelayCcpDisplaying] = useState(true);
    const [ccpConnectionState, setCcpConnectionState] = useState<CCPConnectionStatus>(CCPConnectionStatus.None);
    const [isModelOpen, setModelOpen] = useState(false);
    const animationDurationOffset = 25;
    const agentStates = useSelector(selectAgentStates);
    const internalCallDetails = useSelector(selectInternalCallDetails);
    const initiateInternalCall = useSelector(selectInitiateInternalCall);
    const updateAttributesMutation = useMutation(updateConnectAttributes);
    const updateAttributesForInternalMutation = useMutation(updateConnectAttributesForInternalCall);
    const chatCounter = useSelector(selectChatCounter);
    const voiceCounter = useSelector(selectVoiceCounter);

    useEffect(() => {
        const activeConversations = chatCounter + voiceCounter;
        if (activeConversations === 0) {
            dispatch(setIncomingOrActiveCallFlag(false));
        }
    }, [chatCounter, voiceCounter]);

    const ccpConnectionFailed = (isRetry: boolean) => {
        setCcpConnectionState(CCPConnectionStatus.Failed);
        if (isRetry) {
            dispatch(setConnectionStatus(CCPConnectionStatus.Failed));
            setModelOpen(false);
        }
    }

    useEffect(() => {
        let isMounted = true;
        const interval = setInterval(() => {
            if (isMounted) {
                if((connect.core as any).initialized && ccpConnectionState !== CCPConnectionStatus.Success) {
                    setCcpConnectionState(CCPConnectionStatus.Success);
                } else if(!((connect.core as any).initialized) && ccpConnectionState === CCPConnectionStatus.Success) {
                    setCcpConnectionState(CCPConnectionStatus.Failed);
                }
                updateCallForwardingStatus();
            }
        }, 10 * 1000);

        return () => {
            clearInterval(interval);
            isMounted = false;
        };
    }, [connect.core, user, currentUserStatus]);

    useQuery([QueryGetPatientById, botContext?.ticket?.patientId], () => getPatientByIdWithQuery(botContext?.ticket?.patientId!), {
        enabled: !!botContext?.ticket?.patientId && !botContext?.patient,
        onSuccess: (data) => {
            if (botContext?.ticket?.patientId === data.patientId) {
                dispatch(setBotContextPatient({
                    patient: data,
                    contactId: ticketId
                }));
            }
        }
    });

    const {refetch: refetchTicket} = useQuery([QueryTickets, ticketId], () => getTicketById(ticketId), {
        enabled: !!ticketId,
        onSuccess: (data) => {
            dispatch(setBotContextTicket({
                ticket: data
            }));
            if (data?.notes && data.notes.length > 0) {
                dispatch(setContextPanel(contextPanels.note));
            }
        }
    });

    const handleCcpPosition = () => {
        const ccp = document.getElementById('ccpControl');
        if (ccp) {
            const elementRect = ccp.getBoundingClientRect();
            const isHorizontallyInBounds = utils.isInBounds(elementRect.top, elementRect.left, elementRect.bottom, elementRect.right, 'horizontally');
            const isVerticallyInBounds = utils.isInBounds(elementRect.top, elementRect.left, elementRect.bottom, elementRect.right, 'vertically');

            if (!isHorizontallyInBounds && !isVerticallyInBounds) {
                if (elementRect.left < 0 && elementRect.top < 0) {
                    moveBox(0, 0);
                } else if(elementRect.left < 0 && elementRect.bottom > elementRect.y) {
                    moveBox(0, document.documentElement.clientHeight  - ccp.offsetHeight);
                } else if (elementRect.right > elementRect.x && elementRect.top < 0) {
                    moveBox(document.documentElement.clientWidth  - ccp.offsetWidth, 0);
                } else if(elementRect.right > elementRect.x && elementRect.bottom > elementRect.y) {
                    moveBox(document.documentElement.clientWidth  - ccp.offsetWidth, document.documentElement.clientHeight  - ccp.offsetHeight);
                }
            } else if (!isHorizontallyInBounds) {
                if (elementRect.left < 0) {
                    moveBox(0, elementRect.top);
                } else if (elementRect.right > elementRect.x) {
                    moveBox(document.documentElement.clientWidth  - ccp.offsetWidth, elementRect.top);
                }
            } else if (!isVerticallyInBounds) {
                if (elementRect.top < 0) {
                    moveBox(elementRect.left, 0);
                } else if (elementRect.bottom > elementRect.y) {
                    moveBox(elementRect.left, document.documentElement.clientHeight  - ccp.offsetHeight);
                }
            }
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleCcpPosition);
        return () => {
            window.removeEventListener('resize', handleCcpPosition);
        }
    }, [])

    useEffect(() => {
        let didCancel = false;
        emitter.on("ContactOnRefresh", ((contact: Contact) => {
            if (didCancel) {
                return;
            }
            if (contact.getState().type !== ContactStateType.CONNECTED) {
                return;
            }
            const contactId = contact.getInitialContactId() || contact.contactId;
            if (contactId !== botContext?.ticket?.connectContactId) {
                return;
            }
            const snapShot = contact.toSnapshot();
            const connections = snapShot.getConnections();
            const initialType = contact.getInitialConnection().getType();
            if (initialType === ConnectionType.INBOUND) {
                const agentConnectionCount = connections.filter(a => a.getType() !== ConnectionType.INBOUND && a.isActive()).length;
                if(agentConnectionCount === 1 && user.id !== botContext?.ticket?.assignee) {
                    //Current user is the only agent and s/he is not the current assignee, so we should assign ticket to her/him
                    if (!!botContext?.ticket?.id) {
                        updateAssigneeMutation.mutate({ticketId: botContext.ticket.id, assignee: user.id});
                    }
                }
            } else {
                if(user.id !== botContext?.ticket?.assignee && !!botContext?.ticket?.id) {
                    updateAssigneeMutation.mutate({ticketId: botContext.ticket.id, assignee: user.id});
                }
            }

        }));
        return () => {
            didCancel = true;
            emitter.off("ContactOnRefresh");
        };
    }, [emitter, botContext, user])

    useEffect(() => {
        handleCcpPosition();
    }, [moveBox])

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    useEffect(() => {
        if (!!botContext?.ticket?.patientId) {
            history.push('/patients/' + botContext?.ticket?.patientId);
        }
    }, [botContext?.ticket?.patientId, history]);

    useEffect(() => {
        if (!botContext?.ticket && !!botContext?.initialContactId) {
            setTicketId(botContext?.initialContactId);
            refetchTicket()
        }
    }, [botContext, refetchTicket]);


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
        } else if (ccpConnectionState === CCPConnectionStatus.Failed) {
            ccpConnectionFailed(true);
        }
        return () => { };
    }, [ccpConnectionState]);

    const updateAgentStatus = (status: string, states: AgentState[]) => {
        const state = states.find((agentState) => agentState.name === status);
        window.CCP.agent.setState(state, {
            failure: (e: any) => {
                logger.error('Cannot set state for agent ', e);
            }
        });
    }
    const parentTicketId = useSelector(selectParentTicketId);
    useEffect(() => {
        if (initiateInternalCall) {
            updateContactForInternalCall();
            dispatch(setInitiateInternalCall(false));
        }
    }, [initiateInternalCall])

    const updateContactForInternalCall = () => {
        if(parentTicketId || !internalCallDetails){
            return;
        }
        updateAttributesForInternalMutation.mutate({
            contactId: window.CCP.contact.contactId,
            attributes: {
                "FromUserId": internalCallDetails?.fromUserId,
                "QueueType": internalCallDetails?.type,
                "ToUserId": internalCallDetails?.toUserId,
                "QueueArn": internalCallDetails?.queueArn,
                "IsInternalCall": true
            }
        })
    }

    const setParentTicketForOutboundCallWhenCallback = () => {
        updateAttributesMutation.mutate({
            contactId: window.CCP.contact.contactId,
            attributes: {
                ...(parentTicketId && {"ParentTicketId": parentTicketId})
            }
        }, {
            onSettled: () => {
                dispatch(setParentTicketId(''));
            }
        })
    }
    useEffect(() => {
        if (parentTicketId && window?.CCP?.contact?.contactId) {
            setParentTicketForOutboundCallWhenCallback();
        }
    }, [parentTicketId, window?.CCP?.contact?.contactId]);

    const initCCP = useCallback((isRetry: boolean = false) => {
        if (utils.isSessionExpired()) {
            return;
        }

        const removeCPPIframeScroll = () => {
            const iframeEle = document.querySelector('#ccp-container iframe');
            iframeEle?.setAttribute('scrolling', 'no');
        }

        const handleLogOut = () => {
            // @ts-ignore
            const eventBus = connect.core.getEventBus();
            eventBus.subscribe(connect.EventType.TERMINATED, () => {
                dispatch(clearAppParameters());
                utils.logout();
            });
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
            handleLogOut();
        });

        connect.core.onAuthFail(() => {
            ccpConnectionFailed(isRetry);
        });

        connect.core.onAccessDenied(() => {
            ccpConnectionFailed(isRetry);
        });

        connect.core.onViewContact((contactEvent) => {
            if (contactEvent.contactId !== '') {
                dispatch(setCurrentContactId(contactEvent.contactId));
            }
        });

        const getInitialContactId = (contact: any) => {
            return contact.getInitialContactId() || contact.getContactId()
        }

        connect.contact((contact) => {
            window.CCP.contact = contact;
            contact.onConnecting((contact) => {
                dispatch(setIncomingOrActiveCallFlag(true));
                const attributeMap = contact.getAttributes();
                const botAttributes: ContextKeyValuePair[] = [];
                for (const [_, value] of Object.entries(attributeMap)) {
                    botAttributes.push({
                        label: value.name,
                        value: value.value
                    })
                }
                const notificationTitle = prepareChatOrVoiceNotificationTitle(botAttributes);
                const notificationBody = prepareChatOrVoiceNotificationContent(botAttributes, contact.getQueue()?.name);
                dispatch(setCcpNotificationContent({body: notificationBody, title: notificationTitle, type: contact.getType()}));
                if (!isCcpVisibleRef.current) {
                    dispatch(toggleCcp());
                }
                if (!contact.isInbound() && !parentTicketId) {
                    dispatch(setInitiateInternalCall(true));
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
                let isInternalCall = false;

                if (attributeMap.HelioContactId) {
                    contactId = attributeMap.HelioContactId.value;
                    if (contactId) {
                        history.push('/contacts/' + contactId);
                    }
                }

                if (attributeMap.IsInternalCall) {
                    isInternalCall = attributeMap.IsInternalCall.value.toLowerCase() === "true";
                }

                if (attributeMap.TicketId) {
                    if (attributeMap.TicketId.value) {
                        ticketId = attributeMap.TicketId.value;
                    } else {
                        ticketId = getInitialContactId(contact);
                    }
                    setTicketId(ticketId);
                }

                if (contact.isInbound() || isInternalCall) {
                    setIsInboundCall(true);
                    dispatch(setContextPanel(contextPanels.bot));
                }
                else {
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
                            contactId,
                            isInBound: contact.isInbound()
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
                        contactId,
                        isInBound: contact.isInbound()
                    }));
                }
            });

            contact.onRefresh((contact) => {
                emitter.emit('ContactOnRefresh', contact);
            })

            contact.onEnded((contact) => {
                dispatch(setInitiateInternalCall(false));
                dispatch(removeCurrentBotContext(contact.contactId));
                dispatch(setInternalCallDetails(undefined));
                if (isInboundCall) {
                    setIsInboundCall(false);
                }
            });

            contact.onError(contact => {
                Logger.getInstance().error("CCP - Contact Error" , contact);
                Logger.getInstance().error("CCP - Contact Error" , contact.getDescription());
            })
        });
        connect.agent((agent) => {
            window.CCP.agent = agent;
            let agentStateList = agentStates;
            if (!agentStateList || agentStateList.length === 0) {
                const newAgentStates = agent.getAgentStates() as AgentState[];
                agentStateList = newAgentStates;
                if (newAgentStates?.length > 0) {
                    dispatch(setAgentStates(newAgentStates));
                }
            }


            agent.onStateChange(agentStateChange => {
                let stateToSet = agentStateChange.newState;
                updateAgentStatus(stateToSet, agentStateList);
                dispatch(updateUserStatus(stateToSet));
                dispatch(addLiveAgentStatus({
                    status: stateToSet,
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
            });

            agent.onSoftphoneError(error => {
                Logger.getInstance().error("CCP - Softphone Error", error);
            });

            // @ts-ignore
            agent.onWebSocketConnectionLost((agent) => {
                Logger.getInstance().error("CCP - Agent Lost Websocket Connection", agent);
            });

            // @ts-ignore
            agent.onWebSocketConnectionGained((agent) => {
                Logger.getInstance().error("CCP - Agent Gained Websocket Connection", agent);
            });
        });
    }, []);

    const updateCallForwardingStatus = () => {
        if(user.callForwardingEnabled && (currentUserStatus.toString() !== ForwardingEnabledStatus && currentUserStatus.toString() !== "Offline")) {
            utils.updateCCPForwardingEnabled(true);
        } else if (currentUserStatus.toString() === ForwardingEnabledStatus && !user.callForwardingEnabled) {
            utils.updateCCPForwardingEnabled(false);
        }
    }

    useEffect(() => {
        updateCallForwardingStatus();
        const beforeUnload = () => {
            dispatch(clearCCPContext());
        };
        window.addEventListener('beforeunload', () => beforeUnload());
        return () => {
            window.removeEventListener('beforeunload', () => beforeUnload());
        }
    }, [user, currentUserStatus]);

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


    const checkConnectAttributesForValue = (botAttributes: ContextKeyValuePair[], key: string) => {
        return botAttributes?.find(a => a.label === key)?.value;
    }
    const prepareChatOrVoiceNotificationTitle = (botAttributes: ContextKeyValuePair[]) => {
        const helioContactId = checkConnectAttributesForValue(botAttributes, 'HelioContactId');
        const createdForName = checkConnectAttributesForValue(botAttributes, 'CreatedForName');
        const isInternalCall = checkConnectAttributesForValue(botAttributes, 'IsInternalCall');
        const internalCallFromUserName = checkConnectAttributesForValue(botAttributes, 'FromUserName');
        const patientFullname = checkConnectAttributesForValue(botAttributes, 'PatientFullName');
        const initialInputName = checkConnectAttributesForValue(botAttributes, 'InitialInputName');
        const welcomeVoiceName = checkConnectAttributesForValue(botAttributes, 'WelcomeName');
        const incomingPhoneNumber = checkConnectAttributesForValue(botAttributes, 'IncomingPhoneNumber');

        if (patientFullname) {
            return `${patientFullname} (${t('ccp.bot_context.patient')})`;
        }
        if (helioContactId && createdForName) {
            return `${createdForName} (${t('ccp.bot_context.contact')})`;
        }
        if (isInternalCall && isInternalCall.toLowerCase() === "true" && internalCallFromUserName) {
            return `${internalCallFromUserName} (${t('ccp.bot_context.internal')})`;
        }
        if (createdForName) {
            return createdForName;
        }
        if (initialInputName) {
            return initialInputName;
        }
        if (welcomeVoiceName) {
            return welcomeVoiceName;
        }
        if (incomingPhoneNumber) {
            return incomingPhoneNumber;
        }
        return '';
    }
    const prepareChatOrVoiceNotificationContent = (botAttributes: ContextKeyValuePair[], queueName?: string) => {
        const reason = checkConnectAttributesForValue(botAttributes, 'CallerMainIntent');
        let recognizedReasonFromIntent = '';
        if (reason && reason !== 'none') {
            recognizedReasonFromIntent = Intent[reason];
        }
        return `${queueName || ''}\n${recognizedReasonFromIntent ?? utils.spaceBetweenCamelCaseWords(reason || '')}`;
    }

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

    const {displayNotification} = useBrowserNotification();
    const notificationContent = useSelector(selectCcpNotificationContent);

    useEffect(() => {
        if (notificationContent) {
            displayBrowserNotification();
            dispatch(setCcpNotificationContent(undefined));
        }
    }, [notificationContent])

    const displayBrowserNotification = () => {
        if (!notificationContent) {
            return;
        }
        const icon = `${utils.getAppParameter('NotificationIconsLocation')}notification-${notificationContent.type}.png`;
        const notification: NotificationOptions = {
            body: notificationContent.body,
            tag: String(Date.now()),
            icon
        }
        const notificationOnClickHandler = () => {
            if (!isCcpVisibleRef.current) {
                dispatch(toggleCcp());
            }
        }
        switch (notificationContent.type) {
            case connect.ContactType.CHAT:
                if (user?.chatNotification) {
                    displayNotification(notificationContent.title, notification, notificationOnClickHandler);
                }
                break;
            case connect.ContactType.VOICE:
                if (user?.callNotification) {
                    displayNotification(notificationContent.title, notification, notificationOnClickHandler);
                }
                break;
        }
    }

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
            <div className={`ccp-main ${animateToggle ? 'ccp-toggle-animate' : ''} ` + (isCcpVisibleRef.current ? 'block' : 'hidden')}
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
                        {ccpConnectionState === CCPConnectionStatus.Loading && <div className='ccp-loading-background h-full'><Spinner fullScreen={true} title={t('ccp.logging_in')} /></div>}
                        <div data-test-id='ccp-container' id='ccp-container'
                             className={`h-full overflow-hidden ccp-drag-background ${ccpConnectionState === CCPConnectionStatus.Loading ? 'hidden' : 'block'}`} />
                        {ccpConnectionState === CCPConnectionStatus.Success &&
                            <div className={`flex justify-center items-center w-full p-0 box-content shadow-md border-t footer-ff ccp-bottom-bar block`}>
                                {botContext &&
                                    <>
                                        <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.bot, 'background')}`}>
                                            <SvgIcon type={Icon.Bot}
                                                     className='cursor-pointer icon-medium'
                                                     onClick={() => dispatch(setContextPanel(contextPanels.bot))}
                                                     fillClass={applyProperIconClass(contextPanels.bot)} />
                                        </span>
                                        <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.note, 'background')}`}>
                                            <SvgIcon type={Icon.Note}
                                                     className='cursor-pointer icon-medium'
                                                     fillClass={applyProperIconClass(contextPanels.note)}
                                                     onClick={() => dispatch(setContextPanel(contextPanels.note))} />
                                        </span>
                                        <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.sms, 'background')}`}>
                                            <SvgIcon type={Icon.Sms}
                                                     className='cursor-pointer icon-medium'
                                                     fillClass={applyProperIconClass(contextPanels.sms)}
                                                     onClick={() => dispatch(setContextPanel(contextPanels.sms))} />
                                        </span>
                                        <span className={`h-10 flex items-center justify-center w-12 ccp-botom-icon-background`}>
                                            <SvgIcon type={Icon.Tickets}
                                                     className='cursor-pointer icon-medium'
                                                     fillClass={applyProperIconClass('')}
                                                     onClick={() => history.push('/tickets/' + botContext?.ticket?.ticketNumber)} />
                                        </span>
                                    </>
                                }
                                <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.extensions, 'background')}`}>
                                    <SvgIcon type={Icon.Extension}
                                             className='cursor-pointer icon-medium'
                                             fillClass={applyProperIconClass(contextPanels.extensions)}
                                             onClick={() => dispatch(currentContext === contextPanels.extensions ? setContextPanel('') : setContextPanel(contextPanels.extensions))} />
                                </span>
                            </div>}
                    </div>
                    <CcpContext />
                </div>
            </div>
        </>
    );
}

export default withErrorLogging(Ccp);
