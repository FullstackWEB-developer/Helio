import {DropdownTitleModel} from './dropdown.models';
import './dropdown-title.scss'
import DropdownLink from './dropdown-link';
import React from 'react';
import {useTranslation} from 'react-i18next';

const DropdownTitle = ({title, icon, link, content, hasDivider=true }: DropdownTitleModel) => {
    const {t} = useTranslation();
    if (content) {
        return <span data-test-id='dropdown-title-content'>{content}</span>
    }
    if (title) {
        return <div className={'pt-2 px-4 dropdown-title flex items-center justify-between subtitle2 ' + (hasDivider ? 'border-t' : '')}>
            <div className='flex flex-row'>
                {icon && <div className='pr-2' data-test-id='dropdown-title-icon'>{icon}</div> }
                <div data-test-id='dropdown-title-text'>{t(title)}</div>
            </div>
            <div>
                <DropdownLink onClick={() => link?.onClick()} title={link?.title} />
            </div>
        </div>
    }
    return null;
}

export default DropdownTitle;
