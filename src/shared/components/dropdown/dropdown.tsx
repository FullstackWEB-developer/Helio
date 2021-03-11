import {CategoryItemModel, DropdownItemModel, DropdownModel} from './dropdown.models';
import DropdownCell from './dropdown-cell';
import DropdownCategory from './dropdown-category';
import DropdownTitle from './dropdown-title';
import './dropdown.scss';

export interface DropdownProps {
    model: DropdownModel
}

const Dropdown = ({model}: DropdownProps) => {

    const {header, title, categorizedItems, items, onClick, selectedKey} = model;
    const getItemContent = (item: DropdownItemModel) => {
        const isSelected = item.key === selectedKey
        if (item.isTitle) {
            return <DropdownTitle link={item.link} title={item.text} icon={item.icon} content={item.content}/>
        }
        return <DropdownCell onClick={item.onClick ? item.onClick : onClick} isSelected={isSelected} key={item.key} item={item}/>

    }

    const getItemListContent = () => {
        if (items && items.length > 0) {
            return items.map((item) => <span key={item.key}>{getItemContent(item)}</span>)
        }
        return null;
    }

    const getCategoryContent = (category: CategoryItemModel) => {
        return <div className='flex flex-row border-t' key={category.category.key}>
            <DropdownCategory key={category.category.key} icon={category.category.icon} text={category.category.text}/>
            <div className={category.itemsCssClass ? category.itemsCssClass : 'w-full'}>
                {category.items.map((item) => <span key={item.key}>{getItemContent(item)}</span>)}
            </div>
        </div>
    }

    const getCategoryItemListContent = () => {
        if (categorizedItems && categorizedItems.length > 0) {
            return categorizedItems.map((category) => <span key={category.category.key}>{getCategoryContent(category)}</span>)
        }
        return null;
    }

    return <div className='bg-white dropdown-body' data-test-id={'dropdown-' +title}>
        <DropdownTitle hasDivider={false} content={header} title={title}/>
        {getCategoryItemListContent()}
        {getItemListContent()}
    </div>
}

export default Dropdown;
