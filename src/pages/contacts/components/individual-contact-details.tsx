import {Icon} from '@components/svg-icon/icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import ContactInfoField from './contact-info-field';
import ContactForm from './contact-form';
import {ContactType} from '../models/ContactType';
interface IndividualContactDetailsProps {
    editMode?: boolean;
    initiateACall?: () => void
}
const IndividualContactDetails = ({editMode, initiateACall}: IndividualContactDetailsProps) => {
    const {t} = useTranslation();
    return (
        !editMode ?
            (
                <div className="grid grid-cols-8 gap-2 body2">
                    <ContactInfoField label={`${t('contacts.contact-details.individual.company')}`} value={'Adventage MRI'} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.category')}`} value={'Facility'} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.department')}`} value={'Sales'} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.email')}`} value={'info@advantagemri.com'} icon={Icon.Email} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.work_main_phone')}`} value={'(310) 440-0098'} icon={Icon.Phone} appendix={true}
                        appendixLabel={t('contacts.contact-details.individual.ext')} appendixValue={'3452'} iconOnClick={initiateACall} />

                    <ContactInfoField label={`${t('contacts.contact-details.individual.work_direct_phone')}`} value={'(310) 440-0091'}
                        icon={Icon.Phone} iconOnClick={initiateACall} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.mobile_phone')}`} value={'(310) 789-4565'}
                        icon={Icon.Phone} iconOnClick={initiateACall} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.fax')}`} value={'(310) 440-0099'}
                        icon={Icon.Phone} iconOnClick={initiateACall} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.website')}`} value={'www.advantagemri.com'} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.address')}`} value={'100 Lincoln Blvd'} />
                    <ContactInfoField value={'Manhattan Beach, CA 90277'} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.shipping_address')}`} value={'27 Sepulveda Blvd'} />
                    <ContactInfoField value={'Torrance, CA 90280'} />
                    <ContactInfoField label={`${t('contacts.contact-details.individual.billing_address')}`} value={'337 Via Pasqual'} />
                    <ContactInfoField value={'Redondo Beach, CA 90280'} />
                </div>
            )
            :
            (
                <ContactForm contactType={ContactType.Individual} />
            )
    )
}
export default IndividualContactDetails;