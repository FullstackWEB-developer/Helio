import React from 'react';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Contact} from '@shared/models/contact.model';
import {ContactType} from '@pages/contacts/models/ContactType';
import {memoize} from 'react-dnd-html5-backend/lib/utils/js_utils';
import {Icon} from '@components/svg-icon/icon';
import utils from '@shared/utils/utils';
import Input from '@components/input/input';
import {useHistory} from 'react-router';
import {ContactsPath} from '@app/paths';
import {useSelector} from 'react-redux';
import {selectLookupValuesAsOptions} from '@pages/tickets/store/tickets.selectors';

interface TicketDetailContactInfoProps {
    contact: Contact
}

const TicketDetailContactInfo = ({contact}: TicketDetailContactInfoProps) => {
    const {t} = useTranslation();
    const facilityTypes = useSelector(state => selectLookupValuesAsOptions(state, 'ContactCategory'))
    const history = useHistory();
    const getAddress = memoize(() => {
        if (!contact.addresses || contact.addresses.length === 0) {
            return null;
        }
        return contact.addresses[0];
    });

    const DisplayPhone = ({phone, label}: {phone: string, label: string}) => {
        if (!phone) {
            return null;
        }
        return <div className='flex flex-row'>
            <div
                className='body2-medium w-32'>{t(label)}</div>
            <div className='body2'>{utils.formatPhone(phone)}</div>
        </div>
    }

    const redirectToContactDetailsPage = () => {
        if (contact?.id) {
            history.push(`${ContactsPath}/${contact.id}`)
        }
    }

    return <div className='pt-4 pb-6'>
        <div>
            <Input disabled={true} label='ticket_detail.info_panel.contact_details.contact_name'
                value={contact?.type === ContactType.Company ? contact.companyName : `${contact.firstName} ${contact.lastName}`}
                dropdownIcon={contact?.id ? Icon.Contacts : undefined}
                dropdownIconFill={contact?.id ? 'success-icon' : ''}
                dropdownIconClickHandler={redirectToContactDetailsPage} />
            <Input disabled={true} label='ticket_detail.info_panel.contact_details.facility_type'
                value={facilityTypes.find(a => a.value === contact.category.toString())?.label || ''} />
            <Input disabled={true} label='ticket_detail.info_panel.contact_details.facility_name'
                value={contact?.companyName || ''} />
            <div className='flex flex-col'>
                <DisplayPhone phone={contact.workMainPhone}
                    label='ticket_detail.info_panel.contact_details.work_phone' />
                <DisplayPhone phone={contact.mobilePhone}
                    label='ticket_detail.info_panel.contact_details.mobile_phone' />
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
    </div>
}

export default withErrorLogging(TicketDetailContactInfo);
