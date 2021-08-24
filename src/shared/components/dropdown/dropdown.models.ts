import {ReactNode} from 'react';
import {Option} from '@components/option/option';

export interface CategoryItemModel {
    category: DropdownCategoryModel;
    items: DropdownItemModel[];
    itemsCssClass?: string;
}

export interface DropdownModel {
    title?: string;
    header?: ReactNode;
    asSelect?: boolean;
    items?: DropdownItemModel[];
    isSearchable?: boolean;
    categorizedItems?: CategoryItemModel[];
    onClick?: (id: string, item: DropdownItemModel) => void;
    defaultValue?: string;
    itemsWrapperClass?: string;
    excludeSelectedItem?: boolean;
}

export interface DropdownItemModel extends Option {
    content?: ReactNode;
    icon?: ReactNode;
    hasDivider?: boolean;
    isTitle?: boolean;
    onClick?: (id: string) => void;
    link?: DropdownLinkModel;
    isSelected?: boolean;
    className?: string;
}


export interface DropdownCategoryModel {
    key: string;
    text: string;
    icon?: ReactNode;
}

export interface DropdownTitleModel {
    title?: string;
    icon?: ReactNode;
    content?: ReactNode;
    link?: DropdownLinkModel;
    hasDivider?: boolean;
}

export interface DropdownLinkModel {
    onClick: () => void;
    title?: string;
}

export enum DropdownAlignmentHorizontalPosition {
    Left,
    Right
}
