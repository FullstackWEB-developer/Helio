import utils from '@shared/utils/utils';
import {ContactNote} from '../models/contact-note.model';
interface ContactNotesItemProps {
    note: ContactNote
}
const ContactNotesItem = ({note}: ContactNotesItemProps) => {
    return (
        <div className='flex flex-col contact-note border-b'>
            <div className='flex justify-between pt-5 pb-1'>
                <span className='body3-medium'>{note.createdOn ? utils.formatUtcDate(note.createdOn, 'MMM DD, YYYY h:mm a') : ''}</span>
                <span className='body3 note-created-by'>{note.createdByName ?? ''}</span>
            </div>
            <div className="body2 text-justify pb-5">{note.noteText}</div>
        </div>
    )
}

export default ContactNotesItem;