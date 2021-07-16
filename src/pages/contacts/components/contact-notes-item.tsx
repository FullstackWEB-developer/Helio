import utils from '@shared/utils/utils';
import {ContactNote} from '../models/contact-note.model';
interface ContactNotesItemProps {
    note: ContactNote
}
const ContactNotesItem = ({note}: ContactNotesItemProps) => {
    return (
        <div className='flex flex-col contact-note border-b'>
            <div className='flex justify-between pt-5 pb-1'>
                <div>
                    <span className='body3-medium'>{note.createdOn ? utils.formatUtcDate(note.createdOn, 'MMM D, YYYY') : ''}</span>
                    <span className='body3-medium ml-4'>{note.createdOn ? utils.formatUtcDate(note.createdOn, 'h:mm a') : ''}</span>
                </div>
                <span className='body3 note-created-by pr-6'>{note.createdByName ?? ''}</span>
            </div>
            <div className="body2 text-justify pr-6 pb-5">{note.noteText}</div>
        </div>
    )
}

export default ContactNotesItem;
