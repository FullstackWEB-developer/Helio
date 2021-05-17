import React, {useEffect, useRef, useState} from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {Note} from '../models/note';
import PatientNote from './patient-note';

interface PatientNotesProps {
    notes: Note[];
}
const PatientNotes: React.FC<PatientNotesProps> = ({ notes }) => {
    notes = notes || [];
    const notesTopDiv = useRef<HTMLDivElement>(null);
    const notesWrapperRef = useRef<HTMLDivElement>(null);
    const [scrollBarVisible, setScrollbarVisible] = useState<boolean>(false);
    useEffect(() => {
        notesTopDiv.current?.scrollIntoView({behavior: 'smooth'});
        if (notesWrapperRef.current && notesWrapperRef.current.scrollHeight > notesWrapperRef.current.clientHeight) {
            setScrollbarVisible(true);
        }
    }, [notes.length]);

    return <div>
        <div ref={notesWrapperRef}
             className={`patient-notes-container overflow-y-auto divide-gray-200 ${scrollBarVisible ? 'pr-2' : ''}`}
             data-test-id='patient-notes'>
            <div ref={notesTopDiv}/>
            {
                notes.map((note, index) => {
                    return <PatientNote id={index} data-test-id={'patient-note_' + index} note={note} key={index}/>
                })
            }
        </div>
    </div>
}

export default withErrorLogging(PatientNotes);
