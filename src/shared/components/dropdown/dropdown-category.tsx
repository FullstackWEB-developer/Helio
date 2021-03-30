import './dropdown-category.scss';
import {DropdownCategoryModel} from './dropdown.models';
import {useTranslation} from 'react-i18next';


const DropdownCategory = ({text, icon}: DropdownCategoryModel) => {
    const {t} = useTranslation();
    return <div className='dropdown-category py-2 pl-4 caption-caps uppercase'>
        <div className=' flex flex-row items-center' data-test-id='dropdown-category-icon-text'>
            {icon && <div className='pr-2' data-test-id='dropdown-category-icon'>{icon}</div>}
            {t(text)}
        </div>
    </div>
}

export default DropdownCategory;
