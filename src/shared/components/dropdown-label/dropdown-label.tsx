import {useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from "../dropdown";
import SvgIcon, {Icon} from "../svg-icon";
import useComponentVisibility from "../../hooks/useComponentVisibility";

interface DropdownLabelProps {
    value?: string;
    items?: DropdownItemModel[],
    onClick?: (item: DropdownItemModel) => void
}

const DropdownLabel = ({value, items, ...props}: DropdownLabelProps) => {
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
        <div className="flex flex-row flex-nowrap items-center relative cursor-pointer" onClick={() => setIsVisible(!isVisible)}>
            <div className="whitespace-nowrap select-none">
                <h5> {itemSelected?.label ?? ''}</h5>
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
