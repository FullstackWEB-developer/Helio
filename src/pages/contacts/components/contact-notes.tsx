import React from 'react';
import {ContactNote} from '../models/ContactNote';
import ContactNotesItem from './contact-notes-item';
interface ContactNotesProps {
    notes: ContactNote[]
}
const ContactNotes = ({notes}: ContactNotesProps) => {
    return (
        <div className='w-full h-full'>
            {
                notes && notes.map((note, index) => {
                    return <ContactNotesItem note={note} key={`${note.id}`} />
                })
            }
        </div>
    )
}

export default ContactNotes;