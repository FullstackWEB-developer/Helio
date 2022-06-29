import {ContactsPath, PatientsPath, TicketsPath} from '@app/paths';
import {DropdownItemModel, DropdownModel} from '@components/dropdown';
import MoreMenu from '@components/more-menu';
import SvgIcon, {Icon} from '@components/svg-icon';
import {AddTicketReview} from '@components/ticket-rating';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {ChannelTypes} from '@shared/models';
import utils from '@shared/utils/utils';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {Ticket} from '../models/ticket';

const TicketListItemActions = ({ticketInfo, forceMoreMenuClose = false}: {ticketInfo: Ticket, forceMoreMenuClose?: boolean}) => {

    const {t} = useTranslation();
    const anonymous = 'anonymous';
    const history = useHistory();
    const canAddReview = useCheckPermission('Tickets.AddReview');
    const [addReviewForTicket, setAddReviewForTicket] = useState<string | undefined>();
    const [forceMenuClose, setForceMenuClose] = useState<boolean>(forceMoreMenuClose);

    useEffect(() => {
        setForceMenuClose(forceMoreMenuClose);
    }, [forceMoreMenuClose]);

    const generateDropdownModelOptions = (): DropdownModel => {
        let items: DropdownItemModel[] = [
            {
                value: t('tickets.ticket_list_actions.ticket_details'),
                label: t('tickets.ticket_list_actions.ticket_details'),
                icon: <SvgIcon type={Icon.Tickets} fillClass='rgba-062-fill' />
            }
        ];
        if (ticketInfo.channel === ChannelTypes.PhoneCall && ticketInfo.originationNumber && ticketInfo.originationNumber !== anonymous) {
            items.push({
                value: t('tickets.ticket_list_actions.call'),
                label: t('tickets.ticket_list_actions.call'),
                icon: <SvgIcon type={Icon.Phone} fillClass='rgba-062-fill' />
            });
        }
        if (ticketInfo.patientId) {
            items.push({
                value: t('tickets.ticket_list_actions.patient_details'),
                label: t('tickets.ticket_list_actions.patient_details'),
                icon: <SvgIcon type={Icon.PatientChartV2} fillClass='rgba-062-fill' />
            });
        }
        if (ticketInfo.contactId) {
            items.push({
                value: t('tickets.ticket_list_actions.contact_details'),
                label: t('tickets.ticket_list_actions.contact_details'),
                icon: <SvgIcon type={Icon.Contacts} fillClass='rgba-062-fill' />
            });
        }
        if (canAddReview && ticketInfo.assignee) {
            items.push({
                value: t('tickets.ticket_list_actions.add_review'),
                label: t('tickets.ticket_list_actions.add_review'),
                icon: <SvgIcon type={Icon.Comment} fillClass='rgba-062-fill' />
            });
        }

        return {
            items,
            onClick: (id) => handleDropdownClick(id)
        };
    }


    const handleDropdownClick = (id: string) => {
        switch (id) {
            case t('tickets.ticket_list_actions.ticket_details'): {
                history.push(`${TicketsPath}/${ticketInfo.ticketNumber}`);
                break;
            }
            case t('tickets.ticket_list_actions.call'): {
                utils.initiateACall(ticketInfo.originationNumber);
                if (!!ticketInfo.patientId) {
                    history.push(`${PatientsPath}/${ticketInfo.patientId}`);
                } else if (!!ticketInfo.contactId) {
                    history.push(`${ContactsPath}/${ticketInfo.contactId}`);
                }
                break;
            }
            case t('tickets.ticket_list_actions.patient_details'): {
                history.push(`${PatientsPath}/${ticketInfo.patientId}`);
                break;
            }
            case t('tickets.ticket_list_actions.contact_details'): {
                history.push(`${ContactsPath}/${ticketInfo.contactId}`);
                break;
            }
            case t('tickets.ticket_list_actions.add_review'): {
                setAddReviewForTicket(ticketInfo.id)
                break;
            }
            default:
                break;
        }
    }

    return (
        <>
            <MoreMenu items={generateDropdownModelOptions().items}
                iconClassName='opacity-0 group-hover:opacity-100'
                onClick={(item) => handleDropdownClick(item.value)}
                closeOnMouseLeave={true}
                forceToClose={forceMenuClose}
            />
            {addReviewForTicket && <AddTicketReview
                ticketId={addReviewForTicket}
                isOpen={!!addReviewForTicket}
                onClose={() => setAddReviewForTicket(undefined)} />}
        </>
    );
}

export default TicketListItemActions;
