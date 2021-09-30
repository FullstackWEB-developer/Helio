import SvgIcon, {Icon} from '@components/svg-icon';
import utils from '@shared/utils/utils';
import dayjs from 'dayjs';
import classnames from 'classnames';
import {useRef, useState} from 'react';
import Tooltip from '@components/tooltip/tooltip';
import {useTranslation} from 'react-i18next';
import {Patient} from '@pages/patients/models/patient';

interface SearchBoxResultItemProps {
    onSelect?: (patient: Patient) => void;
    patient: Patient;
}
const SearchBoxResultItem = ({patient, ...props}: SearchBoxResultItemProps) => {
    const addIconRef = useRef(null);
    const [isToolTipVisible, setToolTipVisible] = useState(false);
    const {t} = useTranslation();

    const onAddIconClick = () => {
        if (!!patient.mobilePhone && !!patient.consentToText ) {
            if (props.onSelect) {
                props.onSelect(patient);
            }
        } else {
            setToolTipVisible(!isToolTipVisible);
        }
    }

    return (
        <div key={patient.patientId} className='flex flex-row w-full auto-cols-max body2 border-b relative cursor-pointer hover:bg-gray-100 px-7 items-center h-10 py-3.5'>
            <div className='uppercase flex items-center w-2/12 pr-0.5'>{utils.stringJoin(', ', patient.lastName, patient.firstName)}</div>
            <div className='flex items-center w-2/12 uppercase lx:w-1/12'>{patient.patientId}</div>
            <div className='flex items-center w-2/12 uppercase lx:w-1/12'>{dayjs(patient.dateOfBirth).format('MM/DD/YYYY')}</div>
            <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>
                {!!patient.emailAddress &&
                    <SvgIcon
                        type={Icon.CheckMark}
                        fillClass="default-toolbar-icon"
                    />}
            </div>
            <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>
                {!!patient.mobilePhone &&
                    <SvgIcon
                        type={Icon.CheckMark}
                        fillClass="default-toolbar-icon"
                    />
                }
            </div>
            <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>{patient.consentToText ? t('common.yes') : t('common.no')}</div>
            <div className='flex items-center justify-center w-1/12 '>
                <div ref={addIconRef}>
                    <SvgIcon
                        fillClass={classnames({"rgba-025-fill": !patient.mobilePhone || !patient.consentToText, "default-toolbar-icon": !!patient.mobilePhone && !!patient.consentToText })}
                        type={Icon.AddContact}
                        onClick={onAddIconClick}
                    />
                </div>
                <Tooltip targetRef={addIconRef} isVisible={isToolTipVisible} placement='bottom-end'>
                    <div className="flex p-6 body2 w-80">
                        {t('searchbox_result.tooltip_unavailable_sms_message')}
                    </div>
                </Tooltip>

            </div>
        </div>
    )
}

export default SearchBoxResultItem;
