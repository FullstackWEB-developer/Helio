import React, {ChangeEvent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { selectNoteContext } from '../store/ccp.selectors';
import Button from '../../../shared/components/button/button';
import TextArea from '../../../shared/components/textarea/textarea';
import { addNote } from '../../tickets/services/tickets.service';
import { TicketNote } from '../../tickets/models/ticket-note';
import NoteDetailItem from './note-detail-item';

const NoteContext = () => {
    dayjs.extend(utc);
    let {t} = useTranslation();
    const dispatch = useDispatch();
    let ticketId = useSelector(selectNoteContext).ticketId;
    let username = useSelector(selectNoteContext).username;

    const [noteText, setNoteText] = useState('')
    const [notes, setNotes] = useState<TicketNote[]>([]);

    const onSubmit = async () => {
        const note: TicketNote = {
            noteText: noteText,
            isVisibleToPatient: false
        };
        if(ticketId){
            dispatch(addNote(ticketId, note));
            note.dateTime = new Date();
            note.username = username;
            setNotes([...notes, note]);
            setNoteText('');
        }
    }

    const { handleSubmit, control, errors } = useForm();

    if (!ticketId) {
        return <div>{t('ccp.note_context.no_ticket_id')}</div>;
    }

    return(
        <div className={"pt-6 pl-8 pr-8 text-sm"}>
            <div className={"text-lg font-bold pb-4"}>{t('ccp.note_context.header')}</div>
            <div className="grid grid-flow-row auto-rows-max md:auto-rows-min max-h-56 overflow-y-auto overflow-x-hidden">
                {
                    notes.map((item, key) => <NoteDetailItem key={key} item={item} />)
                }
            </div>
            <div className='flex justify-end w-full mt-5'>
                <button
                    className="pr-10 text-gray-900"
                    onClick={() => {return navigator.clipboard.writeText(noteText) }}
                >
                    {t('ccp.note_context.copy_note')}
                </button>
                <span className="text-gray-400">
                    { dayjs.utc().format('M/DD/YYYY h:mm A') }
                </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="note"
                    control={control}
                    defaultValue={''}
                    render={() => (
                        <TextArea
                            error={errors.note?.message}
                            className={"w-full pb-4 h-20"}
                            data-test-id="note-context-notes"
                            placeholder={t('ccp.note_context.enter_your_note')}
                            value={noteText}
                            required={true}
                            rows={2}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                        />
                    )}
                />
                <div className={"flex pt-4"}>
                    <Button
                        data-test-id="note-context-save-button"
                        type={'submit'}
                        label={t('common.save')}
                        className="btn-secondary w-28"
                    />
                </div>
            </form>
        </div>
    )
}

export default withErrorLogging(NoteContext);
