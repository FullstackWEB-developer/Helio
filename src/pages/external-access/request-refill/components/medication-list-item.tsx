import { useHistory } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import Button from '@components/button/button';
import { Medication } from '@pages/external-access/request-refill/models/medication.model';
import { Icon } from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setMedication } from '@pages/external-access/request-refill/store/request-refill.slice';
import { selectMedicationsRefillRequested } from '@pages/external-access/request-refill/store/request-refill.selectors';
import MedicationRefillNotAllowed from '@pages/external-access/request-refill/components/medication-refill-not-allowed';

interface MedicationListItemProps {
    data: Medication
}

const MedicationListItem = ({ data }: MedicationListItemProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const refillRequestedMedications = useSelector(selectMedicationsRefillRequested);

    const requestRefill = () => {
        dispatch(setMedication(data));
        history.push('/o/request-refill');
    }

    const getRefillButton = () => {
        if (!data) {
            return null;
        }
        if (!data.refillsAllowed) {
            return <MedicationRefillNotAllowed />;
        }

        if (refillRequestedMedications?.find(a => a === data?.medicationName)) {
            return <div>{t('external_access.medication_refill.medication_list.refill_requested')}</div>
        }

        return <Button onClick={() => requestRefill()}
            buttonType='medium'
            label='external_access.medication_refill.medication_list.request_refill' />
    }

    return <div className="px-6 py-4 flex border-b">
        <div className='flex w-11/12 xl:w-4/12 items-center' onClick={() => data.refillsAllowed ? requestRefill() : {}}>
            {data?.medicationName}
        </div>
        <div className='hidden xl:flex flex-none w-8'> </div>
        <div className='xl:hidden ml-6 w-1/12'>
            <SvgIcon type={Icon.ArrowRight} fillClass='rgba-05-fill' onClick={() => data.refillsAllowed ? requestRefill() : {}} />
        </div>
        <div className='hidden xl:flex items-center w-6'>
            <div className='pt-1'>
                <ToolTipIcon
                    icon={Icon.Info}
                    iconFillClass='rgba-05-fill'
                    placement='bottom-start'
                >
                    <div className='px-2'>{data.unstructuredSig}</div>
                </ToolTipIcon>
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
            {getRefillButton()}
        </div>
    </div>
}

export default MedicationListItem;
