import {useTranslation} from 'react-i18next';
import PatientChartList, {Row} from '@pages/patients/components/patient-chart-list';
import {useSelector} from 'react-redux';
import {selectPatient} from '@pages/patients/store/patients.selectors';

const OutstandingBalances = () => {
    const {t} = useTranslation();
    const patient = useSelector(selectPatient);
    const toDollars = (value: number) => {
        return '$' + value.toFixed(2);
    };

    const getComment = () => {
        const patientCollectionsBalance = patient.outstandingBalance.collectionsBalance
        const collectionsBalance = toDollars(patientCollectionsBalance);
        if (collectionsBalance) {
            return <span className='body2 '>
                <span className={patientCollectionsBalance > 0 ? 'subtitle in-collections-value' : ''}>{collectionsBalance}</span>
                {patientCollectionsBalance > 0 && <span className='body3'>{` (${t('patient.summary.in_collections')})`}</span>}
            </span>
        } else {
            return '';
        }
    }

    const outstandingBalanceRows: Row[] = [
        {
            label: t('patient.summary.statement'),
            values: [toDollars(patient.outstandingBalance.statement)],
            comment: getComment()
        },
        { label: t('patient.summary.payment_plan'), values: [toDollars(patient.outstandingBalance.paymentPlan)] }
    ];

    return (
        <div className='grid grid-cols-2 gap-12 pt-3.5'>
            <div>
                <div className='border-b pb-2 pt-3.5'>
                    <div className='body1'>{t('patient.summary.outstanding_balances')} </div>
                </div>
                <div className='pt-3'>
                    <PatientChartList rows={outstandingBalanceRows} dividerLine={true}/>
                </div>
            </div>            
        </div>
    );
};

export default OutstandingBalances;
