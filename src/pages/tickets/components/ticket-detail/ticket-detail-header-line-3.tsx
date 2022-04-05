import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ControlledCheckbox, ControlledTextArea} from '@components/controllers';
import {useForm} from 'react-hook-form';
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
import Modal from '@components/modal/modal';
import './ticket-detail-header.scss';
import {createBlockAccess} from '@pages/blacklists/services/blacklists.service';
import {BlockAccessModel, BlockAccessType} from '@pages/blacklists/models/blacklist.model';
import utils from '@shared/utils/utils';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {Phone} from '@pages/tickets/models/phone.model';

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
    const [isBlockUserOpen, setIsBlockUserOpen] = useState(false);
    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')));
    const phoneDropdownRef = useRef<HTMLDivElement>(null);
    const ticketUpdateModel = useSelector(selectTicketUpdateModel);

    const {control, handleSubmit, getValues, setValue} = useForm({});

    customHooks.useOutsideClick([phoneDropdownRef], () => {
        setDisplayPhoneDropdown(false);
    });

    const confirmArchive = () => {
        setConfirmationTitle('ticket_detail.header.archive_confirmation_title');
        setConfirmationMessage('ticket_detail.header.archive_confirmation_message');
        setConfirmationOkButtonLabel('ticket_detail.header.archive');
        setDisplayConfirmation(true);
    }

    const confirmUnarchive = () => {
        setConfirmationTitle('ticket_detail.header.unarchive_confirmation_title');
        setConfirmationMessage('ticket_detail.header.unarchive_confirmation_message');
        setConfirmationOkButtonLabel('ticket_detail.header.unarchive');
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
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t(data.isDeleted ? 'ticket_detail.header.archived_successfully' : 'ticket_detail.header.unarchived_successfully')
            }));
            dispatch(setTicketUpdateModel({
                ...ticketUpdateModel,
                isDeleted: true
            }))
        },
        onError: (_, variables) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t(variables.undoDelete ? 'ticket_detail.header.unarchive_fail' : 'ticket_detail.header.archive_fail')
            }));
        }
    });

    const handleMarkAsArchived = () => {
        if (ticket && ticket.id) {
            archiveTicketMutation.mutate({id: ticket.id, undoDelete: ticket.isDeleted}, {
                onSuccess: data => {
                    dispatch(setTicket(data));
                }
            });
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
    }, [PhoneType.Home, PhoneType.Mobile, PhoneType.Work, callRelated, patient, contact, selectedPhoneToCall, ticket.originationNumber]);

    useEffect(() => {
        getCallablePhoneListCallback();
    }, [getCallablePhoneListCallback, patient])


    const dropdownModel: DropdownModel = {
        items: phoneDropdownList
    }

    const getEmails = () => {
        if (patient) {
            return [patient.emailAddress];
        } else {
            const emails: string[] = [];
            if (contact?.primaryEmailAddress) {
                emails.push(contact.primaryEmailAddress)
            }
            if (contact?.secondaryEmailAddress) {
                emails.push(contact.secondaryEmailAddress)
            }
            return emails;
        }
    }

    const getPhones = () => {
        const phones: Phone[] = [];
        if (patient?.mobilePhone) {
            phones.push(
                {
                    phoneType: t('ticket_detail.header.block_user.mobile_phone'),
                    phoneNumber: patient.mobilePhone
                }
            );
        }
        if (patient?.homePhone) {
            phones.push(
                {
                    phoneType: t('ticket_detail.header.block_user.home_phone'),
                    phoneNumber: patient.homePhone
                }
            );
        }
        if (contact?.mobilePhone) {
            phones.push(
                {
                    phoneType: t('ticket_detail.header.block_user.mobile_phone'),
                    phoneNumber: contact.mobilePhone
                }
            );
        }
        if (contact?.workMainPhone) {
            phones.push(
                {
                    phoneType: t('ticket_detail.header.block_user.work_phone'),
                    phoneNumber: contact.workMainPhone
                }
            );
        }
        if (contact?.cellPhoneNumber) {
            phones.push(
                {
                    phoneType: t('ticket_detail.header.block_user.cell_phone'),
                    phoneNumber: contact.cellPhoneNumber
                }
            );
        }
        if (!patient && !contact && ticket.originationNumber) {
            phones.push(
                {
                    phoneType: t('ticket_detail.header.block_user.other_phone'),
                    phoneNumber: ticket.originationNumber
                }
            );
        }
        return phones;
    }

    const onBlockAllChanged = () => {
        if (getValues('block_all').checked) {
            setValue('block_email', {value: undefined, checked: true});
            setValue('block_phones', {value: undefined, checked: true});
            setValue('block_ip', {value: undefined, checked: true});
        } else {
            setValue('block_email', {value: undefined, checked: false});
            setValue('block_phones', {value: undefined, checked: false});
            setValue('block_ip', {value: undefined, checked: false});
        }
    }

    const createBlockUserMutation = useMutation(createBlockAccess, {
        onSuccess: (_, variables: BlockAccessModel) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('ticket_detail.header.block_user.success_detailed', {
                    value: variables.value
                }),
                position: SnackbarPosition.TopCenter
            }));
            setIsBlockUserOpen(false);
        },
        onError: (_, variables: BlockAccessModel) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('ticket_detail.header.block_user.failure_detailed', {
                    value: variables.value
                }),
                position: SnackbarPosition.TopCenter
            }));
        }
    })

    const onBlockUser = (formData: any) => {
        if (formData.block_email?.checked) {
            getEmails().forEach(email => {
                if (email) {
                    createBlockUserMutation.mutate({
                        isActive: true,
                        accessType: BlockAccessType.Email,
                        value: email,
                        comment: formData.note
                    } as BlockAccessModel);
                }
            });
        }

        if (formData.block_phones?.checked) {
            getPhones().forEach(phone => {
                if (phone && phone.phoneNumber) {
                    createBlockUserMutation.mutate({
                        isActive: true,
                        accessType: BlockAccessType.Phone,
                        value: phone.phoneNumber,
                        comment: formData.note
                    } as BlockAccessModel);
                }
            });
        }

        if (ticket.ipAddress && formData.block_ip?.checked) {
            createBlockUserMutation.mutate({
                isActive: true,
                accessType: BlockAccessType.IPAddress,
                value: ticket.ipAddress,
                comment: formData.note
            });
        }
    }

    const isBlockAllVisible = () => {
        let checkBoxCounter = 0;
        if (getEmails().length > 0) {
            checkBoxCounter++;
        }
        if (getPhones().length > 0) {
            checkBoxCounter++;
        }
        if (ticket.ipAddress) {
            checkBoxCounter++;
        }
        return checkBoxCounter > 1;
    }

    const isBlockUserDisabled = () => {
        return !ticket.ipAddress && !contact && !patient && !ticket.originationNumber;
    }

    return <>
        <div className='flex flex-row items-center justify-between pl-8 border-t border-b h-14'>
            <div className='flex flex-row items-center'>
                {
                    displayCall() && <div>
                        <div ref={phoneDropdownRef} className='relative flex flex-row items-center cursor-pointer'>
                            <SvgIcon type={Icon.ChannelPhone} className='icon-x-large'
                                fillClass='header-active-item-call-icon'
                                strokeClass='channel-call-icon-stroke'
                                onClick={() => callRelated(selectedPhoneToCall)} />
                            <div onClick={() => callRelated(selectedPhoneToCall)}
                                className='pl-3 pr-2'>{t(`ticket_detail.header.call_${displayCall()}`)}</div>
                            {dropdownModel.items && dropdownModel.items.length > 0 &&
                                <SvgIcon onClick={() => setDisplayPhoneDropdown(!displayPhoneDropdown)}
                                    type={Icon.ArrowDown} className='icon-medium' />}
                        </div>
                        {displayPhoneDropdown && dropdownModel.items && dropdownModel.items.length > 0 &&
                            <div className='absolute'>
                                <Dropdown model={dropdownModel} />
                            </div>}
                    </div>
                }
                {
                    // PLEASE DON'T DELETE THIS
                    // (patient?.emailAddress) && <div className='flex flex-row items-center pl-6 cursor-pointer'>
                    //     <SvgIcon type={Icon.ChannelEmail} className='icon-x-large' fillClass='header-active-item-icon'
                    //              strokeClass='channel-icon-stroke'/>
                    //     <div className='pl-3 pr-2'>{t('ticket_detail.header.send_email')}</div>
                    // </div>
                }
            </div>
            <div className='flex flex-row'>
                <div className='flex flex-row items-center pr-6 cursor-pointer'>
                    <SvgIcon type={Icon.Spam} className='icon-medium'
                        fillClass='header-spam-icon'
                        onClick={() => setIsBlockUserOpen(true)} />
                    <div className='pl-3 pr-2' onClick={() => setIsBlockUserOpen(true)}>
                        {t('ticket_detail.header.spam')}
                    </div>
                </div>
                <div className='pr-6'>
                    {ticket.isDeleted ? <Button data-test-id='ticket-detail-header-unarchive-button'
                        buttonType='secondary'
                        isLoading={archiveTicketMutation.isLoading}
                        disabled={archiveTicketMutation.isLoading}
                        onClick={() => confirmUnarchive()}
                        label={'ticket_detail.header.unarchive'} />
                        : <Button data-test-id='ticket-detail-header-delete-button'
                            buttonType='secondary'
                            isLoading={archiveTicketMutation.isLoading}
                            disabled={archiveTicketMutation.isLoading}
                            onClick={() => confirmArchive()}
                            label={'ticket_detail.header.archive'} />}
                </div>
                <div className='pr-6'>
                    <Button disabled={ticket.status === TicketStatuses.Solved || updateStatusMutation.isLoading}
                        data-test-id='ticket-detail-header-solved-button'
                        buttonType='small'
                        isLoading={updateStatusMutation.isLoading && updateStatusMutation.variables?.status === TicketStatuses.Solved}
                        onClick={() => updateStatus('Solved')}
                        label={'ticket_detail.header.solved'} />
                </div>
                <div className='pr-8'>
                    <Button disabled={ticket.status === TicketStatuses.Closed || updateStatusMutation.isLoading}
                        data-test-id='ticket-detail-header-close-button'
                        buttonType='small'
                        isLoading={updateStatusMutation.isLoading && updateStatusMutation.variables?.status === TicketStatuses.Closed}
                        onClick={() => updateStatus('Closed')}
                        label={'ticket_detail.header.close'} />
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
            isOpen={displayConfirmation} />

        <div className='flex items-center justify-center'>
            <Modal isOpen={isBlockUserOpen}
                title={t('ticket_detail.header.block_user.title')}
                className='block-user-modal'
                onClose={() => {setIsBlockUserOpen(false)}}
                isClosable>
                <div className='pt-1'>
                    <span className='subtitle2'>{t('ticket_detail.header.block_user.description')}</span>
                    <div className='mt-5'>
                        {
                            isBlockAllVisible() &&
                            <ControlledCheckbox
                                control={control}
                                label='ticket_detail.header.block_user.block_all'
                                name='block_all'
                                className='body2'
                                labelClassName=''
                                onChange={onBlockAllChanged}
                            />
                        }
                        {
                            getEmails().length > 0 &&
                            <div className='grid grid-cols-3'>
                                <ControlledCheckbox
                                    control={control}
                                    label='ticket_detail.header.block_user.block_email'
                                    name='block_email'
                                    className='body2'
                                />
                                <div className='body2 col-span-2'>
                                    {
                                        getEmails().map(email => {
                                            return <div className='pb-2.5' key={email}>{
                                                email
                                            }</div>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            getPhones().length > 0 &&
                            <div className='grid grid-cols-3'>
                                <ControlledCheckbox
                                    control={control}
                                    label='ticket_detail.header.block_user.block_phones'
                                    name='block_phones'
                                    className='body2'
                                />
                                <div className='body2 col-span-2'>
                                    {
                                        getPhones().map(phone => {
                                            return <div className='pb-2.5' key={phone.phoneNumber}>{
                                                phone && phone.phoneNumber && `${phone.phoneType} ${utils.formatPhone(phone.phoneNumber)}`
                                            }</div>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            ticket.ipAddress &&
                            <div className='grid grid-cols-3'>
                                <ControlledCheckbox
                                    control={control}
                                    label='ticket_detail.header.block_user.block_ip'
                                    name='block_ip'
                                    className='body2 pb-16'

                                />
                                <div className='body2 col-span-2'>
                                    {ticket.ipAddress}
                                </div>
                            </div>
                        }
                        <ControlledTextArea
                            control={control}
                            name='note'
                            placeholder='ticket_detail.header.block_user.note'
                            resizable={false}
                            className='w-full body2'
                            rows={2}
                        />
                        <div className="flex items-center justify-end h-20 full-w pt-4">
                            <Button buttonType='secondary' label={t('common.cancel')} onClick={() => setIsBlockUserOpen(false)} />
                            <Button
                                type='submit'
                                buttonType='small'
                                label={t('ticket_detail.header.block_user.block_user_btn')}
                                className='ml-6 mr-2'
                                disabled={isBlockUserDisabled()}
                                onClick={() => handleSubmit(onBlockUser)()}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    </>
}

export default TicketDetailHeaderLine3;
