import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectLookupValuesAsOptions} from '@pages/tickets/store/tickets.selectors';

interface ContactCategoryProps {
    selectedCategory: string,
    setSelectedCategory: (category: string) => void
}
const ContactCategory = ({selectedCategory, setSelectedCategory}: ContactCategoryProps) => {

    const facilityTypes = useSelector(state => selectLookupValuesAsOptions(state, 'ContactCategory'))
    const {t} = useTranslation();


    const getContactCategories = useMemo(() =>{
        const contactCategories: string[] = [
            t('contacts.category.all_contacts'),
            t('contacts.category.starred_contacts')
        ];
        facilityTypes.forEach(a => {
            contactCategories.push(a.label)
        });

        return contactCategories;
    }, [facilityTypes, t])

    return (
        <div className="pt-5 pl-5 min-h-full overflow-hidden w-62 contact-category-section flex flex-col">
            <h5>{t('contacts.category.header')}</h5>
            <div className="subtitle2 mt-8 h-10 pb-2">{t('contacts.category.subtitle')}</div>
            <ul>
                {
                    getContactCategories.map((category) =>
                        <li key={`${category}`}
                            className={`body2 pb-2 cursor-pointer contact-category${selectedCategory === category ? '-active' : ''}`}
                            onClick={() => {setSelectedCategory(category)}}>
                            {category}
                        </li>)
                }
            </ul>
        </div>
    )
}

export default ContactCategory;
