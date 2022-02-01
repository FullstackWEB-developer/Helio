import React, {useRef, useState} from 'react';
import {customHooks} from '@shared/hooks';
import SvgIcon, {Icon} from '@components/svg-icon';
import Tooltip from '@components/tooltip/tooltip';
import './conversation-header-popup.scss';
import Button from '@components/button/button';
import utils from '@shared/utils/utils';
import {useHistory} from 'react-router';
import {ContactsPath} from '@app/paths';

interface ConversationHeaderPopup {
    anonymous: boolean;
    name: string;
    photo: JSX.Element
}
const ConversationHeaderPopup = ({anonymous, name, photo}: ConversationHeaderPopup) => {
    const [headerPopup, setHeaderPopup] = useState(false);
    const popupRef = useRef(null);
    const tooltipDiv = useRef<HTMLDivElement>(null);
    customHooks.useOutsideClick([tooltipDiv], () => {
        setHeaderPopup(false);
    });
    const history = useHistory();
    const redirectToAthena = () => {window.open(utils.getAppParameter('AthenaHealthUrl'), '_blank')};
    const redirectToContactScreen = () => {history.push(ContactsPath, {email: name})};
    const renderActions = () => {
        if (anonymous) {
            return (
                <>
                    <Button label='email.inbox.create_patient_chart' onClick={redirectToAthena} />
                    <Button label='email.inbox.add_contact' className='ml-6' onClick={redirectToContactScreen} />
                </>
            );
        }
    }
    return (
        <div ref={tooltipDiv}>
            <div ref={popupRef} className='cursor-pointer' onClick={() => setHeaderPopup(!headerPopup)}>
                <SvgIcon type={!headerPopup ? Icon.ArrowDown : Icon.ArrowUp}
                    fillClass='rgba-062-fill' />
            </div>
            <Tooltip targetRef={popupRef} isVisible={headerPopup}
                 showArrow={false}>
                <div className='conversation-popup-width'>
                    <div className='px-4 py-6 flex items-center'>
                        {photo}
                        <h6 className='pl-4'>{name}</h6>
                    </div>
                    <div className='conversation-popup-divider h-px'></div>
                    <div className='flex conversation-popup-actions px-4 pt-6 pb-8'>
                        {
                            renderActions()
                        }
                    </div>
                </div>
            </Tooltip>
        </div>
    )
}

export default ConversationHeaderPopup;