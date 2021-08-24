import {CategoryItemModel, DropdownItemModel, DropdownModel} from './dropdown.models';
import DropdownCell from './dropdown-cell';
import DropdownCategory from './dropdown-category';
import DropdownTitle from './dropdown-title';
import './dropdown.scss';
import DropdownSelect from '@components/dropdown/dropdown-select';
import SearchInputField from '@components/search-input-field/search-input-field';
import {useEffect, useState} from 'react';

export interface DropdownProps {
    model: DropdownModel
}

const Dropdown = ({model}: DropdownProps) => {

    const {header,
        title,
        categorizedItems,
        items = [],
        onClick,
        defaultValue,
        asSelect = false,
        isSearchable = false,
        excludeSelectedItem,
        itemsWrapperClass = ''
    } = model;
    const [dropDownItems, setDropDownItems] = useState<DropdownItemModel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const querySearch = () => {
            const results = items.reduce((res: any, item: DropdownItemModel) => {
                const idx = item.label.toLowerCase().indexOf(searchTerm.toLowerCase());
                if (idx === 0) {
                    res[0].push(item);
                } else if (idx > 0) {
                    res[1].push(item);
                }
                return res;
            },
                [[], []],
            );
            return results[0].concat(results[1]);
        };

        if (!searchTerm) {
            const newItems = !excludeSelectedItem ? items : items.filter(item => item.value !== defaultValue);
            setDropDownItems(newItems);
        } else {
            setDropDownItems(querySearch());
        }

    }, [searchTerm, items])

    const getItemContent = (item: DropdownItemModel) => {
        const isSelected = item.value === defaultValue
        if (item.isTitle) {
            return <DropdownTitle link={item.link} title={item.label} icon={item.icon} content={item.content} />
        }
        return <DropdownCell onClick={(value: string, selected: DropdownItemModel) => itemSelected(value, selected)}
            isSelected={isSelected} key={item.value} item={item} />

    }

    const searchInputChanged = (value: string) => {
        setSearchTerm(value);
    }

    const itemSelected = (value: string, item: DropdownItemModel) => {
        if (item.onClick) {
            item.onClick(value);
        }
        if (onClick) {
            onClick(value, item);
        }
    }

    const getItemListContent = () => {
        if (dropDownItems && dropDownItems.length > 0) {
            return dropDownItems.map((item) => <span key={item.value}>{getItemContent(item)}</span>)
        }
        return null;
    }

    const getCategoryContent = (category: CategoryItemModel) => {
        return <div className='flex flex-row border-t' key={category.category.key}>
            <DropdownCategory key={category.category.key} icon={category.category.icon} text={category.category.text} />
            <div className={category.itemsCssClass ? category.itemsCssClass : 'w-full'}>
                {category.items.map((item) => <span key={item.label}>{getItemContent(item)}</span>)}
            </div>
        </div>
    }

    const getCategoryItemListContent = () => {
        if (categorizedItems && categorizedItems.length > 0) {
            return categorizedItems.map((category) => <span
                key={category.category.key}>{getCategoryContent(category)}</span>)
        }
        return null;
    }

    if (asSelect) {
        let selectedValue = null;
        if (defaultValue) {
            selectedValue = dropDownItems.find(a => a.value === defaultValue);
        }
        return <DropdownSelect defaultValue={selectedValue ? selectedValue : undefined}
            onClick={(value, item) => itemSelected(value, item)} items={items} />
    }

    return <div className='py-2 bg-white dropdown-body' data-test-id={'dropdown-' + title}>
        <DropdownTitle hasDivider={false} content={header} title={title} />
        {isSearchable &&
            <SearchInputField onChange={searchInputChanged} value={searchTerm} />
        }
        <div className={`overflow-y-auto overflow-x-hidden max-h-96 ${itemsWrapperClass}`}>
            {getCategoryItemListContent()}
            {getItemListContent()}
        </div>
    </div>
}

export default Dropdown;
