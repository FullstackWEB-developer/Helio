import {ReactNode} from 'react';

export interface CategoryItemModel {
    category: DropdownCategoryModel;
    items: DropdownItemModel[];
    itemsCssClass?: string;
}

export interface DropdownModel {
    title?: string;
    header?: ReactNode;
    items?: DropdownItemModel[];
    categorizedItems?: CategoryItemModel[];
    onClick?: (id: string) => void;
    selectedKey?: string;
}

export interface DropdownItemModel {
    text?: string;
    content?: ReactNode;
    icon?: ReactNode;
    hasDivider?: boolean;
    key: string;
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
