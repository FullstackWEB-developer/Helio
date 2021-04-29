import Radio from '@components/radio/radio';
import {Option} from '@components/option/option';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ContactType} from '../models/ContactType';
import ContactForm from './contact-form';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

interface AddNewContactProps {
    contactType?: ContactType
}
const AddNewContact = ({contactType}: AddNewContactProps) => {
    const [contactTypeRadio, setContactTypeRadio] = useState<string>(contactType ?? ContactType.Individual);
    const {t} = useTranslation();
    const onContactTypeChange = (value: string) => {
        setContactTypeRadio(value);
    }
    const newContactTypeOptions: Option[] = [
        {value: String(ContactType.Company), label: `${t('contacts.new-contact.company')}`},
        {value: String(ContactType.Individual), label: `${t('contacts.new-contact.individual')}`}
    ]
    return (
        <div className='h-full w-full overflow-y-auto px-8 pt-7 flex flex-col'>
            <div className="flex justify-between items-center mb-10">
                <h4>{t('contacts.new-contact.header')}</h4>
                <div className='flex'>
                    <div className="pr-6"><SvgIcon type={Icon.Star} className='cursor-pointer' fillClass='contact-header-quick-action-color' /></div>
                    <div className="pr-6"><SvgIcon type={Icon.Save} className='cursor-pointer' fillClass='contact-header-quick-action-color' /></div>
                    <div className="pr-6"><SvgIcon type={Icon.Delete} className='cursor-pointer' fillClass='contact-header-quick-action-color' /></div>
                </div>
            </div>
            <div className='body2 mb-6'>{t('contacts.new-contact.select_type')}</div>
            <Radio name='new-contact-type' className='flex space-x-8' defaultValue={contactTypeRadio} items={newContactTypeOptions} onChange={onContactTypeChange} />
            <ContactForm contactType={ContactType[contactTypeRadio as keyof typeof ContactType]} />
        </div>
    )
}

export default AddNewContact;