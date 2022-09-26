import React, {useEffect, useMemo, useState} from 'react';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import Collapsible from '../../../../shared/components/collapsible/collapsible';
import TicketDetailPatientInfo from './ticket-detail-patient-info';
import TicketDetailAttachments from './ticket-detail-attachments';
import TicketDetailEventLog from './ticket-detail-event-log';
import {Patient} from '@pages/patients/models/patient';
import {Contact} from '@shared/models/contact.model';
import TicketDetailContactInfo from '@pages/tickets/components/ticket-detail/ticket-detail-contact-info';
import TicketDetailTicketInfo from '@pages/tickets/components/ticket-detail/ticket-detail-ticket-info';
import {useForm} from 'react-hook-form';
import {setTicketUpdateModel, setTicketUpdateHash} from '@pages/tickets/store/tickets.slice';
import {useDispatch, useSelector} from 'react-redux';
import {selectEnumValuesAsOptions, selectLookupValuesAsOptions, selectTicketUpdateHash, selectTicketUpdateModel} from '@pages/tickets/store/tickets.selectors';
import {useMutation, useQuery} from 'react-query';
import {addFeed, getChildrenTicketNumbers, updateTicket} from '@pages/tickets/services/tickets.service';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {FeedTypes, TicketFeed} from '@pages/tickets/models/ticket-feed';
import {useTranslation} from 'react-i18next';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Button from '@components/button/button';
import {selectLocationsAsOptions} from '@shared/store/lookups/lookups.selectors';
import {getPatientActionNotes, getPatientCaseDocument} from '@pages/patients/services/patient-document.service';
import utils from '@shared/utils/utils';
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';
import hash from 'object-hash';
import './ticket-detail-info-panel.scss';
import {usePrevious} from '@shared/hooks/usePrevious';
import dayjs from 'dayjs';
import TicketReviews from '@pages/tickets/components/ticket-detail/ticket-reviews/ticket-reviews';
import PatientRatingSideBar from '../patient-rating-sidebar';
import {ContactType} from '@shared/models';
import {setAssignee} from '../../services/tickets.service';
import {selectActiveUserOptions} from '@shared/store/lookups/lookups.selectors';
import {Option} from '@components/option/option';
import {Link} from 'react-router-dom';
import TicketDetailRelatedTickets from './ticket-detail-related-tickets';
import {GetChildrenTicketNumbers} from '@constants/react-query-constants';
import Spinner from '@components/spinner/Spinner';
interface TicketDetailInfoPanelProps {
    ticket: Ticket,
    patient?: Patient,
    contact?: Contact
}

