import {CategoryItemModel, DropdownItemModel, DropdownModel} from './dropdown.models';
import DropdownCell from './dropdown-cell';
import DropdownCategory from './dropdown-category';
import DropdownTitle from './dropdown-title';
import './dropdown.scss';
import DropdownSelect from '@components/dropdown/dropdown-select';

export interface DropdownProps {
    model: DropdownModel
}

const Dropdown = ({model}: DropdownProps) => {

    const {header, title, categorizedItems, items = [], onClick, defaultValue, asSelect = false} = model;
    const getItemContent = (item: DropdownItemModel) => {
        const isSelected = item.value === defaultValue
        if (item.isTitle) {
            return <DropdownTitle link={item.link} title={item.label} icon={item.icon} content={item.content}/>
        }
        return <DropdownCell onClick={(value: string, selected: DropdownItemModel) => itemSelected(value, selected)}
                             isSelected={isSelected} key={item.value} item={item}/>

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
        if (items && items.length > 0) {
            return items.map((item) => <span key={item.value}>{getItemContent(item)}</span>)
        }
        return null;
    }

    const getCategoryContent = (category: CategoryItemModel) => {
        return <div className='flex flex-row border-t' key={category.category.key}>
            <DropdownCategory key={category.category.key} icon={category.category.icon} text={category.category.text}/>
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
            selectedValue = items.find(a => a.value === defaultValue);
        }
        return <DropdownSelect defaultValue={selectedValue ? selectedValue : undefined}
                               onClick={(value, item) => itemSelected(value, item)} items={items}/>
    }

    return <div className='bg-white dropdown-body' data-test-id={'dropdown-' + title}>
        <DropdownTitle hasDivider={false} content={header} title={title}/>
        {getCategoryItemListContent()}
        {getItemListContent()}
    </div>
}

export default Dropdown;
