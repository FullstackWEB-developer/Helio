import React, {ReactNode} from 'react';
import './dropdown-cell.scss';
import {DropdownItemModel} from './dropdown.models';
import DropdownLink from './dropdown-link';
import {TFunction, useTranslation} from 'react-i18next';


const getText = (t: TFunction<string>, text: string, content?: ReactNode) =>  {
    if (content) {
        return <span data-test-id='dropdown-cell-content'>{content}</span>;
    } else {
        return <div className='flex items-center' data-test-id='dropdown-cell-text'>{t(text)}</div>;
    }
}

const getIcon = (icon?: ReactNode) => {
    if (icon) {
        return <div className='mr-2 dropdown-cell-icon flex justify-center items-center' data-test-id='dropdown-cell-icon'>{icon}</div>
    }
    return null;
}

export interface DropdownCellProps {
    item: DropdownItemModel;
    isSelected?: boolean;
    onClick?: (key: string) => void;
}


const DropdownCell = ({item, isSelected, onClick}: DropdownCellProps) => {
    const {text='', content, hasDivider=false, className = '',  link, icon} = item;
    const {t} = useTranslation();
    const calculateCss = () : string => {
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
        if (onClick) {
            onClick(item.key);
        }
    }
    return <>
            <div onClick={() => cellClicked()}
                className={`w-full ${ content ? '' : 'px-4'} dropdown-cell justify-between flex items-center ${calculateCss()} ${className} ${bgCssClass}`}>
                <div data-test-id='dropdown-cell-icon-content' className={'flex flex-row w-full items-center'}>
                    {getIcon(icon)}
                    {getText(t, text, content)}
                </div>
                {link && link.onClick && <DropdownLink onClick={() => link.onClick()} title={link.title} /> }
            </div>
    </>
}

export default DropdownCell;