const TicketDetailInfoPanel = ({ticket, patient, contact}: TicketDetailInfoPanelProps) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const userListOptions = useSelector(selectActiveUserOptions);
    const updateModel = useSelector(selectTicketUpdateModel);
    const storedUpdateModelHash = useSelector(selectTicketUpdateHash);
    const {handleSubmit, control, setError, clearErrors, errors, reset, watch} = useForm({
        defaultValues: updateModel,
        mode: 'onChange'
    });

    const statusOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketStatus')));
    const departmentOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'Department'));
    const priorityOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketPriority')));
    const locationOptions = useSelector(selectLocationsAsOptions);
    const reasonOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketReason'));
    const ticketTypeOptions = useSelector((state) => selectEnumValuesAsOptions(state, 'TicketType'));
    const [isPatientCaseNumberLoading, setPatientCaseNumberLoading] = useState(false);
    const [isDueDateVisible, setIsDueDateVisible] = useState(false);
    const previousTicket = usePrevious(ticket);
    const isDirty = () => {
        if (!updateModel) {
            return false;
        }
        return storedUpdateModelHash !== hash.MD5(updateModel);
    }

    const generateTicketUpdateModel = () => {
        const ticketUpdateModel: TicketUpdateModel = {
            status: statusOptions.find(a => a.value.toString() === ticket.status?.toString()),
            priority: priorityOptions.find(a => a.value.toString() === ticket.priority?.toString()),
            department: departmentOptions.find(a => a.value.toString() === ticket.department?.toString()),
            type: ticketTypeOptions.find(a => a.value.toString() === ticket.type?.toString()),
            reason: reasonOptions.find(a => a.value.toString() === ticket.reason?.toString()),
            location: locationOptions.find(a => a.value.toString() === ticket.location?.toString()),
            tags: ticket.tags ? ticket.tags : [],
            callbackPhoneNumber: ticket.callbackPhoneNumber ?? '',
            patientCaseNumber: ticket.patientCaseNumber,
            storedDueDate: ticket.dueDate,
            dueDate: ticket.dueDate ? dayjs.utc(ticket.dueDate).toDate() : undefined,
            dueTime: ticket.dueDate ? utils.formatUtcDate(ticket.dueDate, 'hh:mm A') : undefined,
            isDeleted: ticket.isDeleted,
            assignee: userListOptions.find(a => a.value.toString() === ticket.assignee?.toString())
        };
        const initialTicketHash = hash.MD5(ticketUpdateModel);
        reset(ticketUpdateModel);
        dispatch(setTicketUpdateHash(initialTicketHash));
        dispatch(setTicketUpdateModel(ticketUpdateModel));
    }

    useEffect(() => {
        generateTicketUpdateModel();
    }, [ticket]);

    useEffect(() => {
        control.trigger();
    }, []);

    const ticketUpdateMutation = useMutation(updateTicket, {
        onSuccess: (data, variables) => {
            const user = userListOptions ? userListOptions.find((o: Option) => o.value === updateModel["assignee"]?.value) : {} as any;
            if (ticket.id && user && variables.ticketData.assignee !== user.value) {
                updateAssigneeMutation.mutate({ticketId: ticket.id, assignee: user.value});
            }
            dispatch(setTicket(data));
            if (data.id && previousTicket?.status !== data.status) {
                const feedData: TicketFeed = {
                    feedType: FeedTypes.StatusChange,
                    description: `${t('ticket_detail.feed.description_prefix')} ${updateModel.status?.label}`
                };
                addFeedMutation.mutate({ticketId: ticket.id!, feed: feedData});
            }
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_updated'
            }));
            setIsDueDateVisible(false);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_update_failed',
                type: SnackbarType.Error
            }));
        }
    });

    const addFeedMutation = useMutation(addFeed, {
        onSuccess: (data) => {
            dispatch(setTicket(data));
        }
    });

    const validatePatientCaseNumber = async () => {

        if (!updateModel.patientCaseNumber || updateModel.patientCaseNumber === ticket.patientCaseNumber) {
            clearErrors('patientCaseNumber');
            return;
        }

        setPatientCaseNumberLoading(true);
        clearErrors('patientCaseNumber');
        if (patient && patient.patientId) {
            const patientCase = await getPatientCaseDocument(patient.patientId, Number(updateModel.patientCaseNumber));
            if (!patientCase) {
                setError('patientCaseNumber', {type: 'validate', message: t('ticket_new.patient_case_id_not_found')});
            }
        } else {
            const patientActionNotes = await getPatientActionNotes(Number(updateModel.patientCaseNumber));
            if (!patientActionNotes) {
                setError('patientCaseNumber', {type: 'validate', message: t('ticket_new.patient_case_id_not_found')});
            }
        }
        setPatientCaseNumberLoading(false);
    }

    const updateAssigneeMutation = useMutation(setAssignee, {
        onSuccess: (data) => {
            dispatch(setTicket(data));
        },
        onError: (error: any) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data.statusCode === 409 ? 'ticket_detail.ticket_already_assigned_to_selected_user_error' : 'ticket_detail.ticket_assign_error',
                type: SnackbarType.Error
            }));
        }
    });

    const onSubmit = () => {
        const dateTime = utils.getDateTime(updateModel.dueDate, updateModel.dueTime);
        ticketUpdateMutation.mutate({
            id: ticket.id!,
            ticketData: {
                department: updateModel.department?.value,
                status: Number(updateModel.status?.value),
                priority: Number(updateModel.priority?.value),
                reason: updateModel.reason?.value,
                location: updateModel.location?.value,
                type: Number(updateModel.type?.value),
                tags: updateModel.tags,
                callbackPhoneNumber: updateModel.callbackPhoneNumber,
                patientCaseNumber: updateModel.patientCaseNumber,
                dueDate: dateTime ? dateTime.toDate() : undefined,
                communicationDirection: ticket.communicationDirection,
                assignee: updateModel.assignee?.value
            }
        });
    }

    const resetForm = () => {
        generateTicketUpdateModel();
        setIsDueDateVisible(false);
        clearErrors();
    }

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0
    }

    const [patientOrContactName, setPatientOrContactName] = useState<string>('');
    useEffect(() => {
        if (contact) {
            setPatientOrContactName(contact.type === ContactType.Company ? contact.companyName : utils.stringJoin(' ', contact.firstName, contact.lastName));
        } else if (patient) {
            setPatientOrContactName(`${patient.firstName} ${patient.lastName}`);
        }
        else {
            if (ticket?.createdForName) {
                setPatientOrContactName(ticket.createdForName);
            }
        }
    }, [contact, patient, ticket]);

    const ticketDetailEventLog = useMemo(() => {
        return <TicketDetailEventLog ticket={ticket} control={control}
            setIsVisible={setIsDueDateVisible} isVisible={isDueDateVisible} />
    }, [ticket, isDueDateVisible]);

    const {data: childrenTicketNumbers, isFetching: isFetchingChildTicketNumbers} = useQuery([GetChildrenTicketNumbers, ticket.id],
        () => getChildrenTicketNumbers(ticket.id!), {
        enabled: !!ticket.id
    });

    return <>
        <form className='relative flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <div className='sticky top-0 flex items-center justify-between px-6 ticket-details-info-header z-10'>
                <h6>{t('ticket_detail.info_panel.details')}</h6>
                {
                    isDirty() &&
                    <div className='flex flex-row items-center'>
                        <Button onClick={resetForm} className='mr-6' buttonType='secondary' label={'common.cancel'} />
                        <Button buttonType='small' label={'common.save'} type='submit'
                            disabled={!isEmpty(control.formState.errors) || isPatientCaseNumberLoading}
                            isLoading={ticketUpdateMutation.isLoading} />
                    </div>
                }
            </div>
            {
                isFetchingChildTicketNumbers ? <Spinner size='small' /> :
                    (
                        (!!ticket?.parentTicketId || (childrenTicketNumbers && childrenTicketNumbers?.length > 0)) &&
                        <div className='border-b'>
                            <div className='px-6'>
                                <Collapsible title={'ticket_detail.info_panel.related_tickets.title'} isOpen={true}>
                                    <TicketDetailRelatedTickets ticket={ticket} childTickets={childrenTicketNumbers} />
                                </Collapsible>
                            </div>
                        </div>
                    )
            }
            <div className='border-b'>
                <div className='px-6'>
                    <Collapsible title={'ticket_detail.info_panel.ticket_info'} isOpen={true}>
                        <TicketDetailTicketInfo ticket={ticket} control={control} watch={watch} />
                    </Collapsible>
                </div>
            </div>
            <div className='border-b'>
                <div className='px-6'>
                    {patient && <Collapsible title={'ticket_detail.info_panel.patient_info'} isOpen={true}>
                        <TicketDetailPatientInfo ticket={ticket} patient={patient}
                            control={control}
                            isPatientCaseNumberLoading={isPatientCaseNumberLoading}
                            errorMessage={errors.patientCaseNumber?.message}
                            validatePatientCaseNumber={validatePatientCaseNumber} />
                    </Collapsible>}

                    <Collapsible title={'ticket_detail.info_panel.reviews.title'} isOpen={true}>
                        {
                            ticket?.patientRating && <PatientRatingSideBar ticket={{...ticket, createdForName: patientOrContactName}} />
                        }
                        <TicketReviews ticket={{...ticket, createdForName: patientOrContactName}} />
                    </Collapsible>
                    {patient && <Collapsible title={'ticket_detail.info_panel.appointments'} isOpen={true}>
                        <Link to={`/patients/${patient.patientId}?tab=1`}>
                            <span className='body2-primary'>{t('ticket_detail.info_panel.open_patient_appointments')}</span>
                        </Link>
                    </Collapsible>}
                    {contact &&
                        <Collapsible title={'ticket_detail.info_panel.contact_details.contact_info'} isOpen={true}>
                            <TicketDetailContactInfo contact={contact} />
                        </Collapsible>}
                </div>
            </div>
            <div className='border-b'>
                <div className='px-6'>
                    <Collapsible title={'ticket_detail.info_panel.attachments'} isOpen={true}>
                        <TicketDetailAttachments ticket={ticket} />
                    </Collapsible>
                </div>
            </div>
            <div className='px-6'>
                <Collapsible title={'ticket_detail.info_panel.event_log'} isOpen={true}>
                    {ticketDetailEventLog}
                </Collapsible>
            </div>
        </form>
    </>;
}

export default withErrorLogging(TicketDetailInfoPanel);
