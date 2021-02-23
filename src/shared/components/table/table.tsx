import React from "react";

interface TableProps {
    headings: string[],
    rows: Row[],
    dividerLine?: boolean
}

export interface Row {
    label: string,
    values: string[]
}

const Table = ({headings, rows, dividerLine}: TableProps) => {
    let count = rows.length;
    let colSize = rows[0]?.values.length === 1 ? 3 : 7;
    let spanSize = rows[0]?.values.length === 1 ? 2 : 3;

    let headingColSize = headings.length === 1 ? 1 : (headings.length === 2 ? 3 : 7);
    let headingSpanSize = headings.length === 1 ? 1 : (headings.length === 2 ? 2 : 3);

    return <div>
        <div className={`grid grid-cols-${headingColSize} text-gray-400 py-2`}>
            <div className="text-gray-400">{headings[0]}</div>
            {headings.slice(1).map(heading => {
                return <div className={`grid col-span-${headingSpanSize} pl-4`}>
                    {heading}
                </div>
            })
            }
        </div>
        <div className={`grid gap-1 pt-3`}>
            {
                rows.map((row, index) => {
                    const isEmptyRow = row.label === "" && row.values.every(v => v === "");
                    return !isEmptyRow && <div key={index} className={`grid grid-cols-${colSize} ${dividerLine ? 'border-b  py-1' : ' py-0.5'}`}>
                        <div>
                            {row.label}
                        </div>
                        {row.values.map((value, index) => {
                            return <div className={`col-span-${spanSize} ${index === 0 ? " font-bold" : null} pl-4`}>
                                {value}
                            </div>
                        })}
                    </div>
                })
            }
        </div>
    </div>
};

export default Table;
