import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {Note} from '../models/note';
import PatientNote from './patient-note';

interface PatientNotesProps {
    notes: Note[];
}
const PatientNotes: React.FC<PatientNotesProps> = ({ notes }) => {
    notes = notes || [];
    return <div>
        <div className='divide-y divide-gray-200' data-test-id='patient-notes'>
            {
                notes.map((note, index) => {
                    return <PatientNote id={index} data-test-id={'patient-note_' + index} note={note} key={index}/>
                })
            }
        </div>
    </div>
}

export default withErrorLogging(PatientNotes);
