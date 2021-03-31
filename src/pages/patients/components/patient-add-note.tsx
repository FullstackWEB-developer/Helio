import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import TextArea from '@components/textarea/textarea';
import React, {useState} from 'react';
import {Note} from '@pages/patients/models/note';
import dayjs from 'dayjs';
import {useMutation} from 'react-query';
import {addNote} from '@pages/patients/services/patients.service';
import {setPatient} from '@pages/patients/store/patients.slice';
import {useDispatch, useSelector} from 'react-redux';
import {userFullNameSelector} from '../../../shared/store/app-user/appuser.selectors';
import {selectPatient} from '@pages/patients/store/patients.selectors';
import {useTranslation} from 'react-i18next';

const PatientAddNote = () => {

    const dispatch = useDispatch();
    const patient = useSelector(selectPatient);
    const {t} = useTranslation();
    const userFullName = useSelector(userFullNameSelector);
    const [noteText, setNoteText] = useState<string>('');
    const mutation = useMutation(addNote, {
        onSuccess: (data, variables) => {
            setNoteText('');
            let newPatient = {
                ...patient,
                notes: [variables.note, ...patient.notes]
            }
            dispatch(setPatient(newPatient));
        }
    });

    const sendNote = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (mutation.isError) {
            mutation.reset();
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            if (noteText && noteText.trim().length > 0) {
                const note: Note = {
                    date: dayjs().toDate(),
                    userDisplayName: userFullName,
                    text: noteText
                }
                mutation.mutate({patientId: patient.patientId, note});
            }
        }
    }

    return <>
        {mutation.isError && <div>{t('patient.activity.notes.note_add_error')}</div>}
        {mutation.isLoading ? <ThreeDots/> :
            <TextArea
                required={true}
                onChange={(e) => setNoteText(e.target.value)}
                hasBorder={false}
                value={noteText}
                onKeyDown={(e) => sendNote(e)}
                className='border-t w-full'
                placeholder={t('patient.activity.notes.enter_your_note')}
            />
        }
    </>
}
export default PatientAddNote;
