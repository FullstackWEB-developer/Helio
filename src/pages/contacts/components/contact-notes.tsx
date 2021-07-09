import {QueryContactNotes} from '@constants/react-query-constants';
import {getContactNotes} from '@shared/services/contacts.service';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {ContactNote} from '../models/contact-note.model';
import ContactNotesItem from './contact-notes-item';
import Spinner from '@components/spinner/Spinner';
interface ContactNotesProps {
    contactId: string;
    errorAddingNote: boolean;
}
const ContactNotes = ({contactId, errorAddingNote}: ContactNotesProps) => {
    const {t} = useTranslation();

    const {data: notes, isFetching} = useQuery<ContactNote[], Error>([QueryContactNotes, contactId], () => getContactNotes(contactId));
    return (
        <div className='w-full h-full'>
            {
                errorAddingNote && <div className='text-danger mt-2 mb-2 px-8'>{t('contacts.contact-details.error_adding_note')}</div>
            }
            {
                isFetching ? <Spinner fullScreen /> :
                (
                    notes && notes.map((note) => {
                        return <ContactNotesItem note={note} key={`${note.id}`} />
                    })
                )
            }
        </div>
    )
}

export default ContactNotes;
