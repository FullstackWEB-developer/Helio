import {useCallback, useEffect, useRef, useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from "../dropdown";
import SvgIcon, {Icon} from "../svg-icon";
import useComponentVisibility from "../../hooks/useComponentVisibility";
import classnames from 'classnames';
import {useSmartPosition} from '@shared/hooks';
import utils from '@shared/utils/utils';

interface MoreMenuProps {
    value?: string;
    items?: DropdownItemModel[],
    iconFillClassname?: string;
    iconClassName?: string;
    menuClassName?: string;
    containerClassName?: string;
    onClick?: (item: DropdownItemModel) => void
}

const MoreMenu = ({value, items, menuClassName, iconClassName, iconFillClassname, containerClassName, ...props}: MoreMenuProps) => {
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [valueSelected, setValueSelected] = useState(value);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const iconContainerRef = useRef<HTMLDivElement>(null);
    const {top} = useSmartPosition(dropdownRef, iconContainerRef, isVisible);

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

    const calculateRightPosition = () => {
        let right = 0;
        if (elementRef && elementRef?.current) {
            const rightmostPoint = elementRef.current?.getBoundingClientRect()?.right;
            const iconRightPoint = iconContainerRef.current?.getBoundingClientRect()?.right;
            if (rightmostPoint && iconRightPoint) {
                right = rightmostPoint - iconRightPoint + elementRef.current.offsetWidth;
            }
        }
        return right;
    }

    const hideDropdown = useCallback(() => {
        setIsVisible(false);
    }, [setIsVisible]);

    useEffect(() => {
        const parent = utils.getScrollParent(iconContainerRef.current);
        parent?.addEventListener?.('scroll', hideDropdown);
        return () => {
            parent?.removeEventListener?.('scroll', hideDropdown);
        }

    }, [hideDropdown]);

    return (<div ref={elementRef} className={containerClassName}>
        <div
            className="relative flex flex-row items-center cursor-pointer flex-nowrap"
            onClick={() => setIsVisible(!isVisible)}
            ref={iconContainerRef}
        >
            <SvgIcon type={Icon.MoreVert} className={iconClassName} fillClass={iconFillClassname} />
        </div>
        <div
            className={classnames('absolute z-10', {'hidden': !isVisible}, menuClassName)}
            style={{top: top, right: calculateRightPosition()}}
            ref={dropdownRef}
        >
            <Dropdown model={dropdownModel} />
        </div>
    </div>
    );
}

export default MoreMenu;
