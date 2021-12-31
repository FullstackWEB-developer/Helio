import TextArea from '@components/textarea/textarea';
import React, {useState} from 'react';
import {Note} from '@pages/patients/models/note';
import dayjs from 'dayjs';
import {useMutation} from 'react-query';
import {addNote} from '@pages/patients/services/patients.service';
import {setPatient} from '@pages/patients/store/patients.slice';
import {useDispatch, useSelector} from 'react-redux';
import {userFullNameSelector} from '@shared/store/app-user/appuser.selectors';
import {selectPatient} from '@pages/patients/store/patients.selectors';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components/svg-icon/icon';
import utc from 'dayjs/plugin/utc'
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

const PatientAddNote = () => {
    dayjs.extend(utc);
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
        },
        onError:()=> {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'patient.activity.notes.note_add_error'
            }));
        }
    });

    const sendNote = () => {
        if (mutation.isError) {
            mutation.reset();
        }
        if (noteText && noteText.trim().length > 0) {
            const note: Note = {
                date:dayjs.utc().toDate(),
                userDisplayName: userFullName,
                text: noteText
            }
            mutation.mutate({patientId: patient.patientId, note});
        }
    }
    return <>
        <div className='flex flex-row border-t w-full'>
            <TextArea
                className='body2 w-full'
                data-test-id='note-context-notes'
                placeHolder={t('patient.activity.notes.enter_your_note')}
                value={noteText}
                required={true}
                rows={2}
                maxRows={2}
                resizable={false}
                isLoading={mutation.isLoading}
                hasBorder={false}
                onChange={(message) => setNoteText(message)}
                iconClassNames='icon-medium'
                icon={Icon.Send}
                iconFill='notes-send'
                iconOnClick={() => {
                    sendNote()
                }}
            />
        </div>
    </>
}
export default PatientAddNote;
