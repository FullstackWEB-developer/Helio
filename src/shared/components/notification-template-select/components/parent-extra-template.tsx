import NotificationLabResult from '@components/notification-template-select/components/notification-lab-result';
import React, {useEffect, useState} from 'react';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {useTranslation} from 'react-i18next';
import SvgIcon, {Icon} from '@components/svg-icon';
import classnames from 'classnames';

export type NotificationTemplateContainerType = 'ccp' | 'ticket' | 'sms' | 'email';
export interface ParentExtraTemplateProps {
    patient?: ExtendedPatient;
    logicKey: string;
    parentType? : NotificationTemplateContainerType
}

const ParentExtraTemplate = ({logicKey, patient, parentType }: ParentExtraTemplateProps) =>  {
    const {t} = useTranslation();
    const [dropdownLabel, setDropdownLabel] = useState<string>('');
    const [element, setElement] = useState<JSX.Element>();
    const [isOpen, setOpen] = useState<boolean>(false);
    const supportedLogicKeys = ['LabResult'];

    useEffect(() => {
        switch (logicKey) {
            case 'LabResult': {
                setDropdownLabel('tickets.notifications.lab_results.view_recent_labs');
                if (patient) {
                    setElement(<NotificationLabResult patientId={patient?.patientId} departmentId={patient?.departmentId} parentType={parentType} />)
                }
                break;
            }
        }
    }, [logicKey, patient]);

    if (!supportedLogicKeys.includes(logicKey)) {
        return <></>;
    }

    const wrapperClassName = classnames('flex flex-col',
        {
            'pt-5': parentType === 'sms' || parentType === 'ticket',
            'pb-5': parentType === 'ccp'
        });

    return <div className={wrapperClassName}>
        <div className='flex flex-row cursor-pointer' onClick={() => setOpen(!isOpen)}>
            <div className='body2'>
                {t(dropdownLabel)}
            </div>
            <div>
                <SvgIcon type={isOpen ? Icon.ArrowUp : Icon.ArrowDown} className='icon-medium'/>
            </div>
        </div>
        {isOpen && <div className={`pt-4`}>
            {element}
        </div>}
    </div>
}

export default ParentExtraTemplate;
