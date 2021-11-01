import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import SvgIcon, {Icon} from '@components/svg-icon';
import { Link } from 'react-router-dom';
import {SmsPath} from '@app/paths';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import classNames from 'classnames';

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
    canSendSms?: boolean
}

const PatientChartList = ({headings, rows, dividerLine, isLongValue, patient}: PatientChartListProps) => {
    const { t } = useTranslation();

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

    const rowClassName = (row: Row) => classNames(`col-span-${spanSize} body2 pl-4`, {
        'text-success cursor-pointer': row.canCall,
        'col-span-2' : row.canSendSms,
        'hover:underline' : row.canCall || row.canSendSms
    })

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
                                        {row.canSendSms && <Link
                                            to={{
                                                pathname:SmsPath,
                                                state: {
                                                    patient
                                                }
                                            }}>
                                            <SvgIcon type={Icon.Sms}
                                                     fillClass='success-icon'
                                                     strokeClass='contact-stroke-color'
                                            />
                                        </Link>}
                                        <div className='flex flex row px-2'  onClick={() => row.canCall ? utils.initiateACall(value) : undefined}>
                                            <div>
                                                {row.canCall && <SvgIcon type={Icon.Phone} fillClass='success-icon' />}
                                            </div>
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
