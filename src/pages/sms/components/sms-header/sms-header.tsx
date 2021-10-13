import React from 'react';
import './sms-header.scss';
import Avatar from '@components/avatar';
import MoreMenu from '@components/more-menu'
import utils from '@shared/utils/utils';
import {useSelector} from 'react-redux';
import {TicketMessageSummary} from '@shared/models';
import {useTranslation} from 'react-i18next';
import {selectEnumValues, selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {DropdownItemModel} from '@components/dropdown';
import {MORE_MENU_OPTION_CONTACT, MORE_MENU_OPTION_PATIENT, MORE_MENU_OPTION_TICKET} from '@pages/sms/constants';
import {ContactsPath, PatientsPath, TicketsPath} from '@app/paths';
import {Link, useHistory} from 'react-router-dom';
import {Icon} from '@components/svg-icon';

const SmsHeader = ({info, forNewTicketMessagePurpose}: {info: TicketMessageSummary, forNewTicketMessagePurpose: boolean}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const getTicketReasons = () => {
        return ticketReasons.find((lookupValue) => lookupValue.value === info?.reason)?.label ?? t('common.not_available');
    }
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const getTicketType = () => {
        return ticketTypes.find((lookupValue) => lookupValue.key === info?.ticketType)?.value ?? t('tickets.types.default');
    }
    const getMoreMenuOption = (): DropdownItemModel[] => {
        const options: DropdownItemModel[] = [];
        const commonClassName = 'body2 py-1.5';

        if (!!info.patientId) {
            options.push({label: t('sms.chat.view_patient'), value: MORE_MENU_OPTION_PATIENT, className: commonClassName});
        }

        if (!!info.contactId) {
            options.push({label: t('sms.chat.view_contact'), value: MORE_MENU_OPTION_CONTACT, className: commonClassName});
        }

        if (!forNewTicketMessagePurpose) {
            options.push({label: t('sms.chat.view_ticket'), value: MORE_MENU_OPTION_TICKET, className: commonClassName});
        }

        return options;
    }
    const onMoreMenuClick = (item: DropdownItemModel) => {
        switch (item.value) {
            case MORE_MENU_OPTION_PATIENT:
                goToPatientChart();
                break;
            case MORE_MENU_OPTION_TICKET:
                goToTicketDetail();
                break;
            case MORE_MENU_OPTION_CONTACT:
                goToContactDetail();
                break;
        }
    }

    const displayPatientOrContentLabel = () => {
        return !!info.contactId ? 'sms.chat.header.contact' : 'sms.chat.header.patient_id';
    }

    const getPatientOrContactId = () => {
        if (!!info.patientId) {
            return <Link className='body2-primary hover:underline' to={`${PatientsPath}/${info.patientId}`}>{info.patientId}</Link>
        }
        if (!!info.contactId) {
            return <Link className='body2-primary hover:underline' to={`${ContactsPath}/${info.contactId}`}>{info.createdForName}</Link>
        }
        return t('common.not_available');
    }

    const goToPatientChart = () => {
        history.push(`${PatientsPath}/${info.patientId}`);
    }

    const goToTicketDetail = () => {
        history.push(`${TicketsPath}/${info.ticketNumber}`);
    }

    const goToContactDetail = () => {
        history.push(`${ContactsPath}/${info.contactId}`);
    }

    const displayName = () => {
        if (info.createdForName) {
            if (info.createdForName.startsWith('+') || /\d/.test(info.createdForName)) {
                return utils.applyPhoneMask(info.createdForName);
            }
            return info.createdForName;
        }
        return utils.applyPhoneMask(info.createdForMobileNumber);
    }
    return (
        <div className="flex flex-row border-b sms-chat-header">
            <div className="pt-4 pl-6">
                {!!info.createdForName &&
                    <Avatar userFullName={info.createdForName} />
                }
                {!info.createdForName &&
                    <Avatar icon={Icon.UserUnknown} />
                }
            </div>
            <div className="flex flex-col flex-auto pl-4 pr-6 pt-7">
                <div className="flex flex-row justify-between">
                    <div><h6>{displayName()}</h6></div>
                    <div>
                        <MoreMenu
                            iconClassName='default-toolbar-icon'
                            iconFillClassname='cursor-pointer icon-medium'
                            menuClassName='w-52'
                            items={getMoreMenuOption()}
                            onClick={onMoreMenuClick}
                        />
                    </div>
                </div>
                <div className="flex flex-row pt-2.5">
                    <div className="mr-6">
                        <span className="body2-medium mr-1.5">{t(`${displayPatientOrContentLabel()}`)}</span>
                        {getPatientOrContactId()}

                    </div>
                    {
                        !forNewTicketMessagePurpose &&
                        <>
                            <div className="mr-6">
                                <span className="body2-medium mr-1.5">{t('sms.chat.header.ticket_id')}</span>
                                <Link className='body2-primary' to={`${TicketsPath}/${info.ticketNumber}`}>{info.ticketNumber}</Link>
                            </div>
                            <div className="mr-6">
                                <span className="body2-medium mr-1.5">{t('sms.chat.header.ticket_type')}</span>
                                <span className="body2">{getTicketType()}</span>
                            </div>
                            <div>
                                <span className="body2-medium mr-1.5">{t('sms.chat.header.reason')}</span>
                                <span className="body2">{getTicketReasons()}</span>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default SmsHeader;
