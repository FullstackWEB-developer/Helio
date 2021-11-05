import {TableSize, TableTitleModel} from '@components/table/table.models';
import {useTranslation} from 'react-i18next';

export interface TableTitleProps {
    model: TableTitleModel,
    size: TableSize
}

const TableTitle = ({model, size}: TableTitleProps) => {
    const {title, style = 'default'} = model;
    const {t} = useTranslation();

    const calculateCss = () => {
        if (style === 'primary') {
            return 'pb-2.5 h8';
        }
        if (size === 'compact') {
            return 'subtitle pb-3';
        }
        return 'subtitle pb-5';
    }


    return <>
        <div className={calculateCss()}>{t(title)}</div>
    </>;
}

export default TableTitle;
