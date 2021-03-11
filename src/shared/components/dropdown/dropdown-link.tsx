import React from 'react';
import {DropdownLinkModel} from './dropdown.models';
import {useTranslation} from 'react-i18next';

const DropdownLink = ({onClick, title = ''} : DropdownLinkModel) => {

    const {t} = useTranslation();

    if (!onClick) {
        return null;
    }

    const linkClicked = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onClick();
    }
    return  <div className='h8 cursor-pointer' data-test-id={'dropdown-link-' + title} onClick={(e) => linkClicked(e)}>{t(title)}</div>
}

export default DropdownLink;
