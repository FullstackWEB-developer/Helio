import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {Note} from '../models/note';
import dayjs from 'dayjs';
interface PatientNoteProps {
    note: Note;
    id: number;
}

const PatientNote: React.FC<PatientNoteProps> = ({ note, id }) => {

    const format = note.date.toString().endsWith('00:00:00') ? 'MMM DD, YYYY' : 'MMM DD, YYYY h:mm A';

    return <div className='flex flex-col pt-7'>
        <div className='flex flex-row justify-between'>
            <div data-test-id={'patient-note-date-' + id}
                 className='body3-medium'>{dayjs(note.date).format(format)}</div>
            <div data-test-id={'patient-note-username-' + id}
                 className='w-36 justify-end flex truncate  body3-medium'>{note.userDisplayName}</div>
        </div>
        <div data-test-id={'patient-note-text-' + id} className='py-2 body2 whitespace-pre-wrap'>{note.text}</div>
    </div>;
}

export default withErrorLogging(PatientNote);
