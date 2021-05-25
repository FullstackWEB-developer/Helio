import {useParams} from 'react-router';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';
import {downloadMedicalRecords} from '@pages/patients/services/patients.service';
import {useEffect, useState} from 'react';
import {AxiosError} from 'axios';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';

const DownloadMedicalRecord = () => {
    const {t} = useTranslation();
    const [message, setMessage] = useState('external_access.medical_records_request.downloading_file')
    const { linkId } = useParams<{ linkId: string }>();

    const downloadZipMutation = useMutation(downloadMedicalRecords,
        {
            onError: (error: AxiosError) => {
                if (error.response?.status === 404) {
                    setMessage('external_access.medical_records_request.file_not_found');
                } else {
                    setMessage('external_access.medical_records_request.file_download_failed');
                }
            },
            onSuccess: () => {
                setMessage('external_access.medical_records_request.file_downloaded');
            }
        });

    useEffect(() => {
        downloadZipMutation.mutate({
            linkId
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linkId])

    if (downloadZipMutation.isLoading) {
        return <div className='flex flex-col'>
            <div><ThreeDots/></div>
            <div>{t('external_access.medical_records_request.downloading_file')}</div>
        </div>
    }

    return <div>{t(message)}</div>
}

export default DownloadMedicalRecord;
