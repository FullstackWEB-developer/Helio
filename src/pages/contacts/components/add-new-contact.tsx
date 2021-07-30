import Radio from '@components/radio/radio';
import {Option} from '@components/option/option';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ContactType} from '@shared/models/contact-type.enum';
import ContactForm from './contact-form';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {useMutation} from 'react-query';
import {ContactFormModel} from '../models/contact-form.model';
import {createNewContact} from '@shared/services/contacts.service';
import {ContactExtended} from '@shared/models/contact.model';
import {mapContactFormModelToDto} from '../contact-helpers/helpers';
interface AddNewContactProps {
    contactType?: ContactType,
    onContactAddSuccess: (contact: ContactExtended) => void;
    onContactAddError?: () => void;
    closeAddNewContactForm: () => void;
    contact?: ContactExtended;
}
const AddNewContact = ({contactType = ContactType.Individual, onContactAddSuccess, onContactAddError, closeAddNewContactForm, contact}: AddNewContactProps) => {
    const [contactTypeRadio, setContactTypeRadio] = useState<number>(contactType);
    const [addToFavorites, setAddToFavorites] = useState(false);
    const {t} = useTranslation();

    const newContactTypeOptions: Option[] = [
        {value: String(ContactType.Company), label: `${t('contacts.new-contact.company')}`},
        {value: String(ContactType.Individual), label: `${t('contacts.new-contact.individual')}`}
    ];


    const {isLoading, isError, mutate} = useMutation(createNewContact,
        {
            onSuccess: (data) => onContactAddSuccess(data),
            onError: () => onContactAddError && onContactAddError()
        });

    const onSubmit = (formData: ContactFormModel) => {
        const contactDto = mapContactFormModelToDto(formData, contactTypeRadio, undefined, addToFavorites);
        mutate(contactDto);
    };

    const onContactTypeChange = (value: string) => setContactTypeRadio(Number(value));
    const onClose = () => closeAddNewContactForm();
    const toggleFavorite = () => setAddToFavorites(!addToFavorites);
    const parentContact = {
        relatedId : contact?.id,
        companyName: contact?.companyName,
        category: contact?.category ? contact.category : -1
    }
    return (
        <div className='h-full w-full overflow-y-auto px-8 pt-7 flex flex-col'>
            <div className="flex justify-between items-center mb-10">
                <h4>{t('contacts.new-contact.header')}</h4>
                <div className='flex items-center'>
                    <div className="pr-6" onClick={toggleFavorite}>
                        <SvgIcon type={Icon.Star} className='cursor-pointer'
                        fillClass={`contact-header-quick-action-color${!addToFavorites ? '' : '-starred'}`} />
                    </div>
                    <div className="pr-6" onClick={onClose}>
                        <SvgIcon type={Icon.DeleteCircled} className='cursor-pointer'
                            fillClass='contact-header-quick-action-accent-color'
                             strokeClass='contact-stroke-color'
                        />
                    </div>
                </div>
            </div>
            {isError && <h6 className='text-danger mt-2 mb-5'>{t('contacts.new-contact.add_fail')}</h6>}
            <div className='body2 mb-6 pointer-events-none'>{t('contacts.new-contact.select_type')}</div>
            <Radio name='new-contact-type' className='flex space-x-8' defaultValue={String(contactTypeRadio)} items={newContactTypeOptions} onChange={onContactTypeChange} />
            <ContactForm contact={parentContact} isSaving={isLoading} contactType={contactTypeRadio} submitHandler={onSubmit} closeHandler={onClose} editMode={false} />
        </div>
    );
}

export default AddNewContact;
