import {TableColumnModel} from './table.models';
import {useTranslation} from 'react-i18next';
import './table-header.scss';
import React from 'react';

export interface TableHeaderProps {
    headers?: TableColumnModel[],
    className?: string
}

const TableHeader = ({headers, className}: TableHeaderProps) => {
    const {t} = useTranslation();

    if (!headers) {
        return null;
    }
    const content = headers.map((header) => {
        const {headerClassName, field, widthClass, alignment = 'start', title} = header;
        const className = `flex ${headerClassName ? headerClassName : ''} ${widthClass} justify-${alignment}`;
        if (typeof title === 'string') {
            return <div key={field} className={className}>{t(title)}</div>;
        } else if (React.isValidElement(title)) {
            return <div key={field} className={className}>{title}</div>;
        }
        return null;
    });

    return <div
        className={`flex flex-row caption-caps table-header px-4 h-8 items-center ${className ? className : ''}`}>
        {content}
    </div>;
}

export default TableHeader;
