import React, {useEffect, useRef, useState} from 'react';
import { ReactComponent as Bot } from '../../shared/icons/Icon-Bot-24px.svg';
import { ReactComponent as Note } from '../../shared/icons/Icon-Note-24px.svg';
import { ReactComponent as Tickets } from '../../shared/icons/Icon-Tickets-24px.svg';
import { ReactComponent as Sms } from '../../shared/icons/Icon-SMS-24px.svg';
import { ReactComponent as Email } from '../../shared/icons/Icon-Email-24px.svg';
import { ReactComponent as Scripts } from '../../shared/icons/Icon-Scripts-24px.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import 'amazon-connect-streams';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import { isCcpVisibleSelector } from '../../shared/layout/store/layout.selectors';
import { setAssignee } from '../tickets/services/tickets.api';
import { setChatCounter, setVoiceCounter } from './store/ccp.slice';
import { authenticationSelector } from '../../shared/store/app-user/appuser.selectors';
import { useDrag } from 'react-dnd';
import { DndItemTypes } from '../../shared/layout/dragndrop/dnd-item-types';
import './ccp.scss';
import { toggleCcp } from "../../shared/layout/store/layout.slice";
import {useTranslation} from "react-i18next";

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

const Ccp: React.FC<BoxProps> = ({
                                     id,
                                     left,
                                     top
                                 }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const username = useSelector(authenticationSelector).username;
    const [isHover, setHover] = useState(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);

    const isCcpVisibleRef = useRef();
    isCcpVisibleRef.current = useSelector(isCcpVisibleSelector);

    useEffect(() => {
        let ccpContainer = document.getElementById("ccp-container");       
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
                if(!isCcpVisibleRef.current){
                    dispatch(toggleCcp());
                }
            });

            contact.onConnected(() => {
                let attributeMap = contact.getAttributes();
                if(attributeMap.PatientId){
                    let patientId = attributeMap.PatientId.value;
                    if(patientId){
                        history.push('/patients/' + patientId);
                    }
                }

                if(attributeMap.TicketId){
                    let ticketId = attributeMap.TicketId.value;
                    if(ticketId){
                        dispatch(setAssignee(ticketId, username));
                    }
                }
            });
        });
        connect.agent((agent) => {
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
    const [{ isDragging }, drag] = useDrag({
        item: { id, left, top, type: DndItemTypes.BOX },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div className={"ccp-main shadow-md " + (isCcpVisibleRef.current ? 'block' : 'hidden')}
             style={{ left, top}}
             onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}
        >
            <div ref={drag}
                 className={"ccp-title border pl-1.5 bg-white " + (isHover ? 'visible' : 'invisible')}>
            {t('ccp.title')}
            </div>
            <div data-test-id="ccp-container" id="ccp-container" className="w-96, h-120 overflow-hidden"></div>
            <div className={"flex justify-between w-full px-10 py-2 border-t ccp-bottom-bar " + (isBottomBarVisible ? 'block' : 'hidden')}>
                <Bot/>
                <Note/>
                <Tickets/>
                <Sms/>
                <Email/>
                <Scripts/>
            </div>
        </div>
    );
}

export const CcpWithErrors = withErrorLogging(Ccp);
