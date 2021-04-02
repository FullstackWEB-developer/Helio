import React, {ChangeEvent, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import Button from '../../../../shared/components/button/button';
import { Controller, useForm } from 'react-hook-form';
import TextArea from '../../../../shared/components/textarea/textarea';
import { TicketNote } from '../../models/ticket-note';
import { addNote } from '../../services/tickets.service';

interface TicketDetailAddNoteProps {
    ticket: Ticket
}

const TicketDetailAddNote = ({ ticket }: TicketDetailAddNoteProps) => {
    dayjs.extend(relativeTime)
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { handleSubmit, control, errors } = useForm();

    const [noteText, setNoteText] = useState('')

    const onSubmit = async () => {
        const note: TicketNote = {
            noteText: noteText,
            isVisibleToPatient: false
        };
        if (ticket.id) {
            dispatch(addNote(ticket.id, note));
            setNoteText('');
        }
    }

    return (
        <div className={'p-10 bg-gray-100'}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row items-center'>
                <Controller
                    name='note'
                    control={control}
                    defaultValue={''}
                    render={() => (
                        <TextArea
                            error={errors.note?.message}
                            className='w-full pb-4 h-20'
                            data-test-id='ticket-detail-note-text'
                            placeholder={t('ticket_detail.note.type_message')}
                            value={noteText}
                            rows={2}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                        />
                    )}
                />
                <div className='flex ml-4'>
                    <Button
                        data-test-id='ticket-detail-note-send-button'
                        type={'submit'}
                        label={'ticket_detail.note.send'}
                        buttonType='medium'
                    />
                </div>
            </form>
        </div>
    );
}

export default withErrorLogging(TicketDetailAddNote);
