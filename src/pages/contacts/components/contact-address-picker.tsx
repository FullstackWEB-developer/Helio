import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Option} from '@components/option/option';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import SvgIcon from '@components/svg-icon/svg-icon';
import Dropdown from '@components/dropdown/dropdown';
import {Icon} from '@components/svg-icon/icon';
import customHooks from '@shared/hooks/customHooks';

interface ContactAddressPickerProps {
    options: Option[];
    onSelect: (id: string) => void;
}
const ContactAddressPicker = (props: ContactAddressPickerProps) => {
    const {t} = useTranslation();
    const addressDropdownModel: DropdownModel = {
        items: props.options,
        onClick: (id, item) => onSelect(id, item),

    }
    const [showDropdown, setShowDropdown] = useState(false);
    const onSelect = (id: string, item: DropdownItemModel) => {
        setShowDropdown(false);
        props.onSelect(id);
    }
    const dropdownRef = useRef<HTMLDivElement>(null);
    customHooks.useOutsideClick([dropdownRef], () => {
        setShowDropdown(false);
    });
    if (!props.options.length) return null;
    return (
        <div className='relative py-2.5 cursor-pointer'>
            <div ref={dropdownRef} className='flex items-center' onClick={() => {setShowDropdown(true)}}>
                <SvgIcon type={Icon.Add} />
                <span className='body2 pl-2 contact-accent-color'>{`${t('contacts.new-contact.add_more')}`}</span>
            </div>
            {
                showDropdown && <div className="absolute pl-8"><Dropdown model={addressDropdownModel} /></div>
            }
        </div>
    )
}

export default ContactAddressPicker;

