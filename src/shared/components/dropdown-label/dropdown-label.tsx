import {useEffect, useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from "../dropdown";
import SvgIcon, {Icon} from "../svg-icon";
import useComponentVisibility from "../../hooks/useComponentVisibility";
import {useTranslation} from 'react-i18next';
interface DropdownLabelProps {
    title?: string;
    value?: string;
    excludeSelectedItem?: boolean,
    labelClassName?: string,
    items?: DropdownItemModel[],
    arrowDisabled?: boolean,
    onClick?: (item: DropdownItemModel) => void,
    onSelecting?: (item: DropdownItemModel) => boolean,
    dataTestId?: string
}

const DropdownLabel = ({value, items, excludeSelectedItem, labelClassName, arrowDisabled, dataTestId, ...props}: DropdownLabelProps) => {
    const {t} = useTranslation();
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [valueSelected, setValueSelected] = useState(value);
    const [itemSelected, setItemSelected] = useState<DropdownItemModel | null>(items?.find(p => p.value === value) ?? null);

    useEffect(() => {
        setValueSelected(value);
        setItemSelected(items?.find(p => p.value === value) ?? null);
    }, [items, value])

    const dropdownModel: DropdownModel = {
        title: props.title,
        defaultValue: valueSelected,
        items: items,
        excludeSelectedItem: excludeSelectedItem,
        dataTestId: dataTestId,
        onClick: (ItemValue: string, item: DropdownItemModel) => {
            setIsVisible(false);
            const canSelect = props.onSelecting?.(item) ?? true;
            if (!canSelect) {
                return;
            }
            setItemSelected(item);
            setValueSelected(ItemValue);

            if (props.onClick) {
                props.onClick(item);
            }
        }
    };

    return (<div ref={elementRef} className="relative">
        <div data-testid={dataTestId} className="relative flex flex-row items-center cursor-pointer flex-nowrap" onClick={() => setIsVisible(!isVisible)}>
            <div className="select-none whitespace-nowrap">
                <h5 className={labelClassName}> {t(itemSelected?.label ?? '')}</h5>
            </div>
            {!arrowDisabled &&
                <div className="px-3">
                    <SvgIcon type={isVisible ? Icon.ArrowUp : Icon.ArrowDown} fillClass='active-item-icon' />
                </div>
            }
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
