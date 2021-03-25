import React from 'react';
import withErrorLogging from '../../HOC/with-error-logging';

interface OldTableProps {
    headings: string[],
    rows: Row[],
    dividerLine?: boolean
}

export interface Row {
    label: string,
    values: string[]
}

const OldTable = ({headings, rows, dividerLine}: OldTableProps) => {
    const colSize = rows[0]?.values.length === 1 ? 3 : 7;
    const spanSize = rows[0]?.values.length === 1 ? 2 : 3;

    const headingColSize = headings.length === 1 ? 1 : (headings.length === 2 ? 3 : 7);
    const headingSpanSize = headings.length === 1 ? 1 : (headings.length === 2 ? 2 : 3);

    return <div>
        <div className={`grid grid-cols-${headingColSize} text-gray-400 py-2`}>
            <div className='text-gray-400'>{headings[0]}</div>
            {headings.slice(1).map((heading, index) => {
                return <div key={index} className={`grid col-span-${headingSpanSize} pl-4`}>
                    {heading}
                </div>
            })
            }
        </div>
        <div className={`grid gap-1 pt-3`}>
            {
                rows.map((row, index) => {
                    const isEmptyRow = row.label === '' && row.values.every(v => v === '');
                    return !isEmptyRow && <div key={index}
                                               className={`grid grid-cols-${colSize} ${dividerLine ? 'border-b  py-1' : ' py-0.5'}`}>
                        <div>
                            {row.label}
                        </div>
                        {row.values.map((value, i) => {
                            return <div key={i}
                                        className={`col-span-${spanSize} ${i === 0 ? ' font-bold' : null} pl-4`}>
                                {value}
                            </div>
                        })}
                    </div>
                })
            }
        </div>
    </div>
};

export default withErrorLogging(OldTable);
