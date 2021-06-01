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

    return <div className="px-6 py-4 flex border-b">
        <div className='flex w-11/12 xl:w-4/12 items-center' onClick={() => data.refillsAllowed ? requestRefill() : {}}>
            {data.medicationName}
        </div>
        <div className='hidden xl:flex flex-none w-8'> </div>
        <div className='xl:hidden ml-6 w-1/12'>
            <SvgIcon type={Icon.ArrowRight} fillClass='rgba-05-fill' onClick={() => data.refillsAllowed ? requestRefill() : {}} />
        </div>
        <div className='hidden xl:flex items-center w-6'>
            <div ref={tooltipDiv} className='pt-1'>
                <div ref={infoAlertIcon} onClick={() => setDisplayAlert(!displayInfoAlert)} className='cursor-pointer'>
                    <SvgIcon type={Icon.Info} fillClass='rgba-05-fill' />
                </div>
                <Tooltip targetRef={infoAlertIcon} isVisible={displayInfoAlert} placement='bottom-start'>
                    {data.unstructuredSig}
                </Tooltip>
            </div>
        </div>
        <div className='hidden xl:flex flex-none w-8 items-center'> </div>
        <div className='hidden xl:flex w-3/12 items-center'>
            {data.enteredBy}
        </div>
        <div className='hidden xl:flex flex-none w-8 items-center'> </div>
        <div className='hidden xl:flex w-1/12 items-center'>
            {data.prescribed && dayjs(data.prescribed).format('MMM DD, YYYY')}
        </div>
        <div className='hidden xl:flex flex-none w-8 items-center'> </div>
        <div className='hidden xl:flex w-1/12 items-center'>
            {data.stopDate ? dayjs(data.stopDate).format('MMM DD, YYYY') : t('common.none')}
        </div>
        <div className='hidden xl:flex flex-none w-8 items-center'> </div>
        <div className='hidden xl:flex w-2/12 items-center justify-center'>
            <Button onClick={() => requestRefill()}
                    buttonType='medium'
                    disabled={!data.refillsAllowed}
                    label='external_access.medication_refill.medication_list.request_refill' />
        </div>
    </div>
}

export default MedicationListItem;
