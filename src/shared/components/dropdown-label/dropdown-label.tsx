import {useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from "../dropdown";
import SvgIcon, {Icon} from "../svg-icon";
import useComponentVisibility from "../../hooks/useComponentVisibility";
import {useTranslation} from 'react-i18next';

interface DropdownLabelProps {
    value?: string;
    items?: DropdownItemModel[],
    onClick?: (item: DropdownItemModel) => void
}

const DropdownLabel = ({value, items, ...props}: DropdownLabelProps) => {
    const {t} = useTranslation();
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [valueSelected, setValueSelected] = useState(value);
    const [itemSelected, setItemSelected] = useState<DropdownItemModel | null>(items?.find(p => p.value === value) ?? null);


    const dropdownModel: DropdownModel = {
        defaultValue: valueSelected,
        items: items,
        onClick: (value: string, item: DropdownItemModel) => {
            setItemSelected(item);
            setValueSelected(value);
            setIsVisible(false);

            if (props.onClick) {
                props.onClick(item);
            }
        }
    };

    return (<div ref={elementRef} className="relative">
        <div className="relative flex flex-row items-center cursor-pointer flex-nowrap" onClick={() => setIsVisible(!isVisible)}>
            <div className="select-none whitespace-nowrap">
                <h5> {t(itemSelected?.label ?? '')}</h5>
            </div>
            <div className="px-3">
                <SvgIcon type={isVisible ? Icon.ArrowUp : Icon.ArrowDown} fillClass='active-item-icon' />
            </div>
        </div>
        {isVisible &&
            <div className='absolute z-10 top-full' >
                <Dropdown model={dropdownModel} />
            </div>
        }
    </div>
    );
}

export default DropdownLabel;
