import {GetLabResultsProviderPicture} from '@constants/react-query-constants';
import {getProviderPicture} from '@shared/services/user.service';
import {selectProviderById} from '@shared/store/lookups/lookups.selectors';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {RootState} from 'src/app/store';
import {LabResultDetail} from '../models/lab-result-detail.model';

const LabResultDetailProviderComment = ({labResultDetail}: {labResultDetail: LabResultDetail}) => {
    const {t} = useTranslation();
    const provider = useSelector((state: RootState) => selectProviderById(state, labResultDetail.providerId));
    const {data} = useQuery([GetLabResultsProviderPicture, labResultDetail.providerId],
        () => getProviderPicture(labResultDetail.providerId));

    return (
        <div className='w-full p-6 lab-results-border flex flex-col'>
            <span className='subtitle pb-5'>{t('external_access.lab_results.providers_comment')}</span>
            <div className='flex flex-row items-start'>
                {
                    data && <img src={data} className='mr-6 h-24 w-24 lab-results-provider-picture' alt='provider' />
                }
                <div className='flex flex-col'>
                    <span className='subtitle2 pb-3'>{provider?.displayName || ''}</span>
                    <span className='body2'>{labResultDetail?.patientNote || ''}</span>
                </div>
            </div>
        </div>
    )
}

export default LabResultDetailProviderComment;
