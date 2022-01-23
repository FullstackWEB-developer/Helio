import SvgIcon, {Icon} from '@components/svg-icon';
import classnames from 'classnames';
import Tooltip from '@components/tooltip/tooltip';
import {useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import customHooks from '../../../hooks/customHooks';
import {Patient} from '@pages/patients/models/patient';
import {ContactExtended} from '@shared/models';

export interface SearchboxAddIconProps{
    onClick: () => void;
    type: 'sms' | 'email',
    patient?: Patient,
    contact?: ContactExtended
}

const SearchboxAddIcon = ({onClick, type, patient, contact}: SearchboxAddIconProps) => {

    const {t} = useTranslation();
    const addIconRef = useRef(null);
    const [isToolTipVisible, setToolTipVisible] = useState(false);


    const canSend = useMemo(() => {
        if (patient) {
            if (type === 'sms') {
                return !!patient.mobilePhone && patient.consentToText;
            }
            return !!patient.emailAddress
        } else if (contact) {
            if (type === 'sms') {
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

    return <div className='flex items-center justify-center w-1/12 '>
        <div ref={addIconRef}>
            <SvgIcon
                fillClass={classnames({"rgba-025-fill": !canSend, "default-toolbar-icon": canSend })}
                type={Icon.AddContact}
                onClick={onIconClick}
            />
        </div>
        <Tooltip targetRef={addIconRef} isVisible={isToolTipVisible} placement='bottom-end'>
            <div className="flex p-6 body2 w-80">
                {t(type === 'sms' ? 'searchbox_result.tooltip_unavailable_sms_message' : 'searchbox_result.tooltip_unavailable_email_message')}
            </div>
        </Tooltip>

    </div>
}

export default SearchboxAddIcon;
