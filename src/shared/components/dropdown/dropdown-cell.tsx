import React, {ReactNode} from 'react';
import './dropdown-cell.scss';
import {DropdownItemModel} from './dropdown.models';
import DropdownLink from './dropdown-link';
import {useTranslation} from 'react-i18next';


const getIcon = (icon?: ReactNode) => {
    if (icon) {
        return <div className='mr-2 dropdown-cell-icon flex justify-center items-center' data-test-id='dropdown-cell-icon'>{icon}</div>
    }
    return null;
}

export interface DropdownCellProps {
    item: DropdownItemModel;
    isSelected?: boolean;
    onClick?: (key: string, item: DropdownItemModel) => void;
}


const DropdownCell = ({item, isSelected, onClick}: DropdownCellProps) => {
    const {label = '', content, hasDivider = false, className = '', link, icon} = item;
    const {t} = useTranslation();

    const getText = (text: string, textContent?: ReactNode) => {
        if (textContent) {
            return <span data-test-id='dropdown-cell-content'>{textContent}</span>;
        } else {
            return <div className={`flex items-center ${className}`} data-test-id={`dropdown-cell-text-${text}`}>{t(text)}</div>;
        }
    }


    const calculateCss = (): string => {
        let cssClass = ''
        if (hasDivider) {
            cssClass = cssClass + ' body2 border-t';
        } else if (isSelected) {
            cssClass = cssClass + ' body2-white ';
        } else {
            cssClass = cssClass + ' body2 ';
        }
        return cssClass;
    }

    const bgCssClass = isSelected ? ' is-selected ' : ' cursor-pointer '

    const cellClicked = () => {
        if (item.disabled) {
            return;
        }
        if (onClick) {
            onClick(item.value, item);
        }
    }
    return <>
            <div onClick={() => cellClicked()}
                className={`w-full ${ content ? '' : 'px-4'} ${item.disabled ? '' : 'dropdown-cell'} justify-between flex items-center ${calculateCss()} ${className} ${bgCssClass}`}>
                <div data-test-id='dropdown-cell-icon-content' className={'flex flex-row w-full items-center'}>
                    {getIcon(icon)}
                    {getText(label, content)}
                </div>
                {link && link.onClick && <DropdownLink onClick={() => link.onClick()} title={link.title} /> }
            </div>
    </>
}

export default DropdownCell;
