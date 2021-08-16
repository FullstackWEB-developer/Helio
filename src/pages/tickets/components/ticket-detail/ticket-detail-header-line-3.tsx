import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Ticket} from '@pages/tickets/models/ticket';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {addFeed, setDelete, setStatus} from '@pages/tickets/services/tickets.service';
import {changeStatus, setTicket, setTicketUpdateModel} from '@pages/tickets/store/tickets.slice';
import {FeedTypes, TicketFeed} from '@pages/tickets/models/ticket-feed';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {selectEnumValues, selectTicketUpdateModel} from '@pages/tickets/store/tickets.selectors';
import Button from '@components/button/button';
import Confirmation from '@components/confirmation/confirmation';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import {showCcp} from '@shared/layout/store/layout.slice';
import Logger from '@shared/services/logger';
import Dropdown from '@components/dropdown/dropdown';
import customHooks from '@shared/hooks/customHooks';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';
import {Contact} from '@shared/models/contact.model';

export interface TicketDetailHeaderLine3Props {
    ticket: Ticket,
    patient?: ExtendedPatient,
    contact?: Contact
}

const TicketDetailHeaderLine3 = ({ticket, patient, contact}: TicketDetailHeaderLine3Props) => {
    enum PhoneType {
        None,
        Mobile,
        Home,
        Work
    }

    const logger = Logger.getInstance();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [confirmationTitle, setConfirmationTitle] = useState<string>('');
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');
    const [displayConfirmation, setDisplayConfirmation] = useState<boolean>(false);
    const [displayPhoneDropdown, setDisplayPhoneDropdown] = useState<boolean>(false);
    const [phoneDropdownList, setPhoneDropdownList] = useState<DropdownItemModel[]>([]);
    const [confirmationOkButtonLabel, setConfirmationOkButtonLabel] = useState<string>('');
    const [selectedPhoneToCall, setSelectedPhoneToCall] = useState<PhoneType>(PhoneType.None);
    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')));
    const phoneDropdownRef = useRef<HTMLDivElement>(null);
    const ticketUpdateModel = useSelector(selectTicketUpdateModel);

    customHooks.useOutsideClick([phoneDropdownRef], () => {
        setDisplayPhoneDropdown(false);
    });

    const confirmProcess = () => {
        setConfirmationTitle('ticket_detail.header.archive_confirmation_title');
        setConfirmationMessage('ticket_detail.header.archive_confirmation_message');
        setConfirmationOkButtonLabel('ticket_detail.header.archive');
        setDisplayConfirmation(true);
    }

    const processConfirmed = () => {
        handleMarkAsArchived();
        setDisplayConfirmation(false);
    }

    const cancelConfirmation = () => {
        setDisplayConfirmation(false);
    }

    const canSendSms = () => {
        return (patient?.mobilePhone || contact?.mobilePhone || ticket.originationNumber);
    }

    const displayCall = () => {
        if (patient?.mobilePhone || contact?.mobilePhone || ticket.originationNumber) {
            return 'mobile';
        } else if (patient?.homePhone) {
            return 'home';
        } else if (contact?.workMainPhone) {
            return 'work';
        }
        return null;
    }

    const callRelated = useCallback((type: PhoneType) => {
        dispatch(showCcp());
        setSelectedPhoneToCall(type);
        setDisplayPhoneDropdown(false);
        let phoneNumber = '';
        if (ticket.originationNumber) {
            phoneNumber = ticket.originationNumber;
        } else if (patient) {
            phoneNumber = type === PhoneType.Mobile ? patient.mobilePhone : patient.homePhone;
        } else if (contact) {
            phoneNumber = type === PhoneType.Mobile ? contact.mobilePhone : contact.workMainPhone;
        }
        if (window.CCP.agent) {
            const endpoint = connect.Endpoint.byPhoneNumber(phoneNumber);
            window.CCP.agent.connect(endpoint, {
                failure: (e: any) => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: t('ticket_detail.header.call_failed', {phone: phoneNumber})
                    }));
                    logger.error('Cannot make a call to patient / contact: ' + phoneNumber, e);
                }
            })
        }
    }, [patient, dispatch, contact, PhoneType.Mobile, logger])

    const archiveTicketMutation = useMutation(setDelete, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('ticket_detail.header.archived_successfully')
            }));
            dispatch(setTicketUpdateModel({
                ...ticketUpdateModel,
                isDeleted:true
            }))
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('ticket_detail.header.archive_fail')
            }));
        }
    });

    const handleMarkAsArchived = () => {
        if (ticket && ticket.id) {
            archiveTicketMutation.mutate({id: ticket.id});
        }
    }

    const addFeedMutation = useMutation(addFeed, {
        onSuccess: (data) => {
            dispatch(setTicket(data));
        }
    });

    const updateStatusMutation = useMutation(setStatus, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_status_updated'
            }));
            dispatch(setTicket(data));
            dispatch(changeStatus({
                id: data.id,
                status: data.status
            }));
            if (data.status) {
                const feedData: TicketFeed = {
                    feedType: FeedTypes.StatusChange,
                    description: `${t('ticket_detail.feed.description_prefix')} ${TicketStatuses[data.status]}`
                };
                ticket.id && addFeedMutation.mutate({ticketId: ticket.id, feed: feedData});
            }
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_status_update_error',
                type: SnackbarType.Error
            }));
        }

    });

    const updateStatus = async (statusValue: string) => {
        const statusKey = ticketStatuses ? ticketStatuses.find((s) => s.value === statusValue)?.key : null;
        if (ticket && ticket.id && statusKey) {
            updateStatusMutation.mutate({id: ticket.id, status: statusKey});
        }
    }

    const getCallablePhoneListCallback = useCallback(() => {
        const items: DropdownItemModel[] = [];

        if (patient) {
            if (patient.mobilePhone) {
                setSelectedPhoneToCall(PhoneType.Mobile)
            } else if (patient.homePhone) {
                setSelectedPhoneToCall(PhoneType.Home)
            }

            if (patient.mobilePhone && selectedPhoneToCall !== PhoneType.Mobile) {
                items.push({
                    label: 'ticket_detail.header.call_mobile',
                    value: PhoneType.Mobile.toString(),
                    onClick: () => callRelated(PhoneType.Mobile)
                } as DropdownItemModel);
            }
            if (patient.homePhone && selectedPhoneToCall !== PhoneType.Home) {
                items.push({
                    label: 'ticket_detail.header.call_home',
                    value: PhoneType.Home.toString(),
                    onClick: () => callRelated(PhoneType.Home)
                } as DropdownItemModel);
            }
            setPhoneDropdownList(items);
        } else if (contact) {
            if (contact.mobilePhone) {
                setSelectedPhoneToCall(PhoneType.Mobile)
            } else if (contact.workMainPhone) {
                setSelectedPhoneToCall(PhoneType.Work)
            }

            if (contact.mobilePhone && selectedPhoneToCall !== PhoneType.Mobile) {
                items.push({
                    label: 'ticket_detail.header.call_mobile',
                    value: PhoneType.Mobile.toString(),
                    onClick: () => callRelated(PhoneType.Mobile)
                } as DropdownItemModel);
            }
            if (contact.workMainPhone && selectedPhoneToCall !== PhoneType.Work) {
                items.push({
                    label: 'ticket_detail.header.call_work',
                    value: PhoneType.Work.toString(),
                    onClick: () => callRelated(PhoneType.Work)
                } as DropdownItemModel);
            }
            setPhoneDropdownList(items);
        } else if (ticket.originationNumber && ticket.originationNumber.length > 0) {
            setSelectedPhoneToCall(PhoneType.Mobile);
        }
    }, [PhoneType.Home, PhoneType.Mobile, PhoneType.Work, callRelated, patient, contact, selectedPhoneToCall]);

    useEffect(() => {
        getCallablePhoneListCallback();
    }, [getCallablePhoneListCallback, patient])


    const dropdownModel: DropdownModel = {
        items: phoneDropdownList
    }

    return <>
        <div className='pl-8 flex flex-row items-center h-14 border-t border-b justify-between'>
            <div className='flex flex-row items-center'>
                {
                    displayCall() && <div>
                        <div ref={phoneDropdownRef} className='flex flex-row items-center cursor-pointer relative'>
                            <SvgIcon type={Icon.ChannelPhone} className='icon-x-large'
                                     fillClass='header-active-item-icon'
                                     strokeClass='channel-icon-stroke'/>
                            <div onClick={() => callRelated(selectedPhoneToCall)}
                                 className='pl-3 pr-2'>{t(`ticket_detail.header.call_${displayCall()}`)}</div>
                            {dropdownModel.items && dropdownModel.items.length > 0 &&
                            <SvgIcon onClick={() => setDisplayPhoneDropdown(!displayPhoneDropdown)}
                                     type={Icon.ArrowDown} className='icon-medium'/>}
                        </div>
                        {displayPhoneDropdown && dropdownModel.items && dropdownModel.items.length > 0 &&
                        <div className='absolute'>
                            <Dropdown model={dropdownModel}/>
                        </div>}
                    </div>
                }
                {
                    canSendSms() && <div className='pl-6 flex flex-row items-center cursor-pointer'>
                        <SvgIcon type={Icon.ChannelSms} className='icon-x-large' fillClass='header-active-item-icon'
                                 strokeClass='channel-icon-stroke'/>
                        <div className='pl-3 pr-2'>{t('ticket_detail.header.send_sms')}</div>
                    </div>
                }
                {
                    (patient?.emailAddress) && <div className='pl-6 flex flex-row items-center cursor-pointer'>
                        <SvgIcon type={Icon.ChannelEmail} className='icon-x-large' fillClass='header-active-item-icon'
                                 strokeClass='channel-icon-stroke'/>
                        <div className='pl-3 pr-2'>{t('ticket_detail.header.send_email')}</div>
                    </div>
                }
            </div>
            <div className='flex flex-row'>
                <div className='pr-6'>
                    <Button data-test-id='ticket-detail-header-delete-button'
                            buttonType='secondary'
                            isLoading={archiveTicketMutation.isLoading}
                            disabled={archiveTicketMutation.isLoading || ticketUpdateModel?.isDeleted}
                            onClick={() => confirmProcess()}
                            label={'ticket_detail.header.archive'}/>
                </div>
                <div className='pr-6'>
                    <Button disabled={ticket.status === TicketStatuses.Solved || updateStatusMutation.isLoading}
                            data-test-id='ticket-detail-header-solved-button'
                            buttonType='small'
                            isLoading={updateStatusMutation.isLoading && updateStatusMutation.variables?.status === TicketStatuses.Solved}
                            onClick={() => updateStatus('Solved')}
                            label={'ticket_detail.header.solved'}/>
                </div>
                <div className='pr-8'>
                    <Button disabled={ticket.status === TicketStatuses.Closed || updateStatusMutation.isLoading}
                            data-test-id='ticket-detail-header-close-button'
                            buttonType='small'
                            isLoading={updateStatusMutation.isLoading && updateStatusMutation.variables?.status === TicketStatuses.Closed}
                            onClick={() => updateStatus('Closed')}
                            label={'ticket_detail.header.close'}/>
                </div>
            </div>
        </div>
        <Confirmation
            onClose={cancelConfirmation}
            onCancel={cancelConfirmation}
            okButtonLabel={confirmationOkButtonLabel}
            onOk={() => processConfirmed()}
            title={confirmationTitle}
            message={confirmationMessage}
            isOpen={displayConfirmation}/>
    </>
}

export default TicketDetailHeaderLine3;
