import React, { useState } from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { Note } from '../models/note';
import PatientNote from './patient-note';
import { useTranslation } from 'react-i18next';

interface PatientNotesProps {
    notes: Note[];
}
const PatientNotes: React.FC<PatientNotesProps> = ({ notes }) => {
    const defaultNoteDisplayCount = 3;
    notes = notes || [];
    const [showMore, setShowMore] = useState(false);
    const { t } = useTranslation();
    const hasMore = notes.length > defaultNoteDisplayCount;
    const notesToDisplay = showMore ? notes : notes.slice(0, hasMore ? defaultNoteDisplayCount : notes.length);
    return <div>
        <div className='divide-y divide-gray-200' data-test-id='patient-notes'>
            {
                notesToDisplay.map((note, index) => {
                    return <PatientNote id={index} data-test-id={'patient-note_' + index} note={note} key={index} />
                })
            }
        </div>
        {hasMore ? <div
            data-test-id='patient-notes-show-more'
            className='flex justify-center cursor-pointer'
            onClick={() => setShowMore(!showMore)}>{t(showMore ? 'common.show_less' : 'common.show_more')}</div> : ''}
    </div>
}

export default withErrorLogging(PatientNotes);
