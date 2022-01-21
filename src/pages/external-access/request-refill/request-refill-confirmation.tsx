import React from 'react';
import {useTranslation} from 'react-i18next';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {Link} from 'react-router-dom';
import {ViewMedicationsPath} from '@app/paths';

const RequestRefillConfirmation = () => {
    const {t} = useTranslation();



    return <div className='2xl:px-48 pt-7 without-default-padding'>
        <Link to={ViewMedicationsPath}>
            <div className='flex flex-row pb-5 cursor-pointer'>
                <SvgIcon type={Icon.ArrowBack} />
                <div className='body2 pl-4'>
                    {t('external_access.medication_refill.back_to_medications')}
                </div>
            </div>
        </Link>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.medication_refill.refill_request_sent')}
            </h4>
        </div>
        <div className='pt-9 pb-8'>
            {t('external_access.medication_refill.refill_request_sent_details')}
        </div>
    </div>
}

export default RequestRefillConfirmation;
