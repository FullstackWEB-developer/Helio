import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {useTranslation} from 'react-i18next';

interface PatientChartListProps {
    headings?: string[],
    rows: Row[],
    dividerLine?: boolean
}

export interface Row {
    label: string,
    values: string[],
    comment?: any,
    isStatus?: boolean
}

const PatientChartList = ({headings, rows, dividerLine}: PatientChartListProps) => {
    const { t } = useTranslation();
    const colSize = rows[0]?.values.length === 1 ? 3 : 7;
    const spanSize = rows[0]?.values.length === 1 ? 1 : 3;

    const headingColSize = headings && headings.length === 1 ? 1 : (headings && headings.length === 2 ? 3 : 7);
    const headingSpanSize = headings && headings.length === 1 ? 1 : (headings && headings.length === 2 ? 2 : 3);

    return <div>
        {headings && <div className={`grid grid-cols-${headingColSize} py-2`}>
            <div className='h8'>{headings[0]}</div>
            {headings.slice(1).map((heading, index) => {
                return <div key={index} className={`grid col-span-${headingSpanSize} pl-4`}>
                    {heading}
                </div>
            })
            }
        </div>}
        <div className={`grid gap-1 pt-3`}>
            {
                rows.map((row, index) => {
                    const isEmptyRow = row.label === '' && row.values.every(v => v === '');
                    return !isEmptyRow && <div key={index}
                                               className={`grid grid-cols-${colSize} ${dividerLine ? 'border-b py-1' : ' py-0.5'}`}>
                        <div className='body2-medium'>
                            {row.label}
                        </div>
                        {row.isStatus ? <span className='body2'>
                            <span
                                className={`${row.values[0] === t('patient.insurance.eligible') ? 'text-success' : 'text-danger'} pl-4`}>
                                {row.values[0]}
                            </span>

                            </span> :
                            row.values.map((value, i) => {
                                return <div key={i}
                                            className={`col-span-${spanSize} body2 pl-4`}>
                                    {value}
                                </div>
                            })}
                        {row.comment}
                    </div>
                })
            }
        </div>
    </div>
};

export default withErrorLogging(PatientChartList);
