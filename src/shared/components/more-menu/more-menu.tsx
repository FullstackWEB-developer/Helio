import {useCallback, useEffect, useRef, useState} from 'react';
import Dropdown, {DropdownItemModel, DropdownModel} from "../dropdown";
import SvgIcon, {Icon} from "../svg-icon";
import useComponentVisibility from "../../hooks/useComponentVisibility";
import classnames from 'classnames';
import {usePopper} from 'react-popper';
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
    const iconContainerRef = useRef<HTMLDivElement>(null);
    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const { styles, attributes, update } = usePopper(elementRef.current, popper, {
        placement: 'bottom',
        strategy: 'fixed',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 0],
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

    return (<div ref={elementRef} className={containerClassName}>
        <div
            className="relative flex flex-row items-center cursor-pointer flex-nowrap"
            onClick={() => setIsVisible(!isVisible)}
            ref={iconContainerRef}
        >
            <SvgIcon type={Icon.MoreVert} className={iconClassName} fillClass={iconFillClassname} />
        </div>
        <div
            className={classnames('absolute z-10', {'hidden': !isVisible})}
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
