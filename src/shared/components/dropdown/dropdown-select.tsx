import {ReactComponent as ArrowDown} from '@icons/Icon-Arrow-down-16px.svg';
import {ReactComponent as ArrowUp} from '@icons/Icon-Arrow-up-16px.svg';
import './dropdown-select.scss';
import {useTranslation} from 'react-i18next';
import {DropdownItemModel} from '@components/dropdown/dropdown.models';
import {useRef, useState} from 'react';
import DropdownCell from '@components/dropdown/dropdown-cell';
import customHooks from '../../hooks/customHooks';

export interface DropdownSelectProps {
    items: DropdownItemModel[];
    defaultValue?: DropdownItemModel;
    onClick?: (value: string, item: DropdownItemModel) => void;
}


const DropdownSelect = ({items, defaultValue, onClick}: DropdownSelectProps) => {
    const {t} = useTranslation();
    const [isOpen, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState(defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const itemSelected = (item: DropdownItemModel) => {
        setSelected(item);
        setOpen(false);
        if (onClick) {
            onClick(item.value, item);
        }
    }

    customHooks.useOutsideClick([dropdownRef], () => {
        setOpen(false);
    });

    const options = items.map(item => {
        return <DropdownCell isSelected={item.value === selected?.value} onClick={() => itemSelected(item)} item={item}
                             key={item.value}/>
    });
    return <div ref={dropdownRef} className='flex flex-col relative'>
        <div
            className='w-full dropdown-select h-10 border pl-4 pr-2 flex flex-row items-center absolute justify-between cursor-pointer'
            onClick={() => setOpen(!isOpen)}>
            <div className='w-full' data-test-id='dropdown-select-label'>
                {selected ? t(selected.label) : ''}
            </div>
            <div data-test-id='dropdown-select-arrow'>
                {isOpen ? <ArrowUp/> : <ArrowDown/>}
            </div>
        </div>
        {isOpen && <div className='dropdown-select-options border absolute'>
            {options}
        </div>}
    </div>
}

export default DropdownSelect;
