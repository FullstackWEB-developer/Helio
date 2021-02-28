import ContactInformation from './contact-information';
import OutstandingBalances from './outstanding-balances';
import PrimaryInsuranceInformation from './primary-insurance-information';
import Appointments from './appointments';
import { useSelector } from 'react-redux';
import { selectIsSummaryError, selectSummaryLoading } from '../../store/patients.selectors';
import ThreeDots from '../../../../shared/components/skeleton-loader/skeleton-loader';
import { useTranslation } from 'react-i18next';

const PatientSummary = () => {
    const { t } = useTranslation();
    const isLoading = useSelector(selectSummaryLoading);
    const isError = useSelector(selectIsSummaryError);
    return (
        !isLoading && !isError ?
            <>
                <ContactInformation />
                <OutstandingBalances />
                <PrimaryInsuranceInformation />
                <Appointments />
            </> : !isError ? <ThreeDots /> : <div className={'p-4 text-red-500'}>{t('patient.summary.error')}</div>
    );
};

export default PatientSummary;
