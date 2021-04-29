import React from 'react';
import Input from '@components/input/input';
import Select from '@components/select/select';
import {useTranslation} from 'react-i18next';
import RemoveCTA from '@components/remove-cta/remove-cta';
import Checkbox from '@components/checkbox/checkbox';
interface ContactAddressProps {
    title: string,
    optionalAddress?: boolean,
    removeCTAClickHandler?: () => void
}
const ContactAddress = ({title, optionalAddress, removeCTAClickHandler}: ContactAddressProps) => {
    const {t} = useTranslation();
    return (
        <>
            {
                !optionalAddress ?
                    <div className="h-10 flex items-center mt-4 mb-2">
                        {title}
                    </div> :
                    (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 h-10 mt-2 mb-4 items-center">
                            <div className="col-span-12 lg:col-span-5">
                                {title}
                            </div>
                            <div className="col-span-12 lg:col-span-3"></div>
                            <div className="col-span-12 lg:col-span-2">
                                <RemoveCTA onClick={removeCTAClickHandler} />
                            </div>
                        </div>
                    )
            }
            {
                optionalAddress &&
                <div className="relative">
                    <Checkbox value="test" onChange={() => { }} name="" label={t('contacts.contact-details.individual.same_as_primary')} />
                </div>
            }
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
                <div className="col-span-12 lg:col-span-5">
                    <Input label={t('contacts.contact-details.individual.address')} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <Input label={t('contacts.contact-details.individual.apt')} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <Input label={t('contacts.contact-details.individual.city')} />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <Select label={t('contacts.contact-details.individual.state')} options={[]} />
                </div>
                <div className="col-span-12 lg:col-span-2">
                    <Input label={t('contacts.contact-details.individual.zip_code')} />
                </div>
            </div>
        </>
    )
}
export default ContactAddress;