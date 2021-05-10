import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Contact} from '@shared/models/contact.model';
import {useForm} from 'react-hook-form';
import {ContactType} from '@pages/contacts/models/ContactType';
import ControlledInput from '@components/controllers/ControllerInput';
import ControlledSelect from '@components/controllers/controlled-select';
import {Option} from '@components/option/option';
import {memoize} from 'react-dnd-html5-backend/lib/utils/js_utils';
import {createCategorySelectOptions} from '@shared/models/contact-category.enum';
import {Icon} from '@components/svg-icon/icon';
import utils from '@shared/utils/utils';

interface TicketDetailContactInfoProps {
    contact: Contact
}

const TicketDetailContactInfo = ({contact}: TicketDetailContactInfoProps) => {
    const {t} = useTranslation();
    const [facilityTypes] = useState<Option[]>(createCategorySelectOptions());
    const {control} = useForm({
        defaultValues: {
            contactName: contact.type === ContactType.Company ? contact.companyName : `${contact.firstName} ${contact.lastName}`,
            facilityType: '',
            facilityName: contact.companyName
        }
    });

    const getAddress = memoize(() => {
        if (!contact.addresses || contact.addresses.length === 0) {
            return null;
        }
        return contact.addresses[0];
    });

    const DisplayPhone = ({phone, label}: { phone: string, label: string }) => {
        if (!phone) {
            return null;
        }
        return <div className='flex flex-row'>
            <div
                className='body2-medium w-32'>{t(label)}</div>
            <div className='body2'>{utils.formatPhone(phone)}</div>
        </div>
    }

    return <div className='pt-4 pb-6'>
        <form>
            <div>
                <ControlledInput disabled={true} label='ticket_detail.info_panel.contact_details.contact_name'
                                 control={control} name='contactName' dataTestId='contact-name'
                                 dropdownIcon={Icon.Contacts}/>
                <ControlledSelect disabled={true} label='ticket_detail.info_panel.contact_details.facility_type'
                                  name='facilityType'
                                  value={facilityTypes.find(a => a.value === contact.category.toString())}
                                  control={control} options={facilityTypes}/>
                <ControlledInput disabled={true} label='ticket_detail.info_panel.contact_details.facility_name'
                                 control={control} name='facilityName' dataTestId='contact-name'/>
                <div className='flex flex-col'>
                    <DisplayPhone phone={contact.workMainPhone}
                                  label='ticket_detail.info_panel.contact_details.work_phone'/>
                    <DisplayPhone phone={contact.mobilePhone}
                                  label='ticket_detail.info_panel.contact_details.mobile_phone'/>
                    {getAddress() && <div className='flex flex-row'>
                        <div className='body2-medium w-32'>{t('ticket_detail.info_panel.contact_details.address')}</div>
                        <div className='flex flex-col'>
                            {getAddress()?.line && <div className='body2'>{getAddress()?.line}</div>}
                            <div className='body2'>
                                {`${getAddress()?.city ? getAddress()?.city : ''}, ${getAddress()?.state ? getAddress()?.state : ''} ${getAddress()?.zipCode ? getAddress()?.zipCode : ''}`}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </form>
    </div>
}

export default withErrorLogging(TicketDetailContactInfo);
