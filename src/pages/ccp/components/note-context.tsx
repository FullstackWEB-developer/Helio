import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { selectNoteContext, selectNotes } from '../store/ccp.selectors';
import { setNotes } from '../store/ccp.slice';
import Button from '../../../shared/components/button/button';
import TextArea from '../../../shared/components/textarea/textarea';
import { addNote } from '../../tickets/services/tickets.service';
import { TicketNote } from '../../tickets/models/ticket-note';
import NoteDetailItem from './note-detail-item';

const NoteContext = () => {
    dayjs.extend(utc);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ticketId = useSelector(selectNoteContext).ticketId;
    const username = useSelector(selectNoteContext).username;
    const notes: TicketNote[] = useSelector(selectNotes) || [];

    const [noteText, setNoteText] = useState('')

    const onSubmit = async () => {
        const note: TicketNote = {
            noteText: noteText,
            isVisibleToPatient: false
        };
        if (ticketId) {
            dispatch(addNote(ticketId, note));
            note.dateTime = new Date();
            note.username = username;
            dispatch(setNotes([...notes, note]));

            setNoteText('');
        }
    }

    const { handleSubmit, control, errors } = useForm();

    if (!ticketId) {
        return <div>{t('ccp.note_context.no_ticket_id')}</div>;
    }

    return (
        <div className={'pt-6 pl-8 pr-8 text-sm'}>
            <div className={'text-lg font-bold pb-4'}>{t('ccp.note_context.header')}</div>
            <div className='grid grid-flow-row auto-rows-max md:auto-rows-min max-h-56 overflow-y-auto overflow-x-hidden'>
                {
                    notes.map((item, key) => <NoteDetailItem key={key} item={item} />)
                }
            </div>
            <div className='flex justify-end w-full mt-5'>
                <Button label={t('ccp.note_context.copy_note')} onClick={() => { return navigator.clipboard.writeText(noteText) }} />
                <span className='text-gray-400'>
                    {dayjs.utc().format('M/DD/YYYY h:mm A')}
                </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='note'
                    control={control}
                    defaultValue={''}
                    render={() => (
                        <TextArea
                            error={errors.note?.message}
                            className={'w-full pb-4 h-20'}
                            data-test-id='note-context-notes'
                            placeholder={t('ccp.note_context.enter_your_note')}
                            value={noteText}
                            required={true}
                            rows={2}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                        />
                    )}
                />
                <div className={'flex pt-4'}>
                    <Button
                        data-test-id='note-context-save-button'
                        type={'submit'}
                        label={t('common.save')}
                        className='btn-secondary w-28'
                    />
                </div>
            </form>
        </div>
    )
}

export default withErrorLogging(NoteContext);
