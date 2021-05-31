import {useHistory} from 'react-router-dom';
import React, {useRef, useState} from 'react';
import Button from '@components/button/button';
import {Medication} from '@pages/external-access/request-refill/models/medication.model';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import Tooltip from '@components/tooltip/tooltip';
import {useDispatch} from 'react-redux';
import {setMedication} from '@pages/external-access/request-refill/store/request-refill.slice';

interface MedicationListItemProps {
    data: Medication
}

const MedicationListItem = ({data}: MedicationListItemProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const infoAlertIcon = useRef(null);
    const [displayInfoAlert, setDisplayAlert] = useState<boolean>(false);
    const tooltipDiv = useRef<HTMLDivElement>(null);

    const requestRefill = () => {
        dispatch(setMedication(data));
        history.push('/o/request-refill');
    }

    return <div className="px-6 py-4 grid grid-cols-6 lg:gap-8 border-b">
        <div className='flex items-center col-span-5 lg:col-span-1' onClick={() => data.refillsAllowed ? requestRefill() : {}}>
            {data.medicationName}
        </div>
        <div className='lg:hidden col-start-6 ml-6'>
            <SvgIcon type={Icon.ArrowRight} fillClass='rgba-05-fill' onClick={() => data.refillsAllowed ? requestRefill() : {}} />
        </div>
        <div className='hidden lg:flex items-center'>
            <div ref={tooltipDiv} className='pt-1'>
                <div ref={infoAlertIcon} onClick={() => setDisplayAlert(!displayInfoAlert)} className='cursor-pointer'>
                    <SvgIcon type={Icon.Info} fillClass='rgba-05-fill' />
                </div>
                <Tooltip targetRef={infoAlertIcon} isVisible={displayInfoAlert} placement='bottom-start'>
                    {data.unstructuredSig}
                </Tooltip>
            </div>
        </div>
        <div className='hidden lg:flex items-center'>
            {data.enteredBy}
        </div>
        <div className='hidden lg:flex items-center'>
            {data.prescribed && dayjs(data.prescribed).format('MMM DD, YYYY')}
        </div>
        <div className='hidden lg:flex items-center'>
            {data.stopDate ? dayjs(data.stopDate).format('MMM DD, YYYY') : t('common.none')}
        </div>
        <div className='hidden lg:flex items-center'>
            <Button onClick={() => requestRefill()}
                    buttonType='medium'
                    disabled={!data.refillsAllowed}
                    label='external_access.medication_refill.medication_list.request_refill' />
        </div>
    </div>
}

export default MedicationListItem;
