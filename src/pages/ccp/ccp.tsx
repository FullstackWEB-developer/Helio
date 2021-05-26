import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import 'amazon-connect-streams';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {isCcpVisibleSelector} from '@shared/layout/store/layout.selectors';
import {setAssignee} from '../tickets/services/tickets.service';
import {setBotContext, setChatCounter, setContextPanel, setNoteContext, setVoiceCounter} from './store/ccp.slice';
import {authenticationSelector} from '@shared/store/app-user/appuser.selectors';
import {DragPreviewImage, useDrag} from 'react-dnd';
import {DndItemTypes} from '@shared/layout/dragndrop/dnd-item-types';
import './ccp.scss';
import {toggleCcp} from '@shared/layout/store/layout.slice';
import {useTranslation} from 'react-i18next';
import CcpContext from './components/ccp-context';
import contextPanels from './models/context-panels';
import {ccpImage} from './ccpImage';
import {setAgentStates, updateUserStatus} from '@shared/store/app-user/appuser.slice';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import Logger from '@shared/services/logger';
import {AgentState} from '@shared/models/agent-state';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {selectContextPanel} from './store/ccp.selectors';
import {useMutation} from 'react-query';

const ccpConfig = {
    region: process.env.REACT_APP_AWS_REGION,
    connectBaseUrl: process.env.REACT_APP_CONNECT_BASE_URL,
    ccpUrl: process.env.REACT_APP_CCP_ACCESS_URL,
    ccpLoginUrl: process.env.REACT_APP_CCP_LOGIN_URL
}

