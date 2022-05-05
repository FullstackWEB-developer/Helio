import SvgIcon, {Icon} from '@components/svg-icon';
import classnames from 'classnames';
import Tooltip from '@components/tooltip/tooltip';
import {useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import customHooks from '../../../hooks/customHooks';
import {Patient} from '@pages/patients/models/patient';
import {ChannelTypes, ContactExtended} from '@shared/models';

export interface SearchboxAddIconProps{
    onClick: () => void;
    type: ChannelTypes.SMS | ChannelTypes.Email,
    patient?: Patient,
    contact?: ContactExtended
}

const SearchboxAddIcon = ({onClick, type, patient, contact}: SearchboxAddIconProps) => {

    const {t} = useTranslation();
    const addIconRef = useRef(null);
    const [isToolTipVisible, setToolTipVisible] = useState(false);


    const canSend = useMemo(() => {
        if (patient) {
            if (type === ChannelTypes.SMS) {
                return !!patient.mobilePhone && patient.consentToText;
            }
            return !!patient.emailAddress
        } else if (contact) {
            if (type === ChannelTypes.SMS) {
                return !!contact.mobilePhone
            }
            return !!contact.emailAddress
        }
    }, [type, patient, contact]);

    customHooks.useOutsideClick([addIconRef], () => {
        setToolTipVisible(false);
    });

    const onIconClick = () => {
        if (canSend) {
            onClick();
        } else {
            setToolTipVisible(true);
        }
    }

    const getUnavailableMessage = () => {
        if (patient) {
            if (type == ChannelTypes.SMS) {
                return 'searchbox_result.tooltip_unavailable_sms_message';
            } else {
                return 'searchbox_result.tooltip_unavailable_email_message';
            }
        }
        if (contact) {
            if (type == ChannelTypes.SMS) {
                return 'searchbox_result.tooltip_unavailable_sms_message_contact';
            } else {
                return 'searchbox_result.tooltip_unavailable_email_message_contact';
            }
        }
        return '';
    }

    return <div className='flex items-center justify-center w-1/12 '>
        <div ref={addIconRef}>
            <SvgIcon
                fillClass={classnames({"rgba-025-fill": !canSend, "default-toolbar-icon": canSend })}
                type={Icon.AddPhone}
                onClick={onIconClick}
            />
        </div>
        <Tooltip targetRef={addIconRef} isVisible={isToolTipVisible} placement='bottom-end'>
            <div className="flex p-6 body2 w-80">
                {t(getUnavailableMessage())}
            </div>
        </Tooltip>

    </div>
}

export default SearchboxAddIcon;
