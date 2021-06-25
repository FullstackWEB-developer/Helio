import React from 'react';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {GetLabResultDetailImage} from '@constants/react-query-constants';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {LabResultDetailPage} from '../models/lab-result-detail-page.model';
import {getPatientLabResultDetailImage} from '../services/lab-results.service';
import {useTranslation} from 'react-i18next';

const LabResultDetailPageImage = ({page, labResultId}: {page: LabResultDetailPage, labResultId: number}) => {

    const verifiedPatient = useSelector(selectVerifiedPatent);
    const {t} = useTranslation();
    const {isLoading, data, isError} = useQuery([GetLabResultDetailImage, labResultId, page.pageId],
        () => getPatientLabResultDetailImage(verifiedPatient.patientId, labResultId, page.pageId));

    const determineContentType = () => {
        return data?.contentType?.slice(0, data.contentType.indexOf(';') !== -1 ? data.contentType.indexOf(';') : data.contentType.length);
    }

    if (isLoading) return <ThreeDots />;
    if (isError) return  <h6 className='text-danger py-5'>{t('external_access.lab_results.lab_results_image_error', {pageNumber: page.pageId})}</h6>;
    return (
        <div className='w-full'>
            {
                data?.contentType && data?.content &&
                <img alt='lab result' className='w-full object-contain' src={`data:${determineContentType()};base64,${data.content}`} />
            }
        </div>
    )
}

export default LabResultDetailPageImage;
