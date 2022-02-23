import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {Trans, useTranslation} from 'react-i18next';
import { useLocation } from 'react-router';
import { DownloadMedicalRecordsProps } from '@pages/patients/services/patients.service';
const RequestMedicalRecordsSuccess = () => {
    const location = useLocation<{emailAddress?:  string}>();
    const {t} = useTranslation();

    return <div className='flex flex-col'>
        <div>
            <h4>{t('external_access.medical_records_request.title')}</h4>
        </div>
        <div className='pt-9 whitespace-pre'>
            <Trans i18nKey="external_access.medical_records_request.close_window_share" values={{ emailAddress: location?.state?.emailAddress }}>
                <span className='subtitle'>
                    {location?.state?.emailAddress}
                </span>
            </Trans>
        </div>
    </div>
}

export default withErrorLogging(RequestMedicalRecordsSuccess);
