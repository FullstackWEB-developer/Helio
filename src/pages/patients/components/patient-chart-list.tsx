import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import classNames from 'classnames';
import {useHistory} from 'react-router-dom';
import {EmailPath} from '@app/paths';
import {NEW_EMAIL} from '@pages/email/constants';

interface PatientChartListProps {
    headings?: string[],
    rows: Row[],
    dividerLine?: boolean,
    isLongValue?: boolean,
    patient?: ExtendedPatient
}

export interface Row {
    label: string,
    values: string[],
    comment?: any,
    isStatus?: boolean,
    canCall?: boolean,
    rowClass?: string;
    canEmail?: boolean;
}

const PatientChartList = ({headings, rows, dividerLine, isLongValue, patient}: PatientChartListProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    let colSize = 7;
    let spanSize = 3;

    if (isLongValue) {
        colSize = 5;
        spanSize = 4;
    } else if (rows[0]?.values.length === 1) {
        colSize = 3;
        spanSize = 1;
    }

    let headingColSize = 7;
    let headingSpanSize = 3;

    if (headings?.length === 1) {
        headingColSize = 1;
        headingSpanSize = 1;
    } else if (headings?.length === 2) {
        headingColSize = 3;
        headingSpanSize = 2;
    }

    const getEligibleTextClassName = (row: Row) => {
        return `${row.values[0] === t('patient.insurance.eligible') ? 'text-success' : 'text-danger'} pl-4`;
    }

    const rowClassName = (row: Row) => classNames(`col-span-${spanSize} body2 pl-4 ${row.rowClass}`, {
        'text-success': row.canCall || row.canEmail
    })

    const rowClicked= (row: Row, value: string) =>{
        if (row.canCall) {
            utils.initiateACall(value);
        } else if (row.canEmail) {
            history.push(`${EmailPath}/${NEW_EMAIL}`, {
                patient
            });
        }
    }

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
        <div className={`grid gap-0.5 pt-2`}>
            {
                rows.map((row, index) => {
                    const isEmptyRow = row.label === '' && row.values.every(v => v === '');
                    return !isEmptyRow && <div key={index}
                                               className={`grid grid-cols-${colSize} ${dividerLine ? 'border-b py-1' : ''}`}>
                        <div className='body2-medium'>
                            {row.label}
                        </div>
                        {row.isStatus ? <span className='body2'>
                            <span
                                className={getEligibleTextClassName(row)}>
                                {row.values[0]}
                            </span>

                            </span> :
                            row.values.map((value, i) => {
                                return <div key={i} className={rowClassName(row)}>
                                    <div className='flex flex row px-2'>
                                        <div className={`flex flex row px-2 ${(row.canCall || row.canEmail) ? ' cursor-pointer hover:underline' : ''}`}  onClick={()  => rowClicked(row, value)}>
                                            <div>
                                                {value || t('common.not_available')}
                                            </div>
                                        </div>
                                    </div>
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
