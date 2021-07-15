import {useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from "../dropdown";
import SvgIcon, {Icon} from "../svg-icon";
import useComponentVisibility from "../../hooks/useComponentVisibility";
import classnames from 'classnames';

interface MoreMenuProps {
    value?: string;
    items?: DropdownItemModel[],
    iconFillClassname?: string;
    iconClassName?: string;
    menuClassName?: string;
    onClick?: (item: DropdownItemModel) => void
}

const MoreMenu = ({value, items, menuClassName, iconClassName, iconFillClassname, ...props}: MoreMenuProps) => {
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [valueSelected, setValueSelected] = useState(value);


    const dropdownModel: DropdownModel = {
        defaultValue: valueSelected,
        items: items,
        onClick: (optionValue: string, item: DropdownItemModel) => {
            setValueSelected(optionValue);
            setIsVisible(false);

            if (props.onClick) {
                props.onClick(item);
            }
        }
    };

    return (<div ref={elementRef} className="relative">
        <div className="relative flex flex-row items-center cursor-pointer flex-nowrap" onClick={() => setIsVisible(!isVisible)}>
            <SvgIcon type={Icon.MoreVert} className={iconClassName} fillClass={iconFillClassname} />
        </div>
        {isVisible &&
            <div className={classnames('absolute right-0 z-10 top-full', menuClassName)} >
                <Dropdown model={dropdownModel} />
            </div>
        }
    </div>
    );
}

export default MoreMenu;
