import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {Note} from '../models/note';
import dayjs from 'dayjs';

interface PatientNoteProps {
    note: Note;
    id: number;
}

const PatientNote: React.FC<PatientNoteProps> = ({note, id}) => {
    return <div className='flex flex-col pt-7'>
                <div data-test-id={'patient-note-date-' + id} className='text-secondary-400'>{dayjs(note.date).format("MMM DD, YYYY")}</div>
                <div data-test-id={'patient-note-text-' + id} className='py-4 font-regular whitespace-pre-wrap'>{note.text}</div>
            </div>;
}

export default withErrorLogging(PatientNote);