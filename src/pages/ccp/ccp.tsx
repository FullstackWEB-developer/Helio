import React, {useEffect, useRef, useState} from 'react';
import {ReactComponent as Bot} from '../../shared/icons/Icon-Bot-24px.svg';
import {ReactComponent as Note} from '../../shared/icons/Icon-Note-24px.svg';
import {ReactComponent as Tickets} from '../../shared/icons/Icon-Tickets-24px.svg';
import {ReactComponent as Sms} from '../../shared/icons/Icon-SMS-24px.svg';
import {ReactComponent as Email} from '../../shared/icons/Icon-Email-24px.svg';
import {ReactComponent as Scripts} from '../../shared/icons/Icon-Scripts-24px.svg';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import 'amazon-connect-streams';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import {isCcpVisibleSelector} from '../../shared/layout/store/layout.selectors';
import {setAssignee} from '../tickets/services/tickets.service';
import {setBotContext, setChatCounter, setContextPanel, setNoteContext, setVoiceCounter} from './store/ccp.slice';
import {authenticationSelector} from '../../shared/store/app-user/appuser.selectors';
import {DragPreviewImage, useDrag} from 'react-dnd';
import {DndItemTypes} from '../../shared/layout/dragndrop/dnd-item-types';
import './ccp.scss';
import {toggleCcp} from '../../shared/layout/store/layout.slice';
import {useTranslation} from 'react-i18next';
import CcpContext from './components/ccp-context';
import contextPanels from './models/context-panels';
import {ccpImage} from './ccpImage';

const ccpConfig = {
    region: process.env.REACT_APP_AWS_REGION,
    ccpUrl: process.env.REACT_APP_CCP_ACCESS_URL || '',
    ccpLoginUrl: process.env.REACT_APP_CCP_LOGIN_URL || ''
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
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const username = useSelector(authenticationSelector).username;
    const [isHover, setHover] = useState(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);
    const [ticketId, setTicketId] = useState('');

    const isCcpVisibleRef = useRef();
    isCcpVisibleRef.current = useSelector(isCcpVisibleSelector);

    useEffect(() => {
        const ccpContainer = document.getElementById('ccp-container');
        connect.core.initCCP(ccpContainer as HTMLDivElement, {
            ccpUrl: ccpConfig.ccpUrl,
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
                        dispatch(setAssignee(tId, username));
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
            agent.onRefresh(ag => {
                const numberOfChats = ag.getContacts(connect.ContactType.CHAT).length;
                dispatch(setChatCounter(numberOfChats));

                const numberOfVoices = ag.getContacts(connect.ContactType.VOICE).length;
                dispatch(setVoiceCounter(numberOfVoices));

                setIsBottomBarVisible(numberOfChats > 0 || numberOfVoices > 0);
            });
        });

    }, [dispatch, history, username]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{opacity}, drag, preview] = useDrag({
        item: {id, left, top, type: DndItemTypes.BOX},
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.3 : 1
        })
    });

    return (
        <>
            <DragPreviewImage src={ccpImage} connect={preview}/>
            <div className={'ccp-main shadow-md ' + (isCcpVisibleRef.current ? 'block' : 'hidden')}
                 style={{left, top, opacity: opacity}}
                 onMouseEnter={() => setHover(true)}
                 onMouseLeave={() => setHover(false)}
                 ref={drag}
            >
                <div className={'ccp-title border pl-1.5 bg-white ' + (isHover ? 'visible' : 'invisible')}>
                    {t('ccp.title')}
                </div>
                <div className={'flex h-full'}>
                    <div className={'flex flex-col h-full'}>
                        <div data-test-id='ccp-container' id='ccp-container' className='h-full overflow-hidden ccp-drag-background'> </div>
                        <div className={'flex justify-between w-full px-10 py-2 shadow-md  border-t ccp-bottom-bar ' + (isBottomBarVisible ? 'block' : 'hidden')}>
                            <Bot className='cursor-pointer' onClick={() => dispatch(setContextPanel(contextPanels.bot))} />
                            {
                                ticketId ? <Note className='cursor-pointer' onClick={() => dispatch(setContextPanel(contextPanels.note))} /> : <Note />
                            }
                            <Tickets className='cursor-pointer' onClick={() => dispatch(setContextPanel(contextPanels.tickets))} />
                            <Sms className='cursor-pointer' onClick={() => dispatch(setContextPanel(contextPanels.sms))} />
                            <Email className='cursor-pointer' onClick={() => dispatch(setContextPanel(contextPanels.email))} />
                            <Scripts className='cursor-pointer' onClick={() => dispatch(setContextPanel(contextPanels.scripts))} />
                        </div>
                    </div>
                    <CcpContext />
                </div>
            </div>
        </>
    );
}

export default withErrorLogging(Ccp);
