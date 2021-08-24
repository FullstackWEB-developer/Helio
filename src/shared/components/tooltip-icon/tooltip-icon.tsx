import React from 'react';
import SvgIcon, {Icon} from "@components/svg-icon";
import Tooltip from '@components/tooltip/tooltip';
import {useComponentVisibility} from "@shared/hooks";
import {Placement} from '@popperjs/core';
import classnames from 'classnames';

interface ToolTipIconProps {
    className?: string;
    placement?: Placement;
    children: React.ReactNode;
    iconFillClass?: string;
    iconClassName?: string;
    icon: Icon
}

const ToolTipIcon = (
    {
        children,
        className,
        placement = 'bottom-end',
        iconFillClass,
        iconClassName,
        icon
    }: ToolTipIconProps) => {
    const [isToolTipVisible, setToolTipVisible, containerRef] = useComponentVisibility<HTMLDivElement>(false);

    return (
        <div ref={containerRef}
            className={className}
            onClick={() => setToolTipVisible(!isToolTipVisible)}
        >
            <SvgIcon
                type={icon}
                fillClass={iconFillClass}
                className={classnames('cursor-pointer', iconClassName)}
            />
            <Tooltip
                targetRef={containerRef}
                isVisible={isToolTipVisible}
                placement={placement}
            >
                {children}
            </Tooltip>
        </div>
    );
}

export default ToolTipIcon;
