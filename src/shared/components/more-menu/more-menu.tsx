import {useCallback, useEffect, useRef, useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from "../dropdown";
import SvgIcon, {Icon} from "../svg-icon";
import useComponentVisibility from "../../hooks/useComponentVisibility";
import classnames from 'classnames';
import './more-menu.scss';
import {usePopper} from 'react-popper';
import utils from '@shared/utils/utils';
import {Placement} from '@popperjs/core/lib/enums';

interface MoreMenuProps {
    value?: string;
    items?: DropdownItemModel[],
    iconFillClassname?: string;
    iconClassName?: string;
    menuClassName?: string;
    containerClassName?: string;
    onClick?: (item: DropdownItemModel) => void,
    menuPlacement?: Placement;
    verticalOffset?: number;
    horizontalOffset?: number
}

const MoreMenu = ({value, items, menuClassName, iconClassName, iconFillClassname, containerClassName, menuPlacement = 'bottom', verticalOffset = 0, horizontalOffset = 0, ...props}: MoreMenuProps) => {
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const [valueSelected, setValueSelected] = useState(value);
    const iconContainerRef = useRef<HTMLDivElement>(null);
    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const {styles, attributes, update} = usePopper(elementRef.current, popper, {
        placement: menuPlacement,
        strategy: 'fixed',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [horizontalOffset, verticalOffset],
            },
        }]
    });

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

    useEffect(() => {
        if (isVisible && update) {
            update().then();
        }
    }, [update, isVisible]);

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

    useEffect(() => {
        if (!isVisible) {
            setValueSelected(undefined);
        }
    }, [isVisible]);

    return (<div ref={elementRef} className={containerClassName}>
        <div
            className="relative flex flex-row items-center cursor-pointer flex-nowrap"
            onClick={() => setIsVisible(!isVisible)}
            ref={iconContainerRef}
        >
            <SvgIcon type={Icon.MoreVert} className={iconClassName} fillClass={iconFillClassname} />
        </div>
        <div
            className={classnames('absolute z-10 more-menu-shadow', {'hidden': !isVisible})}
            style={styles.popper}
            ref={setPopper}
            {...attributes.popper}
        >
            <Dropdown model={dropdownModel} />
        </div>
    </div>
    );
}

export default MoreMenu;
