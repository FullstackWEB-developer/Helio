import React from 'react';
import './select-cell.scss';
import { useTranslation } from 'react-i18next';
import { Option } from '@components/option/option';
export interface SelectCellProps {
    item: Option,
    isSelected?: boolean,
    onClick: (item: Option) => void,
    disabled?: boolean
}

const SelectCell = ({ item, isSelected, onClick, disabled }: SelectCellProps) => {

    const { t } = useTranslation();

    const calculateCss = (): string => {
        let cssClass = ''
        if (isSelected) {
            cssClass = cssClass + ' body2-white ';
        }
        else {
            cssClass = cssClass + ' body2 ';
        }
        return cssClass;
    }
    const bgCssClass = isSelected ? ' is-selected ' : ' cursor-pointer '

    const cellClicked = () => {
        if (onClick) {
            onClick(item);
        }
    }

    if (disabled) return null;

    return (
        <div onClick={() => cellClicked()} onMouseDown={(e) => { e.preventDefault() }}
            className={`w-full select-cell justify-between flex items-center ${calculateCss()} ${bgCssClass}`}>
            <div data-test-id='select-cell-icon-content' className={'flex flex-row w-full items-center'}>
                <div className='flex items-center pl-4' data-test-id={`select-cell-text-${item.label}`}>{t(item.label)}</div>
            </div>
        </div>
    );
}

export default SelectCell;