export interface BoxProps {
    id: any
    left: number
    top: number
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
    top
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const logger = Logger.getInstance();
    const username = useSelector(authenticationSelector).username;
    const [isHover, setHover] = useState(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const currentContext = useSelector(selectContextPanel);
    const updateAssigneeMutation = useMutation(setAssignee);
    const isCcpVisibleRef = useRef();
    isCcpVisibleRef.current = useSelector(isCcpVisibleSelector);

    useEffect(() => {
        const ccpContainer = document.getElementById('ccp-container');
        connect.core.initCCP(ccpContainer as HTMLDivElement, {
            ccpUrl: ccpConfig.connectBaseUrl! + ccpConfig.ccpUrl,
            loginPopup: true, // optional, defaults to `true`
            loginPopupAutoClose: true, // optional, defaults to `true`
            loginOptions: {
                // optional, if provided opens login in new window
                autoClose: true, // optional, defaults to `false`
                height: 600, // optional, defaults to 578
                width: 400, // optional, defaults to 433
                top: 0, // optional, defaults to 0
                left: 0, // optional, defaults to 0
            },
            loginUrl: ccpConfig.ccpLoginUrl,
            region: ccpConfig.region,
            softphone: {
                allowFramedSoftphone: true,
            },
        });
        let agentStates: AgentState[];
        const beforeUnload = (agentStates: AgentState[]) => {
            const state = agentStates.find((agentState) => agentState.name === UserStatus.Offline);
            window.CCP.agent.setState(state, {
                failure: (e: any) => {
                    logger.error('Cannot set state for agent ', e);
                }
            });
        };

        connect.contact((contact) => {
            contact.onConnecting(() => {
                if (!isCcpVisibleRef.current) {
                    dispatch(toggleCcp());
                }
            });

            contact.onConnected(() => {
                const attributeMap = contact.getAttributes();
                const queue = contact.getQueue();
                const queueName = queue.name;
                const reason = attributeMap.CallerMainIntent.value;

                if (attributeMap.PatientId) {
                    const patientId = attributeMap.PatientId.value;
                    if (patientId) {
                        history.push('/patients/' + patientId);
                    }
                }

                if (attributeMap.TicketId) {
                    let tId;
                    if (attributeMap.TicketId.value) {
                        tId = attributeMap.TicketId.value;
                        updateAssigneeMutation.mutate({ticketId: tId, assignee: username})
                    } else {
                        tId = contact.getContactId();
                    }

                    setTicketId(tId);
                    dispatch(setNoteContext({ ticketId: tId, username: username }));
                }

                dispatch(setContextPanel(contextPanels.bot));
                dispatch(setBotContext({ queue: queueName, reason }));
            });

            contact.onDestroy(() => {
                dispatch(setContextPanel(''));
            })
        });
        connect.agent((agent) => {
            window.CCP.agent = agent;

            const agentStates = agent.getAgentStates() as AgentState[];
            if (agentStates?.length > 0) {
                dispatch(setAgentStates(agentStates));
            }

            agent.onStateChange(agentStateChange => {
                dispatch(updateUserStatus(agentStateChange.newState));
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

            window.addEventListener('beforeunload', () => beforeUnload(agentStates));
        });

        return () => {
            window.removeEventListener('beforeunload', () => beforeUnload(agentStates));
        }

    }, [dispatch, history, logger, username]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ opacity }, drag, preview] = useDrag({
        item: { id, left, top, type: DndItemTypes.BOX },
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

    return (
        <>
            <DragPreviewImage src={ccpImage} connect={preview} />
            <div className={'ccp-main z-50 ' + (isCcpVisibleRef.current ? 'block' : 'hidden')}
                style={{ left, top, opacity: opacity }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                ref={drag}
            >
                <div className={'ccp-title h-8 flex items-center flex-row justify-between pl-4 body2-white ' + (isHover ? 'visible' : 'invisible')}>
                    <div>{t('ccp.title')}</div>
                    <div className='w-8 flex justify-center items-center h-full cursor-pointer' onClick={() => dispatch(toggleCcp())}>-</div>
                </div>
                <div className={'flex h-full shadow-md'}>
                    <div className={'flex flex-col h-full min-ccp-width'}>
                        <div data-test-id='ccp-container' id='ccp-container' className={`h-full overflow-hidden ccp-drag-background`}> </div>
                        <div className={`flex justify-center items-center w-full p-0 box-content shadow-md border-t footer-ff ccp-bottom-bar ${isBottomBarVisible ? 'block' : 'hidden'}`}>
                            <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.bot, 'background')}`}>
                                <SvgIcon type={Icon.Bot}
                                    className='icon-medium cursor-pointer'
                                    onClick={() => dispatch(setContextPanel(contextPanels.bot))}
                                    fillClass={applyProperIconClass(contextPanels.bot)} />
                            </span>
                            {
                                ticketId ?
                                    <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.note, 'background')}`}>
                                        <SvgIcon type={Icon.Note}
                                            className='icon-medium cursor-pointer'
                                            fillClass={applyProperIconClass(contextPanels.note)}
                                            onClick={() => dispatch(setContextPanel(contextPanels.note))} />
                                    </span>
                                    : <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.note, 'background')}`}>
                                        <SvgIcon type={Icon.Note} className='icon-medium'
                                            fillClass={applyProperIconClass(contextPanels.note)} />
                                    </span>
                            }
                            <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.tickets, 'background')}`}>
                                <SvgIcon type={Icon.Tickets}
                                    className='icon-medium cursor-pointer'
                                    fillClass={applyProperIconClass(contextPanels.tickets)}
                                    onClick={() => dispatch(setContextPanel(contextPanels.tickets))} />
                            </span>
                            <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.sms, 'background')}`}>
                                <SvgIcon type={Icon.Sms}
                                    className='icon-medium cursor-pointer'
                                    fillClass={applyProperIconClass(contextPanels.sms)}
                                    onClick={() => dispatch(setContextPanel(contextPanels.sms))} />
                            </span>
                            <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.email, 'background')}`}>
                                <SvgIcon type={Icon.Email}
                                    className='icon-medium cursor-pointer'
                                    fillClass={applyProperIconClass(contextPanels.email)}
                                    onClick={() => dispatch(setContextPanel(contextPanels.email))} />
                            </span>
                            <span className={`h-10 flex items-center justify-center w-12 ${applyProperIconClass(contextPanels.scripts, 'background')}`}>
                                <SvgIcon type={Icon.Scripts}
                                    className='icon-medium cursor-pointer'
                                    fillClass={applyProperIconClass(contextPanels.scripts)}
                                    onClick={() => dispatch(setContextPanel(contextPanels.scripts))} />
                            </span>

                        </div>
                    </div>
                    <CcpContext />
                </div>
            </div>
        </>
    );
}

export default withErrorLogging(Ccp);
