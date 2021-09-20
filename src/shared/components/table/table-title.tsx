import {TableTitleModel} from '@components/table/table.models';
import {useTranslation} from 'react-i18next';

export interface TableTitleProps {
    model: TableTitleModel,
    isCompact: boolean
}

const TableTitle = ({model, isCompact}: TableTitleProps) => {
    const {title, style = 'default'} = model;
    const {t} = useTranslation();

    const calculateCss = () => {
        if (style === 'primary') {
            return 'pb-2.5 h8';
        }
        if (isCompact) {
            return 'subtitle pb-3';
        }
        return 'subtitle pb-5';
    }


    return <>
        <div className={calculateCss()}>{t(title)}</div>
    </>;
}

export default TableTitle;
