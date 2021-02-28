import { useSelector } from 'react-redux';
import { selectPatientChartSummary } from '../../store/patients.selectors';
import { useTranslation } from 'react-i18next';
import Table, { Row } from '../../../../shared/components/table/table';

const OutstandingBalances = () => {
    const { t } = useTranslation();
    const patientChartSummary = useSelector(selectPatientChartSummary);

    const toDollars = (value: number) => {
        return '$' + value.toFixed(2);
    };

    const outstandingBalanceRows: Row[] = [
        { label: t('patient.summary.statement'), values: [toDollars(patientChartSummary.outstandingBalance.statement)] },
        { label: t('patient.summary.payment_plan'), values: [toDollars(patientChartSummary.outstandingBalance.paymentPlan)] },
        { label: t('patient.summary.prepayment_plan'), values: [toDollars(patientChartSummary.outstandingBalance.prePaymentPlan)] }
    ];

    const totalBalanceRows: Row[] = [
        { label: t('patient.summary.total'), values: ['?'] },
        { label: t('patient.summary.insurance'), values: ['?'] },
        { label: t('patient.summary.patient'), values: ['?'] }
    ];

    return (
        <div>
            <div className='grid grid-cols-2 border-b pb-1 pt-8'>
                <div className={'font-bold text-lg'}>{t('patient.summary.outstanding_balances')} </div>
            </div>
            <div className='grid grid-cols-2 gap-12 pt-3'>
                <Table headings={[t('patient.summary.total_balances')]} rows={totalBalanceRows}
                    dividerLine={true} />
                <Table headings={[t('patient.summary.patient_outstanding_balance')]} rows={outstandingBalanceRows}
                    dividerLine={true} />
            </div>
        </div>
    );
};

export default OutstandingBalances;
