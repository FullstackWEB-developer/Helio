import Tab from '@components/tab/Tab';
import Tabs from '@components/tab/Tabs';
import {ContactExtended} from '@shared/models/contact.model';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ContactHeader from './contact-header';
import IndividualContactDetails from './individual-contact-details';
import CompanyContactDetails from './company-contact-details';
import ContactNotes from './contact-notes';
import TextArea from '@components/textarea/textarea';
import {ContactNote} from '../models/contact-note.model';
import {useDispatch, useSelector} from 'react-redux';
import {userFullNameSelector} from '@shared/store/app-user/appuser.selectors';
import ContactTickets from './contact-tickets';
import {ContactType} from '@shared/models/contact-type.enum';
import {useMutation, useQueryClient} from 'react-query';
import {addContactNote, deleteContact, toggleFavoriteContact} from '@shared/services/contacts.service';
import Confirmation from '@components/confirmation/confirmation';
import {QueryContactNotes} from '@constants/react-query-constants';
import {Icon} from '@components/svg-icon/icon';
import utils from '@shared/utils/utils';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

interface ContactDetailsProps {
    contact: ContactExtended;
    editMode: boolean;
    editIconClickHandler?: () => void;
    addNewContactHandler: (parentContact?: ContactExtended) => void;
    onUpdateSuccess: (contact: ContactExtended) => void;
    onUpdateError?: () => void;
    onToggleFavoriteSuccess: () => void;
    onDeleteSuccess: (contactId: string) => void;
    onDeleteError?: () => void;
}
const ContactDetails = ({contact,
    editMode,
    editIconClickHandler,
    addNewContactHandler,
    onUpdateSuccess,
    onUpdateError,
    onToggleFavoriteSuccess,
    onDeleteSuccess,
    onDeleteError
}: ContactDetailsProps) => {
    const {t} = useTranslation();
    const [selectedTab, setSelectedTab] = useState(-1);
    const [note, setNote] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const dispatch = useDispatch();
    const noteSectionStart = useRef<HTMLDivElement>(null);
    const userFullName = useSelector(userFullNameSelector);
    const isCompany = contact.type === ContactType.Company;
    const queryClient = useQueryClient();

    const addNoteMutation = useMutation(addContactNote, {
        onSuccess: (_, variables) => {
            queryClient.setQueryData([QueryContactNotes, contact.id], (notes: any) => [variables.contactNoteDto, ...notes]);
            noteSectionStart.current?.scrollIntoView({behavior: 'smooth'});
            setNote('');
        }
    });

    const addNote = () => {
        const newNote: ContactNote = {
            noteText: note,
            createdOn: new Date(),
            createdByName: userFullName,
            contactId: contact.id || ''
        }
        if (contact.id && !addNoteMutation.isLoading) {
            addNoteMutation.mutate({contactId: contact.id, contactNoteDto: newNote});
        }
    }

    const toggleFavoriteMutation = useMutation(toggleFavoriteContact, {
        onSuccess: () => {
            onToggleFavoriteSuccess();
        },
        onError:() => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'contacts.contact_details.error_favorite_contact'
            }))
        }
    })
    const starIconClickHandler = () => {
        if (contact?.id) {
            toggleFavoriteMutation.mutate(contact?.id);
        }
    }

    const deleteContactMutation = useMutation(deleteContact, {
        onSuccess: (data, variables) => {
            onDeleteSuccess(variables);
        },
        onError: () => onDeleteError && onDeleteError()
    })

    const deleteIconClickHandler = () => {
        if (contact.id) {
            setConfirmDeleteOpen(true);
        }
    }

    const onDeleteConfirm = () => {
        setConfirmDeleteOpen(false);
        if (contact.id) {
            deleteContactMutation.mutate(contact.id);
        }
    }
    const onDeleteCancel = () => {
        setConfirmDeleteOpen(false);
    }

    const ContactInnerDetails = () => {
        if (!isCompany) {
            return (<IndividualContactDetails
                contact={contact}
                editMode={editMode}
                initiateACall={utils.initiateACall}
                closeEditMode={editIconClickHandler}
                onUpdateSuccess={onUpdateSuccess}
                onUpdateError={onUpdateError} />);
        }
        return (<CompanyContactDetails
            contact={contact}
            editMode={editMode}
            initiateACall={utils.initiateACall}
            addNewContactHandler={() => addNewContactHandler(contact)}
            closeEditMode={editIconClickHandler}
            onUpdateSuccess={onUpdateSuccess}
            onUpdateError={onUpdateError} />);
    }

    return (
        <div className={`flex flex-grow flex-col overflow-y-${selectedTab === 1 ? 'hidden' : 'auto'} relative`}>
            <ContactHeader contact={contact}
                editMode={editMode}
                editIconClickHandler={editIconClickHandler}
                starIconClickHandler={starIconClickHandler}
                deleteIconClickHandler={deleteIconClickHandler}
                isStarring={toggleFavoriteMutation.isLoading}
                isDeleting={deleteContactMutation.isLoading} />
            <div className='px-8 pt-4 w-full'>
                <Tabs onSelect={(selectedTabIndex) => {setSelectedTab(selectedTabIndex)}}>
                    <Tab title={`${t('contacts.contact_details.details')}`}>
                        <div className='pt-8 overflow-x-hidden'>
                            <ContactInnerDetails />
                        </div>
                    </Tab>
                    <Tab title={`${t('contacts.contact_details.notes')}`}>
                        <div className='pt-4 overflow-x-hidden overflow-y-auto contact-notes-section'>
                            <div ref={noteSectionStart} />
                            <ContactNotes errorAddingNote={addNoteMutation.isError} contactId={contact.id!} />
                        </div>
                    </Tab>
                    <Tab title={`${t('contacts.contact_details.tickets')}`}>
                        <div className='pt-2'>
                            <ContactTickets contactId={contact.id!} />
                        </div>
                    </Tab>
                </Tabs>
            </div>
            {
                selectedTab === 1 &&
                <div className='absolute bottom-0 w-full border-t bg-white'>
                    <TextArea className='w-full body2'
                        value={note}
                        resizable={false}
                        hasBorder={false}
                        iconFill='contact-light-fill'
                        placeHolder={t('contacts.contact_details.enter_note')}
                        iconContainerClassName='pr-6 bottom-auto'
                        iconClassNames='icon-medium'
                        rows={2}
                        maxRows={2}
                        icon={Icon.Send}
                        isLoading={addNoteMutation.isLoading}
                        onChange={(message) => {
                            setNote(message);
                        }}
                        iconOnClick={() => {
                            addNote();
                        }}
                    />
                </div>
            }
            <Confirmation title={t('contacts.contact_details.confirm_delete_title', {contact: isCompany ? contact.companyName : `${contact?.firstName} ${contact?.lastName}`})}
                okButtonLabel={t('contacts.contact_details.confirm_delete_yes')} isOpen={confirmDeleteOpen}
                onOk={onDeleteConfirm} onCancel={onDeleteCancel} onClose={onDeleteCancel} closeableOnEscapeKeyPress={true} />
        </div>
    )
}

export default ContactDetails;
