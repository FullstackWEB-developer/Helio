import React, {useEffect, useState} from 'react';
import './conversation-header.scss';
import Avatar from '@components/avatar';
import MoreMenu from '@components/more-menu'
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {ChannelTypes, ContactExtended, TicketMessageSummary} from '@shared/models';
import {useTranslation} from 'react-i18next';
import {selectEnumValues, selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {DropdownItemModel} from '@components/dropdown';
import {
    MORE_MENU_OPTION_ADD_CONTACT,
    MORE_MENU_OPTION_ARCHIVE_TICKET,
    MORE_MENU_OPTION_CLOSE_TICKET,
    MORE_MENU_OPTION_CONTACT,
    MORE_MENU_OPTION_CREATE_PATIENT_CHART,
    MORE_MENU_OPTION_PATIENT,
    MORE_MENU_OPTION_SOLVE_TICKET,
    MORE_MENU_OPTION_SPAM,
    MORE_MENU_OPTION_TICKET
} from '@pages/sms/constants';
import {ContactsPath, PatientsPath, TicketsPath} from '@app/paths';
import {Link, useHistory} from 'react-router-dom';
import {Icon} from '@components/svg-icon';
import {useMutation} from 'react-query';
import {getEnumByType, setDelete, setStatus} from '@pages/tickets/services/tickets.service';
import { getLookupValues } from '@shared/services/lookups.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';
import Spinner from '@components/spinner/Spinner';
import Modal from '@components/modal/modal';
import {ControlledInput, ControlledTextArea} from '@components/controllers';
import {useForm} from 'react-hook-form';
import Button from '@components/button/button';
import {createBlockAccess} from '@pages/blacklists/services/blacklists.service';
import ConversationHeaderPopup from '@components/conversation-header-popup/conversation-header-popup';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {BlockAccessType} from '@pages/blacklists/models/blacklist.model';
import {Ticket} from '@pages/tickets/models/ticket';

interface ConversationHeaderProps {
    info: TicketMessageSummary;
    forNewTicketMessagePurpose: boolean;
    patientPhoto?: string;
    conversationChannel: ChannelTypes.SMS | ChannelTypes.Email;
    patient?: ExtendedPatient;
    contact?: ContactExtended;
    ticket?: Ticket;
    refetchTicket?: () => void;
}
const ConversationHeader = ({info, forNewTicketMessagePurpose, patientPhoto, conversationChannel = ChannelTypes.SMS, patient, contact, ticket, refetchTicket}: ConversationHeaderProps) => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [markedAsSpam, setMarkedAsSpam] = useState<boolean>(false);
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const getTicketReasons = () => {
        return ticketReasons.find((lookupValue) => lookupValue.value === ticket?.reason)?.label ?? t('common.not_available');
    }
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const getTicketType = () => {
        return ticketTypes.find((lookupValue) => lookupValue.key === ticket?.type)?.value ?? t('tickets.types.default');
    }
    const getMoreMenuOption = (): DropdownItemModel[] => {
        const options: DropdownItemModel[] = [];
        const commonClassName = 'body2 py-1.5';

        if (!forNewTicketMessagePurpose && ticket) {
            options.push({label: 'sms.chat.view_ticket', value: MORE_MENU_OPTION_TICKET, className: commonClassName});
        }
        if (!info.patientId && !info.contactId) {
            options.push({label: 'email.inbox.create_patient_chart', value: MORE_MENU_OPTION_CREATE_PATIENT_CHART, className: commonClassName});
            options.push({label: 'email.inbox.add_contact', value: MORE_MENU_OPTION_ADD_CONTACT, className: commonClassName});
        }

        if (ticket && ticket.status !== TicketStatuses.Closed) {
            options.push({label: 'email.inbox.close_ticket.label', value: MORE_MENU_OPTION_CLOSE_TICKET, className: commonClassName});
        }
        if (ticket && ticket.status !== TicketStatuses.Solved) {
            options.push({label: 'email.inbox.solve_ticket.label', value: MORE_MENU_OPTION_SOLVE_TICKET, className: commonClassName});
        }

        if (!!info.patientId) {
            options.push({label: 'sms.chat.view_patient', value: MORE_MENU_OPTION_PATIENT, className: commonClassName});
        }

        if (!!info.contactId) {
            options.push({label: 'sms.chat.view_contact', value: MORE_MENU_OPTION_CONTACT, className: commonClassName});
        }
        if (ticket && !ticket.isDeleted) {
            options.push({
                label: 'email.inbox.archive_ticket.label',
                value: MORE_MENU_OPTION_ARCHIVE_TICKET,
                className: commonClassName
            });
        }
        if (!markedAsSpam) {
            options.push({label: 'email.inbox.spam', value: MORE_MENU_OPTION_SPAM, className: commonClassName});
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
            case MORE_MENU_OPTION_CLOSE_TICKET:
                updateStatusMutation.mutate({id: info.ticketId, status: TicketStatuses.Closed});
                break;
            case MORE_MENU_OPTION_SOLVE_TICKET:
                updateStatusMutation.mutate({id: info.ticketId, status: TicketStatuses.Solved});
                break;
            case MORE_MENU_OPTION_ARCHIVE_TICKET:
                archiveTicketMutation.mutate({id: info.ticketId})
                break;
            case MORE_MENU_OPTION_SPAM:
                setBlockedAccessModalOpen(true);
                break;
            case MORE_MENU_OPTION_ADD_CONTACT:
                history.push(ContactsPath, {
                    email: info.createdForEndpoint
                });
                break;
            case MORE_MENU_OPTION_CREATE_PATIENT_CHART:
                window.open(utils.getAppParameter('AthenaHealthUrl'), '_blank');
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
        return utils.applyPhoneMask(info.createdForEndpoint);
    }

    const getImage = () => {
        if (patientPhoto && patientPhoto.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                src={`data:image/jpeg;base64,${patientPhoto}`} />
        }

        return <Avatar userFullName={info.createdForName} />
    }

    const updateStatusMutation = useMutation(setStatus, {
        onSuccess: (_, {status}) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: `email.inbox.${status === TicketStatuses.Closed ? 'close' : 'solve'}_ticket.success`
            }));
            if (refetchTicket) {
                refetchTicket();
            }
        },
        onError: (_, {status}) => {
            dispatch(addSnackbarMessage({
                message: `email.inbox.${status === TicketStatuses.Closed ? 'close' : 'solve'}_ticket.failure`,
                type: SnackbarType.Error
            }));
        }
    });

    const archiveTicketMutation = useMutation(setDelete, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('email.inbox.archive_ticket.success')
            }));
            if (refetchTicket) {
                refetchTicket();
            }
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('email.inbox.archive_ticket.failure')
            }));
        }
    });

    const isLoading = updateStatusMutation.isLoading || archiveTicketMutation.isLoading;

    const [blockedAccessModalOpen, setBlockedAccessModalOpen] = useState(false);
    const {control, handleSubmit, formState: {isValid}} = useForm({mode: 'all'});
    const blockMutation = useMutation(createBlockAccess, {
        onSuccess: () => {
            setBlockedAccessModalOpen(false);
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('email.inbox.blocked_success', {value: info.createdForEndpoint}),
            }));
            setMarkedAsSpam(true);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('email.inbox.blocked_failure', {value: info.createdForEndpoint})
            }));
        }
    });
    const performEmailBlock = (formData: any) => {
        blockMutation.mutate({
            isActive: true,
            accessType: conversationChannel === ChannelTypes.SMS ? BlockAccessType.Phone : BlockAccessType.Email,
            value: formData.value,
            comment: formData.note
        });
    }

    return (
        <div className="flex flex-row border-b sms-chat-header">
            <div className="pt-4 pl-6">
                {!!info.createdForName && getImage()}
                {!info.createdForName &&
                    <Avatar icon={Icon.UserUnknown} userPicture={patientPhoto} />
                }
            </div>
            <div className="flex flex-col flex-auto pl-4 pr-6 pt-7">
                <div className="flex flex-row justify-between">
                    <div className='flex items-center'>
                        <h6>{displayName()}</h6>
                        {
                            conversationChannel === ChannelTypes.Email &&
                            <ConversationHeaderPopup
                                anonymous={!info.patientId && !info.contactId}
                                name={displayName()}
                                photo={info?.createdForName ? getImage() : <Avatar icon={Icon.UserUnknown} userPicture={patientPhoto} />}
                                contact={contact}
                                patient={patient}
                            />
                        }
                    </div>
                    <div className='relative'>
                        {
                            isLoading ? <Spinner size='small' /> :
                                <MoreMenu
                                    iconClassName='default-toolbar-icon'
                                    iconFillClassname='cursor-pointer icon-medium'
                                    menuClassName='w-52'
                                    horizontalOffset={-80}
                                    verticalOffset={5}
                                    items={getMoreMenuOption()}
                                    onClick={onMoreMenuClick}
                                />
                        }
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
                                <Link className='body2-primary hover:underline' to={`${TicketsPath}/${info.ticketNumber}`}>{info.ticketNumber}</Link>
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
            <div className='flex items-center justify-center justify-self-center'>
                <Modal isDraggable={true} isOpen={blockedAccessModalOpen} title={t('email.inbox.block_email')}
                    onClose={() => setBlockedAccessModalOpen(false)}
                    isClosable={true}>
                    <div className='w-full mb-10'>
                        <p className='mb-2 body2'>{t(conversationChannel === ChannelTypes.SMS ? 'blacklist.add_new_block_form.phone_description' : 'blacklist.add_new_block_form.email_description')}</p>
                        <ControlledInput
                            control={control}
                            name='value'
                            type={conversationChannel === ChannelTypes.SMS ? 'tel' : 'email'}
                            label={conversationChannel === ChannelTypes.SMS ? 'blacklist.block_access_type.phone' : 'blacklist.block_access_type.email'}
                            defaultValue={conversationChannel === ChannelTypes.SMS ? info.createdForEndpoint : (info.createdForEndpoint || patient?.emailAddress || contact?.emailAddress)}
                            containerClassName='w-72'
                            required
                        />
                        <ControlledTextArea
                            control={control}
                            name='note'
                            placeholder='blacklist.add_new_block_form.note_placeholder'
                            resizable={false}
                            className='w-full body2'
                            rows={3}
                        />
                        <div className='flex justify-end mt-10'>
                            <Button label='common.cancel' className='mr-6' buttonType='secondary' onClick={() => setBlockedAccessModalOpen(false)} />
                            <Button
                                type='submit'
                                buttonType='small'
                                disabled={!isValid}
                                isLoading={blockMutation.isLoading}
                                label='email.inbox.block_email'
                                onClick={() => handleSubmit(performEmailBlock)()}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default ConversationHeader;
